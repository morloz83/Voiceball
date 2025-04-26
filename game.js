
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let ballY = 300;
let velocity = 0;
let gravity = 0.5;
let voiceLevel = 0;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

navigator.mediaDevices.getUserMedia({ audio: true })
.then(stream => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const microphone = audioContext.createMediaStreamSource(stream);
    microphone.connect(analyser);
    analyser.fftSize = 512;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    function update() {
        analyser.getByteTimeDomainData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
            sum += Math.abs(dataArray[i] - 128);
        }
        voiceLevel = sum / dataArray.length;
        
        velocity -= voiceLevel / 20;
        velocity += gravity;
        ballY += velocity;

        if (ballY > canvas.height - 30) {
            ballY = canvas.height - 30;
            velocity = 0;
        }
        if (ballY < 0) {
            ballY = 0;
            velocity = 0;
        }

        draw();
        requestAnimationFrame(update);
    }

    update();
});

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // ציור סל
    ctx.fillStyle = '#000';
    ctx.fillRect(canvas.width - 100, canvas.height / 2 - 50, 10, 100);
    
    // ציור כדור
    ctx.beginPath();
    ctx.arc(50, ballY, 30, 0, Math.PI * 2);
    ctx.fillStyle = '#ffa500';
    ctx.fill();
    ctx.closePath();
}
