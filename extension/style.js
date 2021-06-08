let r = document.querySelector(':root');
let palette = ["bg1", "bg2", "bg3", "fg1"];

palette.forEach(paletteColor => {
    chrome.storage.sync.get(paletteColor, function(result) {
        console.log("Retrieved " + result[paletteColor] + " palette color.");
        let cssVarName = `--${paletteColor.substr(0,2)}-${paletteColor.substr(2,1)}`;
        r.style.setProperty(cssVarName, result[paletteColor], "important");
    });
});