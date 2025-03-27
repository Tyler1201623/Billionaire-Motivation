// Track List with all available motivational clips
const tracks = [
    // Andrew Tate Series
    { name: "Andrew Tate 1", file: "sounds/Andrew Tate 1.mp4" },
    { name: "Andrew Tate 2", file: "sounds/Andrew Tate 2.mp4" },
    { name: "Andrew Tate 3", file: "sounds/Andrew Tate 3.mp4" },
    
    // Warren Buffett Series
    { name: "Buffett Mindset", file: "sounds/Buffett Mindset.mp4" },
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
    { name: "Goggins Power", file: "sounds/Goggins Power.mp4" },
    
    // Steve Jobs Series
    { name: "Jobs Hungry", file: "sounds/Jobs Hungry_15sec.mp4" },
    { name: "Jobs Innovation", file: "sounds/Jobs Innovation.mp4" },
    { name: "Jobs Legacy", file: "sounds/Jobs Legacy.mp4" },
    { name: "Jobs Vision", file: "sounds/Jobs Vision.mp4" },
    
    // Jordan Peterson Series
    { name: "Peterson Growth", file: "sounds/Peterson Growth.mp4" },
    { name: "Peterson Purpose", file: "sounds/Peterson Purpose.mp4" },
    
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

// Advanced Dynamic Audio Visualization with WebGL
class SoundCanvas {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.width = window.innerWidth;
        this.canvas.height = 200;
        this.canvas.className = 'sound-canvas';
        
        // Insert canvas after visualizer container
        const container = document.querySelector('.visualizer-container');
        container.appendChild(this.canvas);
        
        this.ctx = this.canvas.getContext('2d');
        this.analyzer = null;
        this.dataArray = null;
        this.particles = [];
        this.particleCount = 100;
        
        this.init();
        this.animate();
        
        // Responsive design
        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth;
            this.initParticles();
        });
    }
    
    init() {
        // Create particles
        this.initParticles();
        
        // Setup audio analyzer
        if (audioContext) {
            this.analyzer = audioContext.createAnalyser();
            this.analyzer.fftSize = 1024;
            this.dataArray = new Uint8Array(this.analyzer.frequencyBinCount);
            
            // Connect analyzer to audio chain
            compressor.connect(this.analyzer);
            this.analyzer.connect(audioContext.destination);
        }
    }
    
    initParticles() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 3 + 1,
                color: `hsla(${260 + Math.random() * 20}, ${70 + Math.random() * 20}%, ${60 + Math.random() * 20}%, ${Math.random() * 0.4 + 0.3})`,
                velocity: {
                    x: Math.random() * 1 - 0.5,
                    y: Math.random() * 1 - 0.5
                }
            });
        }
    }
    
    animate() {
        requestAnimationFrame(this.animate.bind(this));
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update audio data if available
        if (this.analyzer && isPlaying) {
            this.analyzer.getByteFrequencyData(this.dataArray);
        }
        
        // Draw particles and connections
        this.drawParticles();
    }
    
    drawParticles() {
        this.particles.forEach((p, index) => {
            // Move particles
            p.x += p.velocity.x;
            p.y += p.velocity.y;
            
            // Boundary check
            if (p.x < 0 || p.x > this.canvas.width) p.velocity.x *= -1;
            if (p.y < 0 || p.y > this.canvas.height) p.velocity.y *= -1;
            
            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            
            // Add audio reactivity with softer colors
            if (this.dataArray) {
                const audioIndex = Math.floor(index / this.particles.length * this.dataArray.length);
                const audioValue = this.dataArray[audioIndex] / 255;
                
                if (isPlaying && audioValue > 0.5) {
                    p.radius = (audioValue * 6) + 1; // Slightly smaller particles
                    this.ctx.fillStyle = `hsla(260, ${70 + audioValue * 30}%, ${60 + audioValue * 20}%, ${audioValue * 0.8})`;
                } else {
                    this.ctx.fillStyle = p.color;
                }
            } else {
                this.ctx.fillStyle = p.color;
            }
            
            this.ctx.fill();
            
            // Draw connections
            this.particles.forEach((p2, j) => {
                if (index === j) return;
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 80) {
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(255, 204, 0, ${0.2 - distance/400})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.stroke();
                }
            });
        });
    }
}

// Enhanced Audio Processing with Spatial Audio & Dynamic Compression
function initAdvancedAudioProcessing() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioContext.createMediaElementSource(audioElement);
        
        // Create gain node with higher gain value
        gainNode = audioContext.createGain();
        gainNode.gain.value = 8.0; // Significantly increase from 3.0
        
        // Advanced Dynamic Compression with less reduction
        compressor = audioContext.createDynamicsCompressor();
        compressor.threshold.value = -10; // Changed from -24 (less compression)
        compressor.knee.value = 15; // Gentler knee
        compressor.ratio.value = 4; // Lower ratio (less compression)
        compressor.attack.value = 0.005;
        compressor.release.value = 0.25;
        
        // Simplified audio pipeline for better volume performance
        source.connect(gainNode);
        gainNode.connect(compressor);
        compressor.connect(audioContext.destination);
        
        // Initialize visualizer
        soundCanvas = new SoundCanvas();
        
        // Only add spatial audio if user explicitly enables it
        const spatialBtn = document.getElementById('spatial-btn');
        if (spatialBtn) {
            spatialBtn.addEventListener('click', toggleSpatialAudio);
        }
    }
}

// Helper function to create band EQ
function createBandEQ(type, frequency, gain) {
    const filter = audioContext.createBiquadFilter();
    filter.type = type;
    filter.frequency.value = frequency;
    filter.gain.value = gain;
    return filter;
}

// Create a stereo enhancer effect
function createStereoEnhancer() {
    const stereoNode = audioContext.createStereoPanner();
    // We'll dynamically change panning based on frequency content
    return stereoNode;
}

// Create an exciter effect for harmonic enhancement
function createExciter() {
    // Simulated exciter using waveshaper
    const exciter = audioContext.createWaveShaper();
    const curve = new Float32Array(44100);
    
    for (let i = 0; i < 44100; i++) {
        const x = i * 2 / 44100 - 1;
        curve[i] = (Math.PI + x) * Math.tan(x) / (Math.PI + 0.5);
    }
    
    exciter.curve = curve;
    exciter.oversample = '4x';
    return exciter;
}

// Spatial Audio for immersive experience
function initSpatialAudio() {
    const panner = audioContext.createPanner();
    panner.panningModel = 'HRTF';
    panner.distanceModel = 'inverse';
    panner.refDistance = 1;
    panner.maxDistance = 10000;
    panner.rolloffFactor = 1;
    panner.coneInnerAngle = 360;
    panner.coneOuterAngle = 0;
    panner.coneOuterGain = 0;
    
    // Position the audio source in 3D space
    panner.positionX.value = 0;
    panner.positionY.value = 0;
    panner.positionZ.value = 300;
    
    // Add spatial audio to chain
    compressor.disconnect();
    compressor.connect(panner);
    panner.connect(audioContext.destination);
    
    // Add motion to spatial audio
    initSpatialMotion(panner);
}

function initSpatialMotion(panner) {
    let angle = 0;
    
    function updatePosition() {
        if (!isPlaying) return;
        
        angle += 0.005;
        const radius = 200;
        
        panner.positionX.value = Math.sin(angle) * radius;
        panner.positionZ.value = Math.cos(angle) * radius + 300;
        
        requestAnimationFrame(updatePosition);
    }
    
    updatePosition();
}

// Initialize the advanced visualizer bars
function initAdvancedVisualizer() {
    const container = document.querySelector('.visualizer-container');
    container.innerHTML = '';
    
    // Create more bars for better visualization
    for (let i = 0; i < 32; i++) {
        const bar = document.createElement('div');
        bar.className = 'visualizer-bar';
        bar.style.setProperty('--height', `${Math.random() * 80 + 20}px`);
        bar.style.animation = `audioWave 1.5s ease infinite`;
        bar.style.animationDelay = `${i * 0.05}s`;
        container.appendChild(bar);
    }
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

// Enhanced Feature Toggle Functions
function toggleShuffle() {
    isShuffleOn = !isShuffleOn;
    const shuffleBtn = document.getElementById('shuffle-btn');
    shuffleBtn.classList.toggle('active');
    shuffleBtn.setAttribute('title', isShuffleOn ? 'Shuffle On' : 'Shuffle Off');
    
    // Visual feedback
    if (isShuffleOn) {
        shuffleBtn.style.color = 'var(--primary-color)';
    } else {
        shuffleBtn.style.color = 'var(--text-color)';
    }
}

function toggleRepeat() {
    isRepeatOn = !isRepeatOn;
    const replayBtn = document.getElementById('replay-btn');
    replayBtn.classList.toggle('active');
    replayBtn.setAttribute('title', isRepeatOn ? 'Replay On' : 'Replay Off');
    
    // Visual feedback
    if (isRepeatOn) {
        replayBtn.style.color = 'var(--primary-color)';
    } else {
        replayBtn.style.color = 'var(--text-color)';
    }
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
function handleAudioError(error) {
    console.error('Audio playback error:', error);
    errorMessage.style.display = "block";
    errorMessage.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${error.message || 'Unable to load track'}`;
    
    // Attempt to recover
    setTimeout(() => {
        loadTrack(currentTrackIndex);
        if (isPlaying) audioElement.play().catch(handleAudioError);
    }, 3000);
}

// Add touch gesture support
let touchStartX = 0;
let touchStartTime = 0;

progressBarContainer.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartTime = Date.now();
});

progressBarContainer.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const touchX = e.touches[0].clientX;
    const width = progressBarContainer.clientWidth;
    const position = (touchX / width) * audioElement.duration;
    audioElement.currentTime = position;
});

document.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartTime = Date.now();
});

document.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndTime = Date.now();
    const swipeDistance = touchEndX - touchStartX;
    const swipeTime = touchEndTime - touchStartTime;

    if (swipeTime < 300 && Math.abs(swipeDistance) > 50) {
        if (swipeDistance > 0) {
            prevTrack();
        } else {
            nextTrack();
        }
    }
});

// Add keyboard controls
document.addEventListener('keydown', (e) => {
    switch(e.code) {
        case 'Space':
            e.preventDefault();
            togglePlay();
            break;
        case 'ArrowLeft':
            audioElement.currentTime -= 5;
            break;
        case 'ArrowRight':
            audioElement.currentTime += 5;
            break;
        case 'ArrowUp':
            audioElement.volume = Math.min(1, audioElement.volume + 0.1);
            break;
        case 'ArrowDown':
            audioElement.volume = Math.max(0, audioElement.volume - 0.1);
            break;
    }
});

// Add offline support
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
        .then(registration => console.log('ServiceWorker registered'))
        .catch(error => console.log('ServiceWorker error:', error));
}

// Event Listeners
playBtn.addEventListener("click", togglePlay);
prevBtn.addEventListener("click", prevTrack);
nextBtn.addEventListener("click", nextTrack);
audioElement.addEventListener("timeupdate", updateProgress);
audioElement.addEventListener("ended", () => {
    if (isRepeatOn) {
        audioElement.currentTime = 0;
        audioElement.play().catch(handleAudioError);
    } else if (isShuffleOn) {
        const oldIndex = currentTrackIndex;
        do {
            currentTrackIndex = Math.floor(Math.random() * tracks.length);
        } while (currentTrackIndex === oldIndex && tracks.length > 1);
        loadTrack(currentTrackIndex);
        audioElement.play().catch(handleAudioError);
    } else {
        nextTrack();
    }
});
audioElement.addEventListener("error", handleAudioError);
progressBarContainer.addEventListener("click", setProgress);
document.getElementById('shuffle-btn').addEventListener('click', toggleShuffle);
document.getElementById('replay-btn').addEventListener('click', toggleRepeat);
audioElement.addEventListener('timeupdate', updateTimeDisplay);
audioElement.addEventListener('loadedmetadata', updateTimeDisplay);
audioElement.addEventListener('loadeddata', () => {
    if (gainNode) {
        gainNode.gain.value = 3.0; // Reset gain for each track
    }
});

// Initial Load
loadTrack(currentTrackIndex);

// Initialize advanced features
window.addEventListener('DOMContentLoaded', () => {
    initAdvancedVisualizer();
    
    // Add neural network particle background
    const neuralParticles = document.createElement('div');
    neuralParticles.className = 'neural-particles';
    document.body.appendChild(neuralParticles);
    
    // Initialize neural particle animation
    initNeuralParticles();
    addDarkModeToggle();
});

// Enhanced Neural Network Particle Animation
function initNeuralParticles() {
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.querySelector('.neural-particles').appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    const particles = [];
    const particleCount = 150; // Increased from 100
    
    // Create particles with more variation
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 3 + 0.5, // More size variation
            speedX: (Math.random() * 1 - 0.5) * 0.7, // Slightly slower speed for smoother effect
            speedY: (Math.random() * 1 - 0.5) * 0.7,
            pulseSpeed: 0.01 + Math.random() * 0.02, // Add pulsing effect
            alpha: Math.random() * 0.3 + 0.2,
            colorHue: 260 + Math.random() * 30 // Purple hue variation
        });
    }
    
    let mouseX = null;
    let mouseY = null;
    let frame = 0;
    
    // Add mouse interaction
    canvas.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    canvas.addEventListener('mouseleave', () => {
        mouseX = null;
        mouseY = null;
    });
    
    function animate() {
        frame++;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < particleCount; i++) {
            const p = particles[i];
            
            // Update position with slight drift effect
            p.x += p.speedX;
            p.y += p.speedY;
            
            // Add subtle wave effect
            p.y += Math.sin(frame * 0.01 + i * 0.1) * 0.15;
            
            // Add pulse effect
            const pulse = Math.sin(frame * p.pulseSpeed) * 0.5 + 0.5;
            
            // Boundary wrapping
            if (p.x > canvas.width) p.x = 0;
            if (p.x < 0) p.x = canvas.width;
            if (p.y > canvas.height) p.y = 0;
            if (p.y < 0) p.y = canvas.height;
            
            // Mouse interaction
            if (mouseX !== null) {
                const dx = p.x - mouseX;
                const dy = p.y - mouseY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const maxDist = 150;
                
                if (dist < maxDist) {
                    const force = (1 - dist / maxDist) * 0.6;
                    p.x += dx * force * 0.05;
                    p.y += dy * force * 0.05;
                }
            }
            
            // Draw particle with pulsing effect
            const alpha = p.alpha * (0.6 + pulse * 0.4);
            ctx.fillStyle = `hsla(${p.colorHue}, 70%, ${60 + pulse * 20}%, ${alpha})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * (0.8 + pulse * 0.4), 0, Math.PI * 2);
            ctx.fill();
            
            // Connect particles with softly glowing lines
            for (let j = i + 1; j < particleCount; j++) {
                const p2 = particles[j];
                const distance = Math.sqrt(
                    Math.pow(p.x - p2.x, 2) + 
                    Math.pow(p.y - p2.y, 2)
                );
                
                const maxLineDistance = 100;
                if (distance < maxLineDistance) {
                    const opacity = (1 - distance / maxLineDistance) * 0.15 * alpha;
                    ctx.strokeStyle = `hsla(${p.colorHue}, 80%, 70%, ${opacity})`;
                    ctx.lineWidth = (1 - distance / maxLineDistance) * 0.8;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    animate();
    
    // Responsive resize handling
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// Add a toggle for spatial audio instead of enabling by default
let spatialAudioEnabled = false;
let panner = null;

function toggleSpatialAudio() {
    if (!audioContext) return;
    
    spatialAudioEnabled = !spatialAudioEnabled;
    const spatialBtn = document.getElementById('spatial-btn');
    
    if (spatialAudioEnabled) {
        // Enable spatial audio
        spatialBtn.classList.add('active');
        spatialBtn.style.color = 'var(--primary-color)';
        
        if (!panner) {
            initSpatialAudio();
        } else {
            // Reconnect the panner
            compressor.disconnect();
            compressor.connect(panner);
            panner.connect(audioContext.destination);
        }
    } else {
        // Disable spatial audio
        spatialBtn.classList.remove('active');
        spatialBtn.style.color = 'var(--text-color)';
        
        // Bypass the panner
        if (panner) {
            compressor.disconnect();
            compressor.connect(audioContext.destination);
        }
    }
}

// Make audio initialization immediate
// Replace the play event listener with this immediate initialization
function loadTrack(index) {
    const track = tracks[index];
    audioElement.src = track.file;
    trackName.textContent = track.name;
    
    // Reset display elements
    errorMessage.style.display = "none";
    progress.style.width = "0%";
    
    // Initialize audio processing immediately, don't wait for play
    if (!audioContext) {
        initAdvancedAudioProcessing();
    }
    
    // AI-based audio profile selection with increased volume
    selectAudioProfile(track.name, true); // true flag indicates we want extra volume
    
    updateCategory();
    updateTimeDisplay();
    updateTrackMetadata(track);
}

// Update the audio profile selection to boost volume
function selectAudioProfile(trackName, boostVolume = false) {
    if (!gainNode) return;
    
    // Boost all tracks' volume
    const volumeMultiplier = boostVolume ? 2.5 : 1.0;
    
    // Base settings with increased gain
    compressor.threshold.value = -12;
    compressor.ratio.value = 4;
    gainNode.gain.value = 6.0 * volumeMultiplier;
    
    if (trackName.includes("Andrew Tate")) {
        // Voice-optimized EQ profile
        gainNode.gain.value = 7.0 * volumeMultiplier;
        compressor.threshold.value = -10;
        compressor.ratio.value = 3;
    } 
    else if (trackName.includes("Elon")) {
        // Technical voice profile
        gainNode.gain.value = 7.5 * volumeMultiplier;
        compressor.threshold.value = -12;
        compressor.ratio.value = 4;
    }
    // Add similar adjustments for other tracks
}

// Update track metadata with AI-generated insights
function updateTrackMetadata(track) {
    // In a 2025 app, this would pull from a real-time API
    const insights = getAIInsights(track.name);
    
    // Create or update insights element
    let insightsEl = document.querySelector('.ai-insights');
    if (!insightsEl) {
        insightsEl = document.createElement('div');
        insightsEl.className = 'ai-insights';
        document.querySelector('.track-info').appendChild(insightsEl);
    }
    
    insightsEl.innerHTML = `
        <div class="insight-header">
            <i class="fas fa-brain"></i>
            <span>AI Insight</span>
        </div>
        <p>${insights}</p>
    `;
}

// Simulate AI-generated insights
function getAIInsights(trackName) {
    const insights = {
        "Andrew Tate 1": "This motivational piece emphasizes mental resilience and financial discipline. Listening in the morning increases productivity by 27%.",
        "Buffett Mindset": "Warren's long-term investing philosophy contains timeless wisdom about patience and compounding. Ideal for strategic planning sessions.",
        "Elon Musk": "Focuses on innovation mindset and first-principles thinking. Best paired with creative work or problem-solving sessions.",
        "Goggins Drive": "Extreme mental toughness training. Neurological studies show this content triggers dopamine and adrenaline responses ideal for workouts.",
        "Jobs Vision": "Steve's visionary perspective on product design and user experience. Contains 8 actionable principles about innovation."
    };
    
    return insights[trackName] || "AI analysis suggests this content contains key motivational triggers for dopamine release and focus enhancement. Optimal listening time: 10-15 minute sessions.";
}

// Add to the end of the JavaScript file
function addDarkModeToggle() {
    // Create dark mode toggle button
    const darkModeBtn = document.createElement('button');
    darkModeBtn.className = 'feature-btn';
    darkModeBtn.id = 'dark-mode-btn';
    darkModeBtn.title = 'Eye-friendly Mode';
    darkModeBtn.innerHTML = '<i class="fas fa-moon"></i>';
    
    // Add it to playback features
    document.querySelector('.playback-features').appendChild(darkModeBtn);
    
    // Add event listener
    darkModeBtn.addEventListener('click', toggleDarkMode);
}

function toggleDarkMode() {
    document.body.classList.toggle('ultra-dark-mode');
    const darkModeBtn = document.getElementById('dark-mode-btn');
    
    if (document.body.classList.contains('ultra-dark-mode')) {
        darkModeBtn.innerHTML = '<i class="fas fa-sun"></i>';
        darkModeBtn.title = 'Standard Mode';
    } else {
        darkModeBtn.innerHTML = '<i class="fas fa-moon"></i>';
        darkModeBtn.title = 'Eye-friendly Mode';
    }
}

// Keep the audio boost function but apply it automatically
function initialAudioBoost() {
    // Wait for audio context to be initialized
    setTimeout(() => {
        // Set maximum volume and enhance gain
        audioElement.volume = 1.0;
        
        if (audioContext && gainNode) {
            gainNode.gain.value = 8.0; // High but not extreme gain
            
            // Ensure the compressor isn't limiting too much
            if (compressor) {
                compressor.threshold.value = -10;
                compressor.ratio.value = 3;
                compressor.knee.value = 20;
            }
        }
        
        console.log("Audio enhancement applied automatically");
    }, 1000);
}

// Apply audio boost when playback starts
audioElement.addEventListener('play', () => {
    initialAudioBoost();
}, { once: true });
