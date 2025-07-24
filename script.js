/* Final Upgraded script.js - Music Player with Placeholder Support */

const songs = [
  {
    title: "Saiyaara",
    artist: "Mohit Chauhan",
    src: "assets/songs/saiyaara.mp3",
    cover: "assets/covers/saiyaara.jpg",
    video: "assets/videos/saiyaara.mp4",
    lyrics: `Saaiyaara... Main saaiyaara...\nSitaaron se bhari... koi raat ho...` 
  },
  {
    title: "Pal Pal",
    artist: "Afusic",
    src: "assets/songs/palpal.mp3",
    cover: "assets/covers/palpal.jpg",
    video: "assets/videos/bgvideo.mp4",
    lyrics: `Pal pal jeena muhal\nmera tere bina...`
  },
  {
    title: "Kitni Hasrat Hai",
    artist: "Kumar Sanu | Sadhana Sargam",
    src: "assets/songs/hasrat.mp3",
    cover: "assets/covers/hasrat.jpg",
    video: "assets/videos/bgvideo.mp4",
    lyrics: `Kitni hasrat hai humein\nTumse dil lagane ki\nPar tumhari toh aadat hai\nDil jalane ki...`
  },
  {
    title: "Barbaad",
    artist: "Jubin Nautiyal",
    src: "assets/songs/barbaad.mp3",
    cover: "assets/covers/barbaad.jpg",
    video: "assets/videos/bgvideo.mp4",
    lyrics: ""
  }
];

// 🔽 The rest of the player logic stays unchanged...

let current = 0;
let shuffle = false;
let repeatMode = 0; // 0: none, 1: repeat all, 2: repeat one
let audioCtx, analyser, srcNode, bars;

const audio = new Audio();
const cover = document.getElementById("cover");
const title = document.getElementById("title");
const artist = document.getElementById("artist");
const bgVideo = document.getElementById("bgVideo");
const progress = document.getElementById("progress");
const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const volumeSlider = document.getElementById("volume");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");
const lyricsBtn = document.getElementById("lyricsBtn");
const lyricsModal = document.getElementById("lyricsModal");
const lyricsText = document.getElementById("lyricsText");
const closeLyrics = document.getElementById("closeLyrics");
const themeToggle = document.getElementById("theme-toggle");
const shuffleBtn = document.getElementById("shuffle");
const repeatBtn = document.getElementById("repeat");
const visualizerCanvas = document.getElementById("visualizer");
const ctx = visualizerCanvas.getContext("2d");
visualizerCanvas.width = 400;
visualizerCanvas.height = 60;

function loadSong(index) {
  const song = songs[index];
  audio.src = song.src;
  cover.src = song.cover;
  title.textContent = song.title;
  artist.textContent = song.artist;
  bgVideo.src = song.video;
  lyricsText.textContent = song.lyrics || "Lyrics not available.";
}

function playSong() {
  audio.play();
  playBtn.innerHTML = '<i data-lucide="pause"></i>';
  lucide.createIcons();
  cover.classList.add("rotating");
}

function pauseSong() {
  audio.pause();
  playBtn.innerHTML = '<i data-lucide="play"></i>';
  lucide.createIcons();
  cover.classList.remove("rotating");
}

playBtn.addEventListener("click", () => {
  audio.paused ? playSong() : pauseSong();
});

nextBtn.addEventListener("click", nextSong);
prevBtn.addEventListener("click", prevSong);

function nextSong() {
  if (shuffle) {
    current = Math.floor(Math.random() * songs.length);
  } else {
    current = (current + 1) % songs.length;
  }
  loadSong(current);
  playSong();
}

function prevSong() {
  current = (current - 1 + songs.length) % songs.length;
  loadSong(current);
  playSong();
}

audio.addEventListener("timeupdate", () => {
  const progressPercent = (audio.currentTime / audio.duration) * 100;
  progress.value = progressPercent || 0;
  currentTimeEl.textContent = formatTime(audio.currentTime);
  durationEl.textContent = formatTime(audio.duration);
});

progress.addEventListener("input", () => {
  const seekTime = (progress.value / 100) * audio.duration;
  audio.currentTime = seekTime;
});

volumeSlider.addEventListener("input", () => {
  audio.volume = volumeSlider.value;
});

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light-theme");
});

lyricsBtn.addEventListener("click", () => {
  lyricsModal.classList.remove("hidden");
});

closeLyrics.addEventListener("click", () => {
  lyricsModal.classList.add("hidden");
});

audio.addEventListener("ended", () => {
  if (repeatMode === 2) {
    loadSong(current);
    playSong();
  } else if (repeatMode === 1 || shuffle) {
    nextSong();
  }
});

shuffleBtn.addEventListener("click", () => {
  shuffle = !shuffle;
  shuffleBtn.classList.toggle("active", shuffle);
});

repeatBtn.addEventListener("click", () => {
  repeatMode = (repeatMode + 1) % 3;
  repeatBtn.setAttribute("data-mode", repeatMode);
  repeatBtn.classList.toggle("active", repeatMode > 0);
});

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

function initVisualizer() {
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  analyser = audioCtx.createAnalyser();
  srcNode = audioCtx.createMediaElementSource(audio);
  srcNode.connect(analyser);
  analyser.connect(audioCtx.destination);
  analyser.fftSize = 64;
  const bufferLength = analyser.frequencyBinCount;
  bars = new Uint8Array(bufferLength);

  function draw() {
    requestAnimationFrame(draw);
    analyser.getByteFrequencyData(bars);
    ctx.clearRect(0, 0, visualizerCanvas.width, visualizerCanvas.height);
    const barWidth = (visualizerCanvas.width / bufferLength) - 1;
    bars.forEach((bar, i) => {
      const h = bar / 255 * visualizerCanvas.height;
      ctx.fillStyle = `rgba(0,255,150,0.8)`;
      ctx.fillRect(i * (barWidth + 1), visualizerCanvas.height - h, barWidth, h);
    });
  }
  draw();
}

audio.addEventListener("play", () => {
  if (!audioCtx) initVisualizer();
});

// Keyboard shortcuts
window.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault();
    audio.paused ? playSong() : pauseSong();
  } else if (e.code === "ArrowRight") {
    audio.currentTime += 5;
  } else if (e.code === "ArrowLeft") {
    audio.currentTime -= 5;
  } else if (e.code === "ArrowUp") {
    e.preventDefault();
    audio.volume = Math.min(audio.volume + 0.1, 1);
  } else if (e.code === "ArrowDown") {
    e.preventDefault();
    audio.volume = Math.max(audio.volume - 0.1, 0);
  }
});

// Load first song and autoplay
loadSong(current);
audio.autoplay = true;
playSong();
lucide.createIcons();
