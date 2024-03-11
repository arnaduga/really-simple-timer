let countdown;
const timerDisplay = document.getElementById("timer");
const startButton = document.getElementById("startButton");
const pauseButton = document.getElementById("pauseButton");
const resetButton = document.getElementById("resetButton");
const timerContainer = document.getElementById("timer-container");
const audio = new Audio("./sounds/round_ended.mp3");
let isTimerRunning = false;

function getDurationFromQueryString() {
  const params = new URLSearchParams(window.location.search);
  const duration = params.get("duration");
  if (duration && /^(\d+):(\d+)$/.test(duration)) {
    const [minutes, seconds] = duration
      .split(":")
      .map((num) => parseInt(num, 10));
    return minutes * 60 + seconds;
  }
  return 2 * 60; // Default to 180 seconds (3 minutes) if no valid duration is provided
}

function timer(seconds) {
  clearInterval(countdown);

  const now = Date.now();
  const then = now + seconds * 1000;
  displayTimeLeft(seconds);

  countdown = setInterval(() => {
    const secondsLeft = Math.round((then - Date.now()) / 1000);

    displayTimeLeft(secondsLeft);

    if (secondsLeft <= 0) {
      clearInterval(countdown);

      audio.play();
      timerDisplay.classList.add("timeout");
      timerDisplay.classList.add("pulsate");
      startButton.classList.add("hidden");
      pauseButton.classList.add("hidden");
      resetButton.classList.remove("hidden");
      return;
    }
  }, 1000);
}

function displayTimeLeft(seconds) {
  let display = "00:00"
  if (seconds && seconds >= 0) {
    const minutes = Math.floor(seconds / 60);
    const remainderSeconds = seconds % 60;
    display = `${minutes}:${
      remainderSeconds < 10 ? "0" : ""
    }${remainderSeconds}`;
  } 

  timerDisplay.textContent = display;
}

// Initialize timer display based on query string
const initialSeconds = getDurationFromQueryString();
timerContainer.classList.remove("hidden");
displayTimeLeft(initialSeconds);
timerContainer.classList.remove("hidden");

startButton.addEventListener("click", () => {
  if (!isTimerRunning) {
    timer(initialSeconds);
    isTimerRunning = true;
    startButton.classList.add("hidden");
    pauseButton.classList.remove("hidden");
    resetButton.classList.remove("hidden");
  }
});

pauseButton.addEventListener("click", () => {
  if (isTimerRunning) {
    clearInterval(countdown);
    isTimerRunning = false;
    pauseButton.textContent = "Resume";
    timerDisplay.classList.add("paused");
    timerDisplay.classList.add("pulsate");
  } else {
    const timeArray = timerDisplay.textContent.split(":");
    const secondsRemaining =
      parseInt(timeArray[0]) * 60 + parseInt(timeArray[1]);
    timer(secondsRemaining);
    isTimerRunning = true;
    pauseButton.textContent = "Pause";
    timerDisplay.classList.remove("paused");
    timerDisplay.classList.remove("pulsate");
  }
});

resetButton.addEventListener("click", () => {
  clearInterval(countdown);
  isTimerRunning = false;
  displayTimeLeft(getDurationFromQueryString());
  timerDisplay.classList.remove("timeout");
  timerDisplay.classList.remove("paused");
  timerDisplay.classList.remove("pulsate");
  startButton.classList.remove("hidden");
  resetButton.classList.add("hidden");
  pauseButton.classList.add("hidden");
});
