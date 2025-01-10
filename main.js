// Track List with all available motivational clips
const tracks = [
    // Andrew Tate Series
    { name: "Andrew Tate 1", file: "sounds/Andrew Tate 1.mp4" },
    { name: "Andrew Tate 2", file: "sounds/Andrew Tate 2.mp4" },
    { name: "Andrew Tate 3", file: "sounds/Andrew Tate 3.mp4" },
    
    // Warren Buffett Series
    { name: "Buffett Circle", file: "sounds/Buffett Circle_15sec.mp4" },
    { name: "Buffett Mindset", file: "sounds/Buffett Mindset.mp4" },
    { name: "Buffett Success", file: "sounds/Buffett Success.mp4" },
    { name: "Buffett Wisdom", file: "sounds/Buffett Wisdom.mp4" },
    
    // Ray Dalio Series
    { name: "Dalio Growth", file: "sounds/Dalio Growth.mp4" },
    { name: "Dalio Learning", file: "sounds/Dalio Learning.mp4" },
    { name: "Dalio Pain", file: "sounds/Dalio Pain_15sec.mp4" },
    
    // Tech Leaders
    { name: "Elon Musk", file: "sounds/Elon Musk.mp4" },
    { name: "Jeff Bezos", file: "sounds/Jeff Bezoes.mp4" },
    
    // David Goggins Series
    { name: "Goggins Drive", file: "sounds/Goggins Drive.mp4" },
    { name: "Goggins Hard", file: "sounds/Goggins Hard_15sec.mp4" },
    { name: "Goggins Mental", file: "sounds/Goggins Mental.mp4" },
    { name: "Goggins Power", file: "sounds/Goggins Power.mp4" },
    
    // Steve Jobs Series
    { name: "Jobs Hungry", file: "sounds/Jobs Hungry_15sec.mp4" },
    { name: "Jobs Innovation", file: "sounds/Jobs Innovation.mp4" },
    { name: "Jobs Legacy", file: "sounds/Jobs Legacy.mp4" },
    { name: "Jobs Vision", file: "sounds/Jobs Vision.mp4" },
    
    // Jordan Peterson Series
    { name: "Peterson Growth", file: "sounds/Peterson Growth.mp4" },
    { name: "Peterson Purpose", file: "sounds/Peterson Purpose.mp4" },
    { name: "Peterson Responsibility", file: "sounds/Peterson Responsibility_15sec.mp4" },
    
    // General Motivation
    { name: "Get Up And Grind", file: "sounds/Get Up And Grind.mp4" },
    { name: "Success Is Never An Accident", file: "sounds/Success Is Never An Accident.mp4" }
];

// DOM Elements
const audioElement = document.getElementById("audio-element");
audioElement.volume = 1.0; // Max volume
const trackName = document.getElementById("track-name");
const playBtn = document.getElementById("play-btn");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const progress = document.getElementById("progress");
const progressBarContainer = document.querySelector(".progress-bar-container");
const errorMessage = document.getElementById("error-message");

// Playback State
let currentTrackIndex = 0;
let isPlaying = false;
let isShuffleOn = false;
let isRepeatOn = false;

// Audio Processing Setup
let audioContext;
let gainNode;
let compressor;

function initAudioProcessing() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioContext.createMediaElementSource(audioElement);
        
        // Create gain node for balanced volume
        gainNode = audioContext.createGain();
        gainNode.gain.value = 2.0; // Moderate volume boost
        
        // Create compressor for professional sound
        compressor = audioContext.createDynamicsCompressor();
        compressor.threshold.value = -20;
        compressor.knee.value = 20;
        compressor.ratio.value = 6; // Gentler compression
        compressor.attack.value = 0.005;
        compressor.release.value = 0.2;
        
        // Add EQ for balanced bass
        const eq = audioContext.createBiquadFilter();
        eq.type = 'lowshelf';
        eq.frequency.value = 100;
        eq.gain.value = 3; // Subtle bass enhancement
        
        // Connect audio chain with EQ
        source.connect(eq);
        eq.connect(gainNode);
        gainNode.connect(compressor);
        compressor.connect(audioContext.destination);
    }
}

// Load Track
function loadTrack(index) {
    const track = tracks[index];
    audioElement.src = track.file;
    trackName.textContent = track.name;
    
    // Reset display elements
    errorMessage.style.display = "none";
    progress.style.width = "0%";
    
    updateCategory();
    updateTimeDisplay();
    
    // Initialize audio processing on first user interaction
    audioElement.addEventListener('play', () => {
        initAudioProcessing();
    }, { once: true });
}

// Time Display Functions
function updateTimeDisplay() {
    const currentTime = formatTime(audioElement.currentTime);
    const totalTime = formatTime(audioElement.duration);
    document.getElementById('current-time').textContent = currentTime;
    document.getElementById('total-time').textContent = totalTime;
}

function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
}

// Category Update
function updateCategory() {
    const categories = {
        'Andrew Tate': 'Mindset Masters',
        'Buffett': 'Wealth Wisdom',
        'Dalio': 'Investment Insights',
        'Goggins': 'Peak Performance',
        'Jobs': 'Innovation Leaders',
        'Peterson': 'Life Philosophy'
    };
    
    const currentTrack = tracks[currentTrackIndex].name;
    let category = 'Mindset Masters';
    
    for (let key in categories) {
        if (currentTrack.includes(key)) {
            category = categories[key];
            break;
        }
    }
    
    document.getElementById('current-category').textContent = category;
}

// Playback Controls
function updatePlayButton() {
    playBtn.innerHTML = isPlaying ? 
        '<i class="fas fa-pause"></i>' : 
        '<i class="fas fa-play"></i>';
}

function togglePlay() {
    if (isPlaying) {
        audioElement.pause();
    } else {
        audioElement.play().catch(handleAudioError);
    }
    isPlaying = !isPlaying;
    updatePlayButton();
    updateVisualizer();
}

function prevTrack() {
    currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    loadTrack(currentTrackIndex);
    if (isPlaying) audioElement.play().catch(handleAudioError);
}

function nextTrack() {
    if (isShuffleOn) {
        currentTrackIndex = Math.floor(Math.random() * tracks.length);
    } else {
        currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
    }
    loadTrack(currentTrackIndex);
    if (isPlaying) audioElement.play().catch(handleAudioError);
}

// Progress Bar Functions
function updateProgress() {
    const { currentTime, duration } = audioElement;
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;
    updateTimeDisplay();
}

function setProgress(e) {
    const width = progressBarContainer.clientWidth;
    const clickX = e.offsetX;
    const duration = audioElement.duration;
    audioElement.currentTime = (clickX / width) * duration;
}

// Feature Toggle Functions
function toggleShuffle() {
    isShuffleOn = !isShuffleOn;
    document.getElementById('shuffle-btn').classList.toggle('active');
}

function toggleRepeat() {
    isRepeatOn = !isRepeatOn;
    document.getElementById('repeat-btn').classList.toggle('active');
}

// Visualizer Control
function updateVisualizer() {
    const bars = document.querySelectorAll('.visualizer-bar');
    if (isPlaying) {
        bars.forEach(bar => bar.style.animationPlayState = 'running');
    } else {
        bars.forEach(bar => bar.style.animationPlayState = 'paused');
    }
}

// Error Handling
function handleAudioError() {
    errorMessage.style.display = "block";
    playBtn.innerHTML = '<i class="fas fa-play"></i>';
    isPlaying = false;
}

// Event Listeners
playBtn.addEventListener("click", togglePlay);
prevBtn.addEventListener("click", prevTrack);
nextBtn.addEventListener("click", nextTrack);
audioElement.addEventListener("timeupdate", updateProgress);
audioElement.addEventListener("ended", () => {
    if (isRepeatOn) {
        audioElement.currentTime = 0;
        audioElement.play();
    } else {
        nextTrack();
    }
});
audioElement.addEventListener("error", handleAudioError);
progressBarContainer.addEventListener("click", setProgress);
document.getElementById('shuffle-btn').addEventListener('click', toggleShuffle);
document.getElementById('repeat-btn').addEventListener('click', toggleRepeat);
audioElement.addEventListener('timeupdate', updateTimeDisplay);
audioElement.addEventListener('loadedmetadata', updateTimeDisplay);
audioElement.addEventListener('loadeddata', () => {
    if (gainNode) {
        gainNode.gain.value = 3.0; // Reset gain for each track
    }
});

// Initial Load
loadTrack(currentTrackIndex);
