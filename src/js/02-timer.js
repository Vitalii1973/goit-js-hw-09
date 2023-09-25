import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import * as Notiflix from 'notiflix';

// Функция для форматирования чисел с добавлением ведущего нуля
function addLeadingZero(value) {
  return value.toString().padStart(2, '0');
}

// Функция для расчета разницы между датами и обновления интерфейса таймера
function updateTimer() {
  const endDate = flatpickrInstance.selectedDates[0];
  const currentDate = new Date();

  if (endDate <= currentDate) {
    clearInterval(timerId);
    timerId = null;
    Notiflix.Notify.success('Time is up!');
    eventStarted = false; // Подія завершилася, можна знову вибирати дату і час
    dateTimePicker.disabled = false; // Розблоковуємо поле вводу
    startButton.disabled = true; // Заблоковуємо кнопку
    return;
  }

  const timeDifference = endDate - currentDate;
  const { days, hours, minutes, seconds } = convertMs(timeDifference);

  daysElement.textContent = addLeadingZero(days);
  hoursElement.textContent = addLeadingZero(hours);
  minutesElement.textContent = addLeadingZero(minutes);
  secondsElement.textContent = addLeadingZero(seconds);
}

// Функция для расчета разницы между датами
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

// Получение элементов интерфейса
const dateTimePicker = document.querySelector('#datetime-picker');
const startButton = document.querySelector('[data-start]');
const daysElement = document.querySelector('[data-days]');
const hoursElement = document.querySelector('[data-hours]');
const minutesElement = document.querySelector('[data-minutes]');
const secondsElement = document.querySelector('[data-seconds]');

// Настройка flatpickr
const flatpickrInstance = flatpickr(dateTimePicker, {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];
    const currentDate = new Date();

    if (selectedDate <= currentDate) {
      Notiflix.Notify.failure('Please choose a date in the future');
      startButton.disabled = true;
    } else {
      startButton.disabled = false;
    }
  },
});

let timerId = null;
let eventStarted = false; // Змінна для відстеження статусу події

// Обработчик нажатия кнопки "Start"
startButton.addEventListener('click', () => {
  if (eventStarted) {
    // Подія вже розпочалася, не робимо нічого
    return;
  }

  const endDate = flatpickrInstance.selectedDates[0];
  const currentDate = new Date();

  if (endDate <= currentDate) {
    Notiflix.Notify.failure('Please choose a date in the future');
    return;
  }

  if (!timerId) {
    timerId = setInterval(updateTimer, 1000);
    updateTimer();
    eventStarted = true; // Подія розпочалася
    dateTimePicker.disabled = true; // Поле вводу заблоковане
    startButton.disabled = true; // Кнопка заблокована
  }
});
