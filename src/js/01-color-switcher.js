// Функция для генерации случайного цвета в формате HEX
function getRandomHexColor() {
  return `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, "0")}`;
}

// Получаем ссылки на кнопки "Start" и "Stop"
const startButton = document.querySelector("[data-start]");
const stopButton = document.querySelector("[data-stop]");

let intervalId = null; // Переменная для хранения идентификатора интервала

// Функция для запуска смены цвета фона с интервалом 1 секунда
function startColorChange() {
  startButton.disabled = true; // Делаем кнопку "Start" неактивной
  stopButton.disabled = false; // Делаем кнопку "Stop" активной

  intervalId = setInterval(() => {
    document.body.style.backgroundColor = getRandomHexColor();
  }, 1000);
}

// Функция для остановки смены цвета фона
function stopColorChange() {
  startButton.disabled = false; // Делаем кнопку "Start" активной
  stopButton.disabled = true; // Делаем кнопку "Stop" неактивной

  clearInterval(intervalId); // Останавливаем интервал
}

// Добавляем обработчики событий для кнопок
startButton.addEventListener("click", startColorChange);
stopButton.addEventListener("click", stopColorChange);
