<script>
	let count = $state(0);
    let interval = $state(null)
    let sizeInterval = $state(null)
    function playBuzzSound() {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(100, audioCtx.currentTime); // value in hertz
        gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime); // volume

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.start();
        setTimeout(() => oscillator.stop(), 200); // play sound for 500ms
    }

    function drawRandomPoint() {
        const canvas = document.getElementById('myCanvas');
        const ctx = canvas.getContext('2d');
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;

        // Save the current canvas state
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        // // Increase canvas size
        // canvas.width += 10;
        // canvas.height += 10;

        // Restore the saved canvas state
        ctx.putImageData(imageData, 0, 0);

        // Draw the new point
        ctx.fillStyle = 'pink';
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
    }

    function increaseCanvasSize() {
        const canvas = document.getElementById('myCanvas');
        const ctx = canvas.getContext('2d');

        // Save the current canvas state
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        // Increase canvas size
        canvas.width += 10;
        canvas.height += 10;

        // Restore the saved canvas state
        ctx.putImageData(imageData, 0, 0);
    }

    function clearCanvas() {
        const canvas = document.getElementById('myCanvas');
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.width = 200;
        canvas.height = 200;
    }

    function clickRunner(){
        drawRandomPoint();
        count++
    }
</script>

<button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onclick={clickRunner}>
    clicks: {count}
</button>

<button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onclick={() => {
    count = 0;


    playBuzzSound();
    clearCanvas();
   
}}>Reset</button>

<button onclick={()=>{
    interval = setInterval(()=>{
        clickRunner()
    }, 0.5)
    sizeInterval = setInterval(()=>{
        increaseCanvasSize()
    }, 200)

}}>Autopilot</button>

<button onclick={()=>{
    clearInterval(interval)
    clearInterval(sizeInterval)
}}>Stop</button>

<canvas id="myCanvas" width="200" height="200" style="border:1px solid #000000;"></canvas>
