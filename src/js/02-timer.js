import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import Notiflix from "notiflix";

const startBtn = document.querySelector('[data-start]');

const daysEnd = document.querySelector('[data-days]');
const hoursEnd = document.querySelector('[data-hours]');
const minutesEnd = document.querySelector('[data-minutes]');
const secondsEnd = document.querySelector('[data-seconds]');

let countdownIntervalId;

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return value.toString().padStart(2, '0');
}

flatpickr("#datetime-picker", {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];

    if (selectedDate < new Date()) {
      Notiflix.Notify.warning("Please choose a date in the future");
      startBtn.disabled = true;
    } else {
      startBtn.disabled = false;
    }
  },
});

startBtn.addEventListener('click', () => {
  const selectedDate = flatpickr.parseDate(document.getElementById('datetime-picker').value);
  const currentDate = new Date();
  const timeDifference = selectedDate.getTime() - currentDate.getTime();

  if (timeDifference <= 0) {
    Notiflix.Notify.warning("Please choose a date in the future");
    return;
  }

  startBtn.disabled = true;

  countdownIntervalId = setInterval(() => {
    const { days, hours, minutes, seconds } = convertMs(timeDifference);

    daysEnd.textContent = addLeadingZero(days);
    hoursEnd.textContent = addLeadingZero(hours);
    minutesEnd.textContent = addLeadingZero(minutes);
    secondsEnd.textContent = addLeadingZero(seconds);

    timeDifference -= 1000;

    if (timeDifference < 0) {
      clearInterval(countdownIntervalId);
      startBtn.disabled = false;
    }
  }, 1000);
});
