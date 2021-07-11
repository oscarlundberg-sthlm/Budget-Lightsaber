const startStopBtn = document.querySelector('#start-stop-btn');
let isLightSaberOn = false;

const audioContext = new AudioContext();
const oscillator = audioContext.createOscillator();
const distortion = audioContext.createWaveShaper();
const filter = audioContext.createBiquadFilter();
const gainNode = audioContext.createGain();

// routing
oscillator.connect(distortion);
distortion.connect(filter);
filter.connect(gainNode);
gainNode.connect(audioContext.destination);

gainNode.gain.setValueAtTime(0, audioContext.currentTime);

oscillator.type = 'square';
oscillator.frequency.setValueAtTime(92.50, audioContext.currentTime); // F#2
oscillator.start();

distortion.curve = new Float32Array([0,5]);
distortion.oversample = 'none';

filter.type = 'lowpass';
let initFreq = 100;
filter.frequency.setValueAtTime(initFreq, audioContext.currentTime);

let baseGain = 0.3;
let gainRatio = 1 / baseGain;

const handleOnOff = (e) => {
    if (isLightSaberOn) {
        window.removeEventListener('devicemotion', handleMotion);
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        isLightSaberOn = false;
        startStopBtn.innerHTML = 'Engage';
    } else {
        gainNode.gain.setValueAtTime(baseGain, audioContext.currentTime);
        window.addEventListener('devicemotion', handleMotion);
        isLightSaberOn = true;
        startStopBtn.innerHTML = 'Disengage';
    }
};

let h1 = document.createElement('h1');
document.body.appendChild(h1);
const handleMotion = (e) => {
    let motion = Math.abs(e.accelerationIncludingGravity.z) / 3;
    filter.frequency.value = initFreq * Math.exp(motion);
    gainNode.gain.value = baseGain * motion;
    
    h1.innerHTML = motion;
}

startStopBtn.addEventListener('click', handleOnOff);
