import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, Check, ChevronRight, Home as HomeIcon, Info, Lightbulb, RotateCcw, Sparkles, Volume2, VolumeX } from "lucide-react";
import { allThemeIds, getLevel, getTheme, themes, type GameObject, type ThemeId } from "@/game/data";
import { areAllThemesComplete, isCorrectDrop, isThemeComplete, progressKey } from "@/game/interaction";

type Screen = "cover" | "menu" | "levels" | "play" | "about" | "instructions" | "complete";
type MovementScore = { score: number; distance: number; turns: number; label: string };
type DragState = { object: GameObject; x: number; y: number; path: Array<{ x: number; y: number }>; startedAt: number } | null;

const successMessages = ["Hebat sekali! ⭐", "Kamu berhasil!", "Bagus! Ayo lanjut bermain!", "Wah, kamu pintar mengenal lingkungan!"];
const retryMessages = ["Coba lagi 😊", "Ayo cari yang cocok!", "Pelan-pelan, kamu pasti bisa!"];

function shuffleObjects(objects: GameObject[]) {
  const shuffled = [...objects];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }
  if (shuffled.length > 1 && shuffled.every((object, index) => object.id === objects[index].id)) {
    [shuffled[0], shuffled[1]] = [shuffled[1], shuffled[0]];
  }
  return shuffled;
}

function scoreMovement(path: Array<{ x: number; y: number }>): MovementScore {
  if (path.length < 2) return { score: 35, distance: 0, turns: 0, label: "Mulai bergerak" };
  let distance = 0;
  let turns = 0;
  let previousAngle: number | null = null;
  path.slice(1).forEach((point, index) => {
    const previous = path[index];
    const dx = point.x - previous.x;
    const dy = point.y - previous.y;
    distance += Math.hypot(dx, dy);
    if (Math.hypot(dx, dy) > 5) {
      const angle = Math.atan2(dy, dx);
      if (previousAngle !== null && Math.abs(angle - previousAngle) > 0.42) turns += 1;
      previousAngle = angle;
    }
  });
  const score = Math.min(100, Math.max(35, Math.round(48 + Math.min(distance / 24, 28) + Math.min(turns * 4, 24))));
  return { score, distance: Math.round(distance), turns, label: score >= 80 ? "Gerak hebat!" : score >= 60 ? "Gerak bagus!" : "Terus berlatih!" };
}

function loadCompleted() {
  try {
    return new Set<string>(JSON.parse(localStorage.getItem("lingkunganku-progress") ?? "[]"));
  } catch {
    return new Set<string>();
  }
}

export default function Home() {
  const [screen, setScreen] = useState<Screen>(new URLSearchParams(window.location.search).has("demo") ? "play" : "cover");
  const [themeId, setThemeId] = useState<ThemeId>("home");
  const [levelNumber, setLevelNumber] = useState(1);
  const [completed, setCompleted] = useState<Set<string>>(loadCompleted);
  const [placed, setPlaced] = useState<Set<string>>(new Set());
  const [occupiedZones, setOccupiedZones] = useState<Set<string>>(new Set());
  const [dragging, setDragging] = useState<DragState>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ kind: "success" | "retry"; text: string } | null>(null);
  const [movementScore, setMovementScore] = useState<MovementScore | null>(null);
  const [modal, setModal] = useState<"level" | "all" | null>(null);
  const [soundOn, setSoundOn] = useState(true);
  const audioRef = useRef<AudioContext | null>(null);

  const theme = useMemo(() => getTheme(themeId), [themeId]);
  const level = useMemo(() => getLevel(themeId, levelNumber), [themeId, levelNumber]);
  const shuffledObjects = useMemo(() => shuffleObjects(level.objects), [level]);
  const remaining = shuffledObjects.filter((object) => !placed.has(object.id));
  const themeCompleted = isThemeComplete(themeId, completed);

  const beep = useCallback((frequency = 560, duration = 0.08, type: OscillatorType = "sine") => {
    if (!soundOn) return;
    try {
      const AudioCtx = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      audioRef.current ??= new AudioCtx();
      const ctx = audioRef.current;
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.type = type;
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      oscillator.start();
      oscillator.stop(ctx.currentTime + duration);
    } catch {
      // Audio is an enhancement; the game remains playable without it.
    }
  }, [soundOn]);

  const speak = useCallback((text: string) => {
    if (soundOn && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "id-ID";
      utterance.rate = 0.86;
      utterance.pitch = 1.08;
      window.speechSynthesis.speak(utterance);
    }
    beep(620, 0.09);
  }, [beep, soundOn]);

  const speakWelcome = useCallback(() => {
    speak("Halo! Selamat datang di game Drag and Drop Lingkunganku!");
  }, [speak]);

  useEffect(() => {
    if (screen !== "cover" || !soundOn) return;
    const timer = window.setTimeout(speakWelcome, 450);
    return () => window.clearTimeout(timer);
  }, [screen, soundOn, speakWelcome]);

  const showNotice = useCallback((kind: "success" | "retry", text: string) => {
    setNotice({ kind, text });
    window.setTimeout(() => setNotice(null), 1500);
  }, []);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      const button = (event.target as HTMLElement).closest("button");
      if (!button || button.disabled || button.classList.contains("object-card")) return;
      beep(430, 0.055, "triangle");
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [beep]);

  const openLevel = useCallback((nextTheme: ThemeId, nextLevel: number) => {
    setThemeId(nextTheme);
    setLevelNumber(nextLevel);
    setPlaced(new Set());
    setOccupiedZones(new Set());
    setSelectedId(null);
    setNotice(null);
    setMovementScore(null);
    setModal(null);
    setScreen("play");
    beep(540, 0.07);
  }, [beep]);

  const saveCompleted = useCallback((next: Set<string>) => {
    setCompleted(next);
    localStorage.setItem("lingkunganku-progress", JSON.stringify(Array.from(next)));
  }, []);

  const tryDrop = useCallback((objectId: string, zoneId: string, movement?: MovementScore) => {
    const object = level.objects.find((item) => item.id === objectId);
    if (!object || placed.has(objectId) || occupiedZones.has(zoneId)) return;
    if (isCorrectDrop(object, zoneId)) {
      const nextPlaced = new Set(placed);
      nextPlaced.add(objectId);
      setPlaced(nextPlaced);
      setOccupiedZones((current) => new Set(current).add(zoneId));
      setSelectedId(null);
      if (movement) setMovementScore(movement);
      beep(760, 0.12, "triangle");
      showNotice("success", "Pas sekali! ⭐");
      if (nextPlaced.size === level.objects.length) {
        const nextCompleted = new Set(completed);
        nextCompleted.add(progressKey(themeId, levelNumber));
        saveCompleted(nextCompleted);
        window.setTimeout(() => {
          if (areAllThemesComplete(allThemeIds, nextCompleted)) {
            setModal("all");
          } else {
            setModal("level");
          }
        }, 650);
      }
    } else {
      beep(220, 0.13, "sine");
      showNotice("retry", retryMessages[Math.floor(Math.random() * retryMessages.length)]);
    }
  }, [beep, completed, level.objects, levelNumber, occupiedZones, placed, saveCompleted, showNotice, themeId]);

  useEffect(() => {
    if (!dragging) return;
    const onMove = (event: PointerEvent) => setDragging((current) => {
      if (!current) return current;
      const nextPoint = { x: event.clientX, y: event.clientY };
      const lastPoint = current.path[current.path.length - 1];
      const nextPath = !lastPoint || Math.hypot(nextPoint.x - lastPoint.x, nextPoint.y - lastPoint.y) > 4 ? [...current.path, nextPoint].slice(-140) : current.path;
      return { ...current, x: event.clientX, y: event.clientY, path: nextPath };
    });
    const onUp = (event: PointerEvent) => {
      const target = document.elementFromPoint(event.clientX, event.clientY)?.closest<HTMLElement>("[data-drop-id]");
      if (target?.dataset.dropId) tryDrop(dragging.object.id, target.dataset.dropId, scoreMovement(dragging.path));
      setDragging(null);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp, { once: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [dragging, tryDrop]);

  const beginDrag = (object: GameObject, event: React.PointerEvent<HTMLButtonElement>) => {
    if (placed.has(object.id)) return;
    event.preventDefault();
    speak(object.label);
    setSelectedId(object.id);
    setDragging({ object, x: event.clientX, y: event.clientY, path: [{ x: event.clientX, y: event.clientY }], startedAt: performance.now() });
  };

  const selectObject = (object: GameObject) => {
    if (placed.has(object.id)) return;
    setSelectedId(object.id);
    speak(object.label);
  };

  const goMenu = () => {
    setScreen("menu");
    setModal(null);
    setNotice(null);
    setMovementScore(null);
    setDragging(null);
    beep(430, 0.06);
  };

  const resetProgress = () => {
    const blank = new Set<string>();
    saveCompleted(blank);
    setPlaced(new Set());
    setOccupiedZones(new Set());
    setModal(null);
    beep(320, 0.1);
  };

  return (
    <main className="game-shell" style={{ "--theme-color": theme.color, "--theme-soft": theme.lightColor } as React.CSSProperties}>
      <div className="sun-orb" aria-hidden="true" />
      <div className="cloud cloud-one" aria-hidden="true" />
      <div className="cloud cloud-two" aria-hidden="true" />

      {screen === "cover" && <Cover onStart={() => { setScreen("menu"); beep(650, 0.08); }} onSpeak={speakWelcome} onAbout={() => setScreen("about")} onInstructions={() => setScreen("instructions")} />}
      {screen === "menu" && <Menu onChoose={(id) => { setThemeId(id); setScreen("levels"); }} onAbout={() => setScreen("about")} onInstructions={() => setScreen("instructions")} onHome={() => setScreen("cover")} completed={completed} />}
      {screen === "levels" && <Levels theme={theme} completed={completed} onBack={goMenu} onChoose={(number) => openLevel(themeId, number)} />}
      {screen === "play" && <Play theme={theme} level={level} placed={placed} occupiedZones={occupiedZones} remaining={remaining} objects={shuffledObjects} selectedId={selectedId} notice={notice} movementScore={movementScore} soundOn={soundOn} themeCompleted={themeCompleted} onToggleSound={() => setSoundOn((value) => !value)} onBack={() => setScreen("levels")} onMenu={goMenu} onChooseObject={selectObject} onBeginDrag={beginDrag} onDrop={tryDrop} />}
      {screen === "about" && <InfoPage kind="about" onBack={() => setScreen("cover")} onMenu={goMenu} />}
      {screen === "instructions" && <InfoPage kind="instructions" onBack={() => setScreen("cover")} onMenu={goMenu} />}
      {screen === "complete" && <CompleteScreen onMenu={goMenu} onReset={resetProgress} />}

      {dragging && <div className="drag-ghost" style={{ left: dragging.x, top: dragging.y }} aria-hidden="true">{dragging.object.image ? <img src={dragging.object.image} alt="" /> : <span>{dragging.object.emoji}</span>}</div>}

      {modal && <SuccessModal kind={modal} theme={theme} levelNumber={levelNumber} onNext={() => {
        if (modal === "all") {
          setModal(null);
          setScreen("complete");
        } else {
          setModal(null);
          setScreen("levels");
        }
      }} onMenu={goMenu} />}
    </main>
  );
}

function BrandMark() {
  return <div className="brand-mark" aria-label="Lingkunganku"><span>🌈</span><div><strong>LINGKUNGANKU</strong><small>belajar sambil bermain</small></div></div>;
}

function TopBar({ onMenu, onBack, label }: { onMenu: () => void; onBack?: () => void; label?: string }) {
  return <header className="top-bar"><button className="icon-button" onClick={onMenu} aria-label="Menu utama"><HomeIcon size={22} /></button><div className="top-label">{label ?? "Game Drag and Drop"}</div>{onBack ? <button className="back-chip" onClick={onBack}><ArrowLeft size={18} /> Kembali</button> : <BrandMark />}</header>;
}

function Cover({ onStart, onSpeak, onAbout, onInstructions }: { onStart: () => void; onSpeak: () => void; onAbout: () => void; onInstructions: () => void }) {
  return <section className="cover-screen">
    <div className="cover-art" aria-hidden="true"><div className="cover-art-overlay" /><div className="art-badge">🌱 ruang bermain & belajar</div></div>
    <div className="cover-content">
      <BrandMark />
      <div className="mascot-welcome"><img src="/assets/ui/maskot.webp" alt="Maskot burung biru melambaikan tangan" loading="eager" decoding="async" /><button className="mascot-speech" onClick={onSpeak} aria-label="Dengarkan sapaan selamat datang">Halo! Selamat datang di game Drag and Drop Lingkunganku! <Volume2 size={16} /></button></div>
      <div className="cover-kicker"><Sparkles size={17} /> permainan edukasi usia 5–6 tahun</div>
      <h1>GAME DRAG AND DROP<br /><em>LINGKUNGANKU</em></h1>
      <p>Yuk kenali rumah, sekolah, dan lingkungan di sekitar kita dengan cara yang seru!</p>
      <div className="cover-actions"><button className="primary-button giant" onClick={onStart}>▶ <span>MULAI BERMAIN</span></button><div className="secondary-actions"><button className="soft-button" onClick={onAbout}><BookOpen size={19} /> Tentang / Materi</button><button className="soft-button" onClick={onInstructions}><Lightbulb size={19} /> Instruksi Game</button></div></div>
      <div className="cover-tip"><span>✨</span><div><strong>Belajar dengan lembut</strong><small>Tidak ada jawaban salah — coba lagi sampai berhasil!</small></div></div>
    </div>
    <div className="cover-footnote"><span>🏠</span><span>🏫</span><span>🌳</span><span>🚌</span><span>🗑️</span><span>dibuat untuk bermain bersama</span></div>
  </section>;
}

function Menu({ onChoose, onAbout, onInstructions, onHome, completed }: { onChoose: (id: ThemeId) => void; onAbout: () => void; onInstructions: () => void; onHome: () => void; completed: Set<string> }) {
  return <section className="page-frame menu-page"><TopBar onMenu={onHome} label="Pilih petualanganmu" /><div className="page-heading"><div><span className="eyebrow">TEMA BESAR</span><h2>LINGKUNGANKU <span>🌍</span></h2><p>Pilih subtema yang ingin kamu mainkan. Bebas mulai dari mana saja!</p></div><div className="mini-actions"><button className="round-action" onClick={onInstructions} aria-label="Instruksi"><Lightbulb size={20} /></button><button className="round-action" onClick={onAbout} aria-label="Tentang"><Info size={20} /></button></div></div><div className="theme-grid">{themes.map((item, index) => <ThemeCard key={item.id} theme={item} index={index} done={isThemeComplete(item.id, completed)} onClick={() => onChoose(item.id)} />)}</div><div className="menu-footer"><span>⭐ Selesaikan semua subtema untuk mendapat kejutan!</span><button className="text-button" onClick={onHome}><ArrowLeft size={17} /> Halaman cover</button></div></section>;
}

function ThemeCard({ theme, index, done, onClick }: { theme: typeof themes[number]; index: number; done: boolean; onClick: () => void }) {
  return <button className="theme-card" style={{ "--card-color": theme.color, "--card-soft": theme.lightColor, "--delay": `${index * 70}ms` } as React.CSSProperties} onClick={onClick}><div className="card-topline"><span className="theme-number">0{index + 1}</span>{done ? <span className="done-pill"><Check size={13} /> selesai</span> : <span className="arrow-circle"><ChevronRight size={18} /></span>}</div><div className="theme-visual">{theme.image ? <img src={theme.image} alt="" loading="lazy" decoding="async" /> : <span>{theme.icon}</span>}</div><h3>{theme.shortTitle}</h3><p>{theme.description}</p><div className="level-dots">{[1, 2, 3, 4, 5].map((level) => <i key={level} className={done || false ? "filled" : ""} />)}</div><span className="card-cta">Lihat level <ArrowRight size={16} /></span></button>;
}

function Levels({ theme, completed, onBack, onChoose }: { theme: typeof themes[number]; completed: Set<string>; onBack: () => void; onChoose: (level: number) => void }) {
  return <section className="page-frame levels-page" style={{ "--theme-color": theme.color, "--theme-soft": theme.lightColor } as React.CSSProperties}><TopBar onMenu={onBack} onBack={onBack} label={`Subtema • ${theme.title}`} /><div className="level-heading"><div className="level-theme-icon">{theme.icon}</div><div><span className="eyebrow">SUBTEMA TERPILIH</span><h2>{theme.title}</h2><p>{theme.description} Pilih level secara bebas.</p></div></div><div className="level-list">{theme.levels.map((item) => { const done = completed.has(progressKey(theme.id, item.level)); return <button key={item.level} className={`level-card ${done ? "level-done" : ""}`} onClick={() => onChoose(item.level)}><span className="level-bubble">{done ? <Check size={25} /> : item.level}</span><img className="level-art" src={item.art} alt="" loading="lazy" decoding="async" /><div><strong>{item.title}</strong><small>{item.difficulty} • {item.objects.length} benda • {item.zones.length} tempat tujuan</small></div><span className="level-arrow"><ChevronRight size={21} /></span></button>; })}</div><div className="levels-note"><span>💡</span><p><strong>Tips:</strong> Klik gambar untuk mendengar namanya. Lalu tekan dan seret ke tempat yang cocok.</p></div></section>;
}

function Play({ theme, level, placed, occupiedZones, remaining, objects, selectedId, notice, movementScore, soundOn, themeCompleted, onToggleSound, onBack, onMenu, onChooseObject, onBeginDrag, onDrop }: { theme: typeof themes[number]; level: ReturnType<typeof getLevel>; placed: Set<string>; occupiedZones: Set<string>; remaining: GameObject[]; objects: GameObject[]; selectedId: string | null; notice: { kind: "success" | "retry"; text: string } | null; movementScore: MovementScore | null; soundOn: boolean; themeCompleted: boolean; onToggleSound: () => void; onBack: () => void; onMenu: () => void; onChooseObject: (object: GameObject) => void; onBeginDrag: (object: GameObject, event: React.PointerEvent<HTMLButtonElement>) => void; onDrop: (objectId: string, zoneId: string, movement?: MovementScore) => void }) {
  const progress = Math.round((placed.size / level.objects.length) * 100);
      return <section className={`page-frame play-page play-level-${level.level}`}><TopBar onMenu={onMenu} onBack={onBack} label={`${theme.icon} ${theme.title}`} /><div className="play-header"><div><div className="crumb"><span onClick={onMenu}>Lingkunganku</span><ChevronRight size={14} /><span>{theme.title}</span></div><h2>{level.title} <span className="sparkle-dot">✦</span></h2><p>{level.intro}</p></div><div className="play-tools"><img className="play-level-art" src={level.art} alt="" loading="eager" decoding="async" /><button className="round-action" onClick={onToggleSound} aria-label={soundOn ? "Matikan suara" : "Nyalakan suara"}>{soundOn ? <Volume2 size={19} /> : <VolumeX size={19} />}</button><div className="progress-box"><span>PROGRES</span><strong>{placed.size}/{level.objects.length}</strong><div className="progress-track"><i style={{ width: `${progress}%` }} /></div></div></div></div><div className="instruction-ribbon"><span>👆</span><strong>Tekan & seret</strong><span>gambar ke tempat yang cocok</span>{selectedId && <small>atau pilih tempatnya sekarang!</small>}</div>{movementScore && <div className="movement-meter"><span>🖐️</span><strong>{movementScore.label}</strong><b>{movementScore.score}</b><small>skor gerak</small></div>}<div className="game-board preschool-board"><div className="objects-panel"><div className="panel-heading"><div><span className="eyebrow">BENDA</span><h3>Mana tempatnya?</h3></div><span className="count-pill">{remaining.length} tersisa</span></div><div className="object-list">{objects.map((object) => <button key={object.id} className={`object-card ${placed.has(object.id) ? "object-placed" : ""} ${selectedId === object.id ? "object-selected" : ""}`} onPointerDown={(event) => onBeginDrag(object, event)} onClick={() => onChooseObject(object)} disabled={placed.has(object.id)} aria-label={`${object.label}. ${placed.has(object.id) ? "Sudah ditempatkan" : "Tekan untuk mendengar nama"}`}>{object.image ? <img className="object-image" src={object.image} alt="" /> : <span className="object-emoji">{object.emoji}</span>}<span className="object-label">{object.label}</span>{placed.has(object.id) ? <Check className="object-check" size={24} /> : <Volume2 className="object-sound" size={18} />}</button>)}</div><p className="panel-hint"><Volume2 size={14} /> Klik gambar untuk mendengar nama benda</p></div><div className="destinations-panel"><div className="panel-heading"><div><span className="eyebrow">TEMPAT TUJUAN</span><h3>Temukan rumahnya!</h3></div><span className="destination-hint">{themeCompleted ? "⭐ Hebat!" : "seret ke sini"}</span></div><div className="zone-grid">{level.zones.map((zone, zoneIndex) => <button key={zone.id} data-drop-id={zone.id} className={`drop-zone zone-${zone.shape} ${selectedId ? "zone-ready" : ""} ${occupiedZones.has(zone.id) ? "zone-used" : ""}`} style={{ "--zone-color": zone.color, "--drop-shift": `${((level.level + zoneIndex) % 3 - 1) * 7}px`, "--drop-tilt": `${((level.level + zoneIndex) % 3 - 1) * 2}deg` } as React.CSSProperties} onClick={() => selectedId && !occupiedZones.has(zone.id) && onDrop(selectedId, zone.id)} disabled={occupiedZones.has(zone.id)}><span className="zone-sticker">{zone.image ? <img src={zone.image} alt="" /> : zone.emoji}</span><span className="zone-label">{zone.label}</span><span className="zone-slot">{occupiedZones.has(zone.id) ? "sudah cocok" : "letakkan di sini"}</span></button>)}</div></div></div>{notice && <div className={`feedback-toast ${notice.kind}`}><span>{notice.kind === "success" ? "⭐" : "🌈"}</span><strong>{notice.text}</strong></div>}</section>;
}

function InfoPage({ kind, onBack, onMenu }: { kind: "about" | "instructions"; onBack: () => void; onMenu: () => void }) {
  const about = kind === "about";
  return <section className="page-frame info-page"><TopBar onMenu={onMenu} onBack={onBack} label={about ? "Tentang Game" : "Cara Bermain"} /><div className="info-layout"><div className="info-hero"><div className="info-bubble">{about ? "📖" : "🧩"}</div><span className="eyebrow">{about ? "TENTANG GAME" : "CARA BERMAIN"}</span><h2>{about ? "Belajar mengenal lingkungan dengan cara seru!" : "Ayo bermain bersama!"}</h2><p>{about ? "Game Drag and Drop Lingkunganku adalah permainan edukatif untuk mengenalkan anak pada lingkungan di sekitar mereka melalui aktivitas mencocokkan dan menyeret gambar." : "Ikuti langkah sederhana berikut. Tidak perlu takut salah — kamu bisa mencoba lagi kapan saja."}</p></div><div className="info-content">{about ? <><h3>5 subtema yang bisa dipilih</h3><div className="topic-list">{themes.map((theme) => <div key={theme.id}><span style={{ background: theme.lightColor }}>{theme.icon}</span><div><strong>{theme.title}</strong><small>{theme.description}</small></div></div>)}</div><div className="info-quote">🌿 Bermain, mencoba, dan mengenal lingkungan sekitar — satu benda setiap kali.</div></> : <><h3>Langkah bermain</h3><div className="step-list">{["Pilih subtema Lingkunganku.", "Pilih level 1–5.", "Klik gambar untuk mendengarkan nama objek.", "Tekan dan seret gambar.", "Letakkan gambar pada tempat yang sesuai.", "Jika benar, muncul apresiasi. Jika belum, coba lagi.", "Selesaikan semua level dan subtema."] .map((step, index) => <div key={step}><span>{index + 1}</span><p>{step}</p></div>)}</div><div className="info-quote">⭐ Setiap usaha itu hebat. Yuk bermain dengan tenang!</div></>}</div></div><button className="primary-button info-back" onClick={onBack}><ArrowLeft size={19} /> Kembali</button></section>;
}

function SuccessModal({ kind, theme, levelNumber, onNext, onMenu }: { kind: "level" | "all"; theme: typeof themes[number]; levelNumber: number; onNext: () => void; onMenu: () => void }) {
  const all = kind === "all";
  return <div className="modal-backdrop"><div className={`success-modal ${all ? "all-success" : ""}`}><div className="confetti confetti-a">✦</div><div className="confetti confetti-b">✦</div>{all ? <img className="celebration-art" src="/assets/ui/celebration.webp" alt="Anak bersorak merayakan keberhasilan" loading="eager" decoding="async" /> : <div className="success-icon">⭐</div>}<span className="eyebrow">{all ? "PENCAPAIAN BESAR" : `${theme.icon} ${theme.title} • LEVEL ${levelNumber}`}</span><h2>{all ? "HEBAT!" : "Kamu berhasil!"}</h2><p>{all ? "Kamu sudah menyelesaikan semua permainan Lingkunganku! Kamu hebat dalam mengenal lingkungan di sekitarmu!" : successMessages[levelNumber % successMessages.length]}</p><div className="modal-stars">⭐ ⭐ ⭐</div><div className="modal-actions"><button className="primary-button" onClick={onNext}>{all ? "Lihat kejutan" : "Pilih level lagi"} <ArrowRight size={19} /></button><button className="text-button" onClick={onMenu}>🏠 Menu utama</button></div></div></div>;
}

function CompleteScreen({ onMenu, onReset }: { onMenu: () => void; onReset: () => void }) {
  return <section className="complete-screen"><div className="complete-card"><div className="complete-rainbow">🌈</div><span className="eyebrow">PENCAPAIAN SPESIAL</span><h1>HEBAT!</h1><p>Kamu sudah menyelesaikan semua permainan <strong>Lingkunganku</strong>!</p><div className="celebrate-row"><span>🏠</span><span>🏫</span><span>🌳</span><span>🏞️</span><span>🗑️</span></div><p className="complete-sub">Kamu hebat dalam mengenal lingkungan di sekitarmu! ⭐</p><div className="complete-actions"><button className="primary-button" onClick={onMenu}><HomeIcon size={19} /> Main lagi</button><button className="text-button" onClick={onReset}><RotateCcw size={16} /> Ulangi progres</button></div></div></section>;
}
