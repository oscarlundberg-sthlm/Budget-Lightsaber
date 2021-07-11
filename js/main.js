const startStopBtn = document.querySelector('#start-stop-btn');
let isLightSaberOn = false;

const audioContext = new AudioContext();
const oscillator = audioContext.createOscillator();
const distortion = audioContext.createWaveShaper();
const highPass = audioContext.createBiquadFilter();
const filter = audioContext.createBiquadFilter();
const gainNode = audioContext.createGain();

// Routing
oscillator.connect(distortion);
distortion.connect(highPass);
highPass.connect(filter);
filter.connect(gainNode);
gainNode.connect(audioContext.destination);
//

gainNode.gain.setValueAtTime(0, audioContext.currentTime);

// Settings
oscillator.type = 'square';
oscillator.frequency.setValueAtTime(92.50, audioContext.currentTime); // F#2
oscillator.start();

distortion.curve = new Float32Array([0,1]);
distortion.oversample = 'none';

highPass.type = 'highpass';
highPass.frequency.value = 300;

filter.type = 'lowpass';
let initFreq = 400;
filter.frequency.setValueAtTime(initFreq, audioContext.currentTime);

let baseGain = 0.1;
let gainRatio = 1 / baseGain;
//

const handleOnOff = (e) => {
    if (isLightSaberOn) {
        window.removeEventListener('devicemotion', handleMotion);
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        isLightSaberOn = false;
        startStopBtn.innerHTML = 'Engage';
    } else {
        audioContext.resume();
        gainNode.gain.setValueAtTime(baseGain, audioContext.currentTime);
        window.addEventListener('devicemotion', handleMotion);
        isLightSaberOn = true;
        startStopBtn.innerHTML = 'Disengage';
    }
};

let h1 = document.createElement('h1');
document.body.appendChild(h1);

const handleMotion = (e) => {
    let motion = (Math.round(Math.abs(e.acceleration.z) * 100 ) / 100) / 20;
    motion += 1;
    oscillator.detune.value = motion * 70;
    filter.frequency.value = initFreq * motion;
    // filter.frequency.value = initFreq * Math.exp(motion);
    gainNode.gain.value = baseGain * Math.exp(motion);
    
    h1.innerHTML = motion;
}

startStopBtn.addEventListener('click', handleOnOff);