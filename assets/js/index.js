const musicTracks = [
  [
    'Beyonce',
    `Don't Hurt Yourself`,
    './assets/audio/beyonce.mp3',
    './assets/img/lemonade.png',
  ],
  [
    'Dua Lipa',
    `Don't Start Now`,
    './assets/audio/dontstartnow.mp3',
    './assets/img/dontstartnow.png',
  ],
];

window.addEventListener('DOMContentLoaded', () => {
  const body = document.body,
    playBtn = document.querySelector('.play'),
    playPrevBtn = document.querySelector('.play-prev'),
    playNextBtn = document.querySelector('.play-next');

  let isPlay = false;
  let playNum = 0;

  for (let i = musicTracks.length - 1; i >= 0; i--) {
    body.insertAdjacentHTML(
      'afterbegin',
      `<audio src="${musicTracks[i][2]}"></audio>`
    );
  }

  const audio = document.querySelectorAll('audio'),
    cover = document.querySelector('.cover'),
    trackArtist = document.querySelector('.track-artist'),
    trackName = document.querySelector('.track-name');

  function setInformation(trackNum) {
    cover.setAttribute('src', musicTracks[trackNum][3]);

    trackArtist.textContent = musicTracks[trackNum][0];
    trackName.textContent = musicTracks[trackNum][1];
  }

  setInformation(playNum);

  function getTimeCodeFromNum(num) {
    let seconds = parseInt(num);
    let minutes = parseInt(seconds / 60);
    seconds -= minutes * 60;
    const hours = parseInt(minutes / 60);
    minutes -= hours * 60;

    if (hours === 0) {
      return `${minutes}:${String(seconds % 60).padStart(2, 0)}`;
    }

    return `${String(hours).padStart(2, 0)}:${minutes}:${String(
      seconds % 60
    ).padStart(2, 0)}`;
  }

  const timeLength = document.querySelector('.time-length');

  audio[playNum].addEventListener(
    'loadeddata',
    () => {
      timeLength.textContent = getTimeCodeFromNum(audio[playNum].duration);
      audio.volume = 0.75;

      console.log(audio[playNum].duration);
    },
    false
  );

  const timeline = document.querySelector('.timeline');
  timeline.addEventListener(
    'click',
    (e) => {
      const timelineWidth = window.getComputedStyle(timeline).width;
      const timeToSeek =
        (e.offsetX / parseInt(timelineWidth)) * audio[playNum].duration;
      audio[playNum].currentTime = timeToSeek;
    },
    false
  );

  setInterval(() => {
    const progressBar = document.querySelector('.timeline-progress');
    progressBar.style.width =
      (audio[playNum].currentTime / audio[playNum].duration) * 100 + '%';
    document.querySelector('.time-current').textContent = getTimeCodeFromNum(
      audio[playNum].currentTime
    );
  }, 500);

  function startAudio(playedTrack) {
    audio[playedTrack].play();
    cover.classList.add('wave');
    isPlay = true;
  }

  function pauseAudio(stoppedTrack) {
    audio[stoppedTrack].pause();
    cover.classList.remove('wave');
    isPlay = false;
  }

  function playAudio() {
    if (!isPlay) {
      startAudio(playNum);
    } else {
      pauseAudio(playNum);
    }
  }

  function toogleBtn() {
    playBtn.classList.toggle('pause');
  }

  playBtn.addEventListener('click', playAudio);

  playBtn.addEventListener('click', toogleBtn);

  function checkIfPauseClassNeeded() {
    if (!isPlay) {
      playBtn.classList.add('pause');
    }
  }

  function resetTrackProgressTimer(track) {
    audio[track].currentTime = 0;
  }

  function playNext() {
    pauseAudio(playNum);
    resetTrackProgressTimer(playNum);
    checkIfPauseClassNeeded();
    playNum += 1;

    if (playNum > audio.length - 1) {
      playNum = 0;
    }

    startAudio(playNum);
    setInformation(playNum);
    timeLength.textContent = getTimeCodeFromNum(audio[playNum].duration);
  }

  function playPrev() {
    pauseAudio(playNum);
    resetTrackProgressTimer(playNum);
    checkIfPauseClassNeeded();
    playNum -= 1;

    if (playNum < 0) {
      playNum = audio.length - 1;
    }

    startAudio(playNum);
    setInformation(playNum);
    timeLength.textContent = getTimeCodeFromNum(audio[playNum].duration);
  }

  playPrevBtn.addEventListener('click', playPrev);
  playNextBtn.addEventListener('click', playNext);

  audio.forEach((track) => {
    track.addEventListener('ended', playNext);
  });
});
