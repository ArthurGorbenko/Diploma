/* eslint-disable prefer-destructuring, no-use-before-define */
const {speed} = app.datas;
// const font = slideshow.data('font');
/*
if (font) {
  $('head').append(
    `<link rel="stylesheet" type="text/css" href="//fonts.googleapis.com/css?family=${font.replace(
      ' ',
      '+',
    )}&display=swap">`,
  );
  document.body.style.fontFamily = `${font}, Roboto, sans-serif`;
}
*/

const slides = $('.slide');
let current = 0;
let interval;

const stop = () => {
  clearInterval(interval);
};

const next = () => {
  slides[current].classList.remove('active', 'beforeEnd');

  // stop current video
  let video = $('video', slides[current])[0];
  if (video) {
    video.pause();
    video.currentTime = 0;
  }

  current = slides[current + 1] ? current + 1 : 0;

  slides[current].classList.add('active');

  // play next video
  video = $('video', slides[current])[0];
  if (video) {
    video.play();

    if (slides[current].classList.contains('slide-video')) {
      stop();
      video.onended = () => {
        next();
        play();
      };
    }
  }
};

const play = () => {
  interval = setInterval(() => {
    slides[current].classList.add('beforeEnd');
    setTimeout(next, 425);
  }, speed * 1000 - 425);
};

if (slides[1]) {
  play();
}
