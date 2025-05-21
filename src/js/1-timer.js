import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

let intervalId;
let userSelectedDate;
const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    userSelectedDate = selectedDates[0];
    if (userSelectedDate > Date.now()) {
      startBtn.removeAttribute('disabled');
    } else {
      iziToast.show({
        title: 'Oh NO!',
        message: 'Please choose a date in the future',
        position: 'topCenter',
        color: 'red',
      });
    }
  },
};
const daysStr = document.querySelector('[data-days]');
const hoursStr = document.querySelector('[data-hours]');
const minutesStr = document.querySelector('[data-minutes]');
const secondsStr = document.querySelector('[data-seconds]');
const myInput = document.querySelector('#datetime-picker');
const startBtn = document.querySelector('[data-start]');
startBtn.addEventListener('click', startTimer);
flatpickr(myInput, options);

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function startTimer(e) {
  if (e.target) {
    startBtn.setAttribute('disabled', '');
    myInput.setAttribute('disabled', '');
  }

  intervalId = setInterval(() => {
    const currentTime = Date.now();
    const diffMs = userSelectedDate - currentTime;
    const timeStr = timeToStr(diffMs);
    daysStr.textContent = timeStr.d;
    hoursStr.textContent = timeStr.h;
    minutesStr.textContent = timeStr.m;
    secondsStr.textContent = timeStr.s;

    if (diffMs < 1000) {
      clearInterval(intervalId);
      myInput.removeAttribute('disabled');
    }
  }, 1000);
}
function timeToStr(ms) {
  const { days, hours, minutes, seconds } = convertMs(ms);
  let d = days.toString().padStart(2, '0');
  let h = hours.toString().padStart(2, '0');
  let m = minutes.toString().padStart(2, '0');
  let s = seconds.toString().padStart(2, '0');
  return { d, h, m, s };
}
