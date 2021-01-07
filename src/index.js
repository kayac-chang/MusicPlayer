const select = document.querySelector.bind(document);

function Icon(btn) {
  const icon = btn.querySelector("i.fas");

  return (isPlaying) => {
    icon.classList.toggle("fa-play", !isPlaying);
    icon.classList.toggle("fa-pause", isPlaying);
  };
}

function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max);
}

function MusicPlayer(songs) {
  const audio = select("#audio");
  const cover = select("#cover");
  const title = select("#title");
  const container = select("#progress-container");
  const progress = select("#progress");

  let isPlaying = false;
  let index = 0;

  const player = {
    set isPlaying(flag) {
      const container = select("#music-container");
      container.classList.toggle("play", flag);

      isPlaying = flag;
    },
    get isPlaying() {
      return isPlaying;
    },
    set currentIdx(idx) {
      index = clamp(idx, 0, songs.length - 1);

      this.load(songs[index]);
    },
    get currentIdx() {
      return index;
    },
    load(song) {
      title.innerText = song.title;
      audio.src = song.audio;
      cover.src = song.img;

      this.isPlaying && this.play();
    },
    play() {
      audio.play();

      this.isPlaying = true;
    },
    pause() {
      audio.pause();

      this.isPlaying = false;
    },
    next() {
      this.currentIdx += 1;
    },
    prev() {
      this.currentIdx -= 1;
    }
  };

  player.load(songs[index]);

  audio.addEventListener("timeupdate", () => {
    const { duration, currentTime } = audio;
    const percentage = (currentTime / duration) * 100;

    progress.style.width = `${percentage}%`;

    percentage >= 100 && player.next();
  });

  container.addEventListener("click", ({ offsetX, target }) => {
    audio.currentTime = (offsetX / target.clientWidth) * audio.duration;
  });

  return player;
}

function main() {
  const player = MusicPlayer([
    {
      title: "ukulele",
      audio: "https://www.bensound.com/bensound-music/bensound-ukulele.mp3",
      img: "https://www.bensound.com/bensound-img/ukulele.jpg"
    },
    {
      title: "Creative Minds",
      audio:
        "https://www.bensound.com/bensound-music/bensound-creativeminds.mp3",
      img: "https://www.bensound.com/bensound-img/creativeminds.jpg"
    },
    {
      title: "anewbeginning",
      audio:
        "https://www.bensound.com/bensound-music/bensound-anewbeginning.mp3",
      img: "https://www.bensound.com/bensound-img/anewbeginning.jpg"
    }
  ]);

  const playAndPauseBtn = select("#play");
  const setIconState = Icon(playAndPauseBtn);
  playAndPauseBtn.addEventListener("click", () => {
    player.isPlaying ? player.pause() : player.play();

    setIconState(player.isPlaying);
  });

  const nextBtn = select("#next");
  const prevBtn = select("#prev");
  nextBtn.addEventListener("click", () => player.next());
  prevBtn.addEventListener("click", () => player.prev());
}

main();
