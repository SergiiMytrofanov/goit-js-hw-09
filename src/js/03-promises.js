import Notiflix from 'notiflix';

const form = document.querySelector('.form');
const delayInput = document.querySelector('.js-delay');
const stepInput = document.querySelector('.js-step');
const amountInput = document.querySelector('.js-amount');

function createPromise(position, delay) {
  const shouldResolve = Math.random() > 0.3;

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldResolve) {
        Notiflix.Notify.success(`✅ Виконана обіцянка ${position} з затримкою ${delay}ms`);
        resolve({ position, delay });
      } else {
        Notiflix.Notify.failure(`❌ Невиконана обіцянка ${position} з затримкою ${delay}ms`);
        reject({ position, delay });
      }
    }, delay);
  });
}

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const delay = parseInt(delayInput.value);
  const step = parseInt(stepInput.value);
  const amount = parseInt(amountInput.value);

  let currentDelay = delay;
  for (let i = 1; i <= amount; i++) {
    createPromise(i, currentDelay);
    currentDelay += step;
  }
});

