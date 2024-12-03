// // src/utils/soundManager.js
// import { Howl } from 'howler';

// const flipSound = new Howl({ src: ['sounds/flip.mp3'] });
// const matchSound = new Howl({ src: ['sounds/match.mp3'] });
// const winSound = new Howl({ src: ['sounds/win.mp3'] });

// export const playFlipSound = () => flipSound.play();
// export const playMatchSound = () => matchSound.play();
// export const playWinSound = () => winSound.play();


import { Howl } from "howler";

const soundEffect = new Howl({
  src: ["sound.mp3"], // Placeholder sound
  volume: 0.5,
});

export const playSound = () => {
  soundEffect.play();
};
