import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import Notiflix from 'notiflix';

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
    Notiflix.Notify.success('Time is up!'); // Используем Notiflix.Notify.success
    timerRunning = false;
    dateTimePicker.disabled = false; // Разблокируем поле ввода
    startButton.disabled = true; // Блокируем кнопку
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
    const validDate = selectedDate > currentDate;

    if (validDate) {
      dateTimePicker.disabled = true; // Заблокируем поле ввода
      startButton.disabled = false; // Разблокируем кнопку
    } else {
      Notiflix.Notify.failure('Please choose a date in the future');
      startButton.disabled = true;
    }
  },
});

let timerId = null;
let timerRunning = false;

// Добавляем атрибут disabled к кнопке "Start" при инициализации
startButton.disabled = true;

// Обработчик нажатия кнопки "Start"
startButton.addEventListener('click', () => {
  if (timerRunning) {
    // Таймер уже запущен, ничего не делаем
    return;
  }

  const endDate = flatpickrInstance.selectedDates[0];
  const currentDate = new Date();
  const validDate = endDate > currentDate;

  if (validDate) {
    timerId = setInterval(updateTimer, 1000);
    updateTimer();
    timerRunning = true;
    dateTimePicker.disabled = true; // Заблокируем поле ввода
    startButton.disabled = true; // Заблокируем кнопку
  } else {
    Notiflix.Notify.failure('Please choose a date in the future');
  }
});
