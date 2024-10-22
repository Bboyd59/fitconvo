const SoundEffects = {
  initiate: new Audio('/static/sounds/initiate.mp3'),
  terminate: new Audio('/static/sounds/terminate.mp3'),
  keyPress: new Audio('/static/sounds/keypress.mp3'),
  response: new Audio('/static/sounds/response.mp3'),

  play: (sound) => {
    if (SoundEffects[sound]) {
      SoundEffects[sound].currentTime = 0;
      SoundEffects[sound].play().catch(error => console.error('Error playing sound:', error));
    }
  }
};

export default SoundEffects;
