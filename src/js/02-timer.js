
import flatpickr from "flatpickr";

import "flatpickr/dist/flatpickr.min.css";
import Notiflix from "notiflix";

const dateTimePicker = document.querySelector("#datetime-picker");

const startButton = document.querySelector("[data-start]");

const daysValue = document.querySelector("[data-days]");
const hoursValue = document.querySelector("[data-hours]");
const minutesValue = document.querySelector("[data-minutes]");
const secondsValue = document.querySelector("[data-seconds]");

flatpickr("#datetime-picker", {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];

    if (selectedDate <= new Date()) {
      Notiflix.Notify.failure("Прошу обрати майбутній час до якого слід застосувати відлік");
      startButton.disabled = true;
    } else {
      startButton.disabled = false;
    }
  },
});

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
  return value.toString().padStart(2, "0");
}

let countdownInterval;

function startCountdown() {
  clearInterval(countdownInterval);

  const selectedDate = dateTimePicker.value;
  const endDate = new Date(selectedDate).getTime();
  const currentDate = new Date().getTime();
  const remainingTime = endDate - currentDate;

  if (remainingTime <= 0) {
    Notiflix.Notify.failure("Прошу обрати майбутній час до якого слід застосувати відлік");
    return;
  }
 
  countdownInterval = setInterval(() => {
    const currentTime = new Date().getTime();
    const remainingTime = endDate - currentTime;

    if (remainingTime <= 0) {
      clearInterval(countdownInterval);
      updateTimerDisplay(convertMs(0));
      Notiflix.Notify.success("Лічильник завершено!");
      return;
    }

    const time = convertMs(remainingTime);
    updateTimerDisplay(time);
  }, 1000);
}

function updateTimerDisplay(time) {
  daysValue.textContent = addLeadingZero(time.days);
  hoursValue.textContent = addLeadingZero(time.hours);
  minutesValue.textContent = addLeadingZero(time.minutes);
  secondsValue.textContent = addLeadingZero(time.seconds);
}



startButton.addEventListener("click", () => {
  startCountdown();
  startButton.disabled = true;
});
