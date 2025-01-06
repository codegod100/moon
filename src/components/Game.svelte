<script>
  import { onMount } from "svelte";

  let canvas;
  let ctx;
  let player = { x: 50, y: 50, size: 20, speed: 20 };

  let audioContext;
  let oscillator;
  let gainNode;

  function drawLineAndCheckCollision(targetX, targetY) {
    ctx.beginPath();
    ctx.moveTo(player.x + player.size / 2, player.y + player.size / 2);
    ctx.lineTo(targetX, targetY);
    ctx.strokeStyle = "red";
    ctx.stroke();

    const dx = targetX - (player.x + player.size / 2);
    const dy = targetY - (player.y + player.size / 2);
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < player.size / 2) {
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime); // increase volume
      oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // higher frequency
    }
  }

  function moveToClick(event) {
    const rect = canvas.getBoundingClientRect();
    const targetX = event.clientX - rect.left;
    const targetY = event.clientY - rect.top;

    const dx = targetX - player.x;
    const dy = targetY - player.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const steps = distance / player.speed;

    let stepX = dx / steps;
    let stepY = dy / steps;

    function animateMove() {
      if (
        Math.abs(player.x - targetX) > Math.abs(stepX) ||
        Math.abs(player.y - targetY) > Math.abs(stepY)
      ) {
        player.x += stepX;
        player.y += stepY;
        drawPlayer();
        requestAnimationFrame(animateMove);
      } else {
        player.x = targetX;
        player.y = targetY;
        drawPlayer();
      }
    }

    animateMove();
  }

  function setupAudio() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    oscillator = audioContext.createOscillator();
    gainNode = audioContext.createGain();
    gainNode.gain.setValueAtTime(0.05, audioContext.currentTime); // reduce volume
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(220, audioContext.currentTime); // value in hertz
    oscillator.start();
  }

  function drawPlayer() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "lightgreen";
    ctx.fillRect(player.x, player.y, player.size, player.size);
    drawLineAndCheckCollision(1, 1);
  }

  function handleKeyup(event) {
    // Stop the oscillator when the key is released
    oscillator.stop(audioContext.currentTime);
  }

  let keys = {};

  function handleKeydown(event) {
    keys[event.key] = true;
    console.log(event.key);
    switch (event.key) {
      case "ArrowUp":
        player.y -= player.speed;
        break;
      case "ArrowLeft":
        player.x -= player.speed;
        break;
      case "ArrowDown":
        player.y += player.speed;
        break;
      case "ArrowRight":
        player.x += player.speed;
        break;
    }
    gainNode.gain.setValueAtTime(0.05, audioContext.currentTime); // reduce volume
    oscillator.frequency.setValueAtTime(220, audioContext.currentTime); // value in hertz
    drawPlayer();
  }

  onMount(() => {
    canvas = document.getElementById("gameCanvas");
    ctx = canvas.getContext("2d");
    drawPlayer();
    setupAudio();
    window.addEventListener("keydown", handleKeydown);
    window.addEventListener("keyup", handleKeyup);
    // window.addEventListener("mousemove", moveToClick);
    window.addEventListener("click", moveToClick);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
      window.removeEventListener("keyup", handleKeyup);
      window.removeEventListener("mousemove", moveToClick);
      window.removeEventListener("click", moveToClick);
    };
  });
</script>

<canvas id="gameCanvas" width="800" height="600" style="border:1px solid #000;"
></canvas>
