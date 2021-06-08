import {defaultPalette} from './defaults.js';

/* Load the currently saved color values into the form. */
let inputs = document.getElementById("save-colors-form").elements;
for (var i = 0; i < inputs.length; i++ ){
  let element = inputs[i];
  if (element.nodeName === "INPUT" && element.type === "text") {
    chrome.storage.sync.get(element.name, function(result) {
      element.value = result[element.name];
    });
  }
}

let saveColorsButton = document.getElementById("save-colors-button");
saveColorsButton.addEventListener("click", saveColors);

/* Save the colors that the user typed in the form to storage. */
async function saveColors() {
  let inputs = document.getElementById("save-colors-form").elements;
  for (var i = 0; i < inputs.length; i++ ) {
    let element = inputs[i];
    if (element.nodeName === "INPUT" && element.type === "text") {
      chrome.storage.sync.set({[element.name]: element.value}, function() {
        console.log("Set color " + element.value + " in storage.");
      });
    }
  }

  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: setColorsInCSS,
  });
}

/* Set the CSS variables for the colors saved in storage. */
function setColorsInCSS() {
  console.log("saveColors");

  let palette = ["bg1", "bg2", "bg3", "fg1"];

  palette.forEach(paletteColor => {
    chrome.storage.sync.get(paletteColor, function(result) {
      var r = document.querySelector(':root');
      var cssVarName = `--${paletteColor.substr(0,2)}-${paletteColor.substr(2,1)}`;
      r.style.setProperty(cssVarName, result[paletteColor], "important");
    });
  });
}

/* Reset the colors back to the default palette and save. */
let resetColorsButton = document.getElementById("reset-colors-button");
resetColorsButton.addEventListener("click", async() => {
  let inputs = document.getElementById("save-colors-form").elements;
  let inputNum = 0;
  for (var i = 0; i < inputs.length; i++ ){
    let element = inputs[i];
    if (element.nodeName === "INPUT" && element.type === "text") {
      element.value = defaultPalette[inputNum][element.name];
      inputNum++;
    }
  }

  saveColors();
});