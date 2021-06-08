import {defaultPalette} from './defaults.js';

palette.forEach(paletteColor => {
  chrome.storage.sync.set(paletteColor, function() {
    console.log("Set paletteColor " + paletteColor + " in storage.");
  });
});