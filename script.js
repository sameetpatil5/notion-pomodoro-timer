// Global variables
let timeLeft = 25 * 60; // seconds
let timerInterval;
let currentInterval = 'pomodoro';
let backgroundColor = '#F1F1EF'; // Default background color
let fontColor = '#37352F'; // Default font color

// DOM elements
const timeLeftEl = document.getElementById('time-left');
const startStopBtn = document.getElementById('start-stop-btn');
// const resetBtn = document.getElementById('reset-btn');
const pomodoroIntervalBtn = document.getElementById('pomodoro-interval-btn');
const shortBreakIntervalBtn = document.getElementById('short-break-interval-btn');
const longBreakIntervalBtn = document.getElementById('long-break-interval-btn');
const settingsBtn = document.getElementById('settings-btn');
const settingsModal = document.getElementById('settings-modal');
const closeModalBtn = document.querySelector('.close-btn');
const backgroundColorSelect = document.getElementById('background-color');
const fontColorSelect = document.getElementById('font-color');
const saveBtn = document.getElementById('save-btn');
const timerContainer = document.getElementById('timer-container');
const ripple = document.getElementById('ripple');
const optionBtn = document.getElementById('option-btn');
const optionsCollapse = document.getElementById('options-collapse');

// Event listeners for interval buttons
pomodoroIntervalBtn.addEventListener('click', () => {
  setActiveButton(pomodoroIntervalBtn);  // Set Focus button as active
  currentInterval = 'pomodoro';
  timeLeft = 25 * 60;
  updateTimeLeftTextContent();
  resetTimer();
});

shortBreakIntervalBtn.addEventListener('click', () => {
  setActiveButton(shortBreakIntervalBtn);  // Set Short Break button as active
  currentInterval = 'short-break';
  timeLeft = 5 * 60;
  updateTimeLeftTextContent();
  resetTimer();
});

longBreakIntervalBtn.addEventListener('click', () => {
  setActiveButton(longBreakIntervalBtn);  // Set Long Break button as active
  currentInterval = 'long-break';
  timeLeft = 10 * 60;
  updateTimeLeftTextContent();
  resetTimer();
});

// Event listener for start/stop button
startStopBtn.addEventListener('click', () => {
  setStartStopButtonState(); // Toggle between Start/Stop
  if (startStopBtn.textContent === 'Start') {
    startTimer();
    startStopBtn.textContent = 'Stop';
  } else {
    stopTimer();
  }
});

// Event listener for keydown space bar event to toggle start/stop
document.addEventListener('keydown', (event) => {
  // Check if the space bar was pressed
  if (event.code === 'Space') {
    event.preventDefault();

    // Toggle start/stop logic only when window in focus
    if (document.hasFocus()) {
      toggleStartStop();
    }
  }
});

// Event listener for reset button
// resetBtn.addEventListener('click', () => {
//   // Reset the timer
//   resetTimer();
// });

timerContainer.addEventListener('dblclick', () => {
  // Reset the timer
  resetTimer();
});

// Add event listener for keyboard shortcuts
document.addEventListener('keydown', (event) => {
  // Check if Ctrl is held and Space is pressed for reset
  if (event.ctrlKey && event.code === 'Space') {
    event.preventDefault(); // Prevent default browser behavior
    resetTimer();
  }
});

// Event listener for settings button
settingsBtn.addEventListener('click', () => {
  settingsModal.style.display = 'flex';
});

// Event listener for close button in the settings modal
closeModalBtn.addEventListener('click', () => {
  settingsModal.style.display = 'none';
});

// Close the modal if clicking outside of it
window.addEventListener('click', (event) => {
  if (event.target === settingsModal) {
    settingsModal.style.display = 'none';
  }
});

// Event listener for save button in the settings modal
saveBtn.addEventListener('click', () => {
  const newBackgroundColor = backgroundColorSelect.value;
  const newFontColor = fontColorSelect.value;

  // Save preferences to localStorage
  localStorage.setItem('backgroundColor', newBackgroundColor);
  localStorage.setItem('fontColor', newFontColor);

  // Apply the new saved preferences
  applyUserPreferences();

  // Close the modal after saving preferences
  settingsModal.style.display = 'none';
});

// Function to set an interval button as active and reset the others
function setActiveButton(activeButton) {
  // Remove the 'active' class from all interval buttons
  const intervalButtons = [pomodoroIntervalBtn, shortBreakIntervalBtn, longBreakIntervalBtn];
  intervalButtons.forEach((btn) => btn.classList.remove('active'));

  // Add the 'active' class to the clicked button
  activeButton.classList.add('active');
}

// Function to reset all interval buttons to their default color
function resetIntervalButtons() {
  const intervalButtons = [pomodoroIntervalBtn, shortBreakIntervalBtn, longBreakIntervalBtn];
  intervalButtons.forEach((btn) => btn.classList.remove('active'));
}

// Function to change the start/stop button state
function setStartStopButtonState() {
  // Toggle the active state on the start/stop button
  startStopBtn.classList.toggle('active');
}

// Function to reset the start/stop button state
function resetStartStopButtonState() {
  startStopBtn.classList.remove('active');
}

// Function to start the timer
function startTimer() {
  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimeLeftTextContent();
    if (timeLeft === 0) {
      clearInterval(timerInterval);
      if (currentInterval === 'pomodoro') {
        timeLeft = 5 * 60;
        currentInterval = 'short-break';
        startTimer();
      } else if (currentInterval === 'short-break') {
        timeLeft = 10 * 60;
        currentInterval = 'long-break';
        startTimer();
      } else {
        timeLeft = 25 * 60;
        currentInterval = 'pomodoro';
      }
    }
  }, 1000);
}

// Function to stop the timer
function stopTimer() {
  clearInterval(timerInterval);
  startStopBtn.textContent = 'Start';
}

// Function to reset the timer based on the current interval
function resetTimer() {
  // Reset the animation (allows retriggering)
  ripple.classList.remove('animate');
  void ripple.offsetWidth; // Trigger reflow to restart animation

  // Add the animation class
  ripple.classList.add('animate');

  stopTimer(); // Stop the timer

  // Add fade-out animation to text
  timeLeftEl.classList.add('fade-out');

  resetStartStopButtonState(); // Reset Start/Stop button
  // resetIntervalButtons(); // Reset all interval buttons to default state

  setTimeout(() => {
    // Update the timer value after fade-out
    if (currentInterval === 'pomodoro') {
      timeLeft = 25 * 60; // Reset to Focus interval
    } else if (currentInterval === 'short-break') {
      timeLeft = 5 * 60; // Reset to Short Break interval
    } else if (currentInterval === 'long-break') {
      timeLeft = 10 * 60; // Reset to Long Break interval
    }
    updateTimeLeftTextContent(); // Update the timer display
    startStopBtn.textContent = 'Start';

    // Fade in the text
    timeLeftEl.classList.remove('fade-out');
    timeLeftEl.classList.add('fade-in');
  }, 300); // Match the fade-out duration in CSS

  // Remove the fade-in class after animation
  setTimeout(() => {
    timeLeftEl.classList.remove('fade-in');
  }, 600); // Allow fade-in to complete
}

// Function to toggle the timer
function toggleStartStop() {
  if (startStopBtn.textContent === 'Start') {
    startTimer();  // Start the timer
    startStopBtn.textContent = 'Stop';
    startStopBtn.classList.add('active');
  } else {
    stopTimer();  // Stop the timer
    startStopBtn.textContent = 'Start';
    startStopBtn.classList.remove('active');
  }
}

// Function to update the time left text content
function updateTimeLeftTextContent() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timeLeftEl.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Function to apply the user's saved preferences
function applyUserPreferences() {
  // Retrieve user preferences from localStorage
  const savedBackgroundColor = localStorage.getItem('backgroundColor');
  const savedFontColor = localStorage.getItem('fontColor');

  // Apply the preferences if they exist in localStorage
  if (savedBackgroundColor) {
    backgroundColor = savedBackgroundColor;
  }

  if (savedFontColor) {
    fontColor = savedFontColor;
  }

  // Apply the preferences to the Pomodoro Timer widget
  document.body.style.backgroundColor = backgroundColor;
  document.body.style.color = fontColor;
  timeLeftEl.style.color = fontColor;
  // Update the buttons' font and background color
  const buttons = document.querySelectorAll('.interval-btn, #start-stop-btn, #reset-btn, #settings-btn');
  // TODO: fix the buttons
  // buttons.forEach((button) => {
  //   button.style.color = fontColor;
  //   button.style.backgroundColor = backgroundColor;
  //   button.style.borderColor = fontColor;
  // });

  // Highlight the default interval button on page load
  setActiveButton(pomodoroIntervalBtn);
}

// Apply user preferences on page load
applyUserPreferences();