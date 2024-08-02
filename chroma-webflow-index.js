//<!--🟢 COLOR PICKER CODE 🟢-->
   // Create a new color picker instance
   // https://iro.js.org/guide.html#getting-started
   var colorPicker = new iro.ColorPicker(".ms-colorpicker", {
       // color picker options
       // Option guide: https://iro.js.org/guide.html#color-picker-options
       width: 180,
       color: "#FF7C33",
       borderWidth: 5,
       borderColor: "#f5f5f5",
   });    
   var values = document.getElementById("values");
   var hexInput = document.getElementById("hexInput");
   var swatch = document.getElementById("colorSwatch");    // https://iro.js.org/guide.html#color-picker-events
   colorPicker.on(["color:init", "color:change"], function(color){
       // Show the current color in different formats
       // Using the selected color: https://iro.js.org/guide.html#selected-color-api
       values.innerHTML = [
           "hex: " + color.hexString,
           "rgb: " + color.rgbString,
           "hsl: " + color.hslString,
       ].join("<br>");
       
       hexInput.value = color.hexString;
       swatch.style.backgroundColor = color.hexString;
   });    hexInput.addEventListener('change', function() {
       colorPicker.color.hexString = this.value;
       swatch.style.backgroundColor = this.value;
   });
   
//<!--🟢 COLOR SHADER CODE 🟢-->  
   document.addEventListener("DOMContentLoaded", () => {
  const colorInput = hexInput;
  ///////CHANGE^^^^^^^^^^^^^/////////
  const colorNameInput = document.getElementById("colorName");//
  const resultsContainer = document.getElementById("resultsContainer");//
  const exportButton = document.getElementById("exportButton");//
  const incrementBy5Button = document.getElementById("incrementBy5");//
  const incrementBy10Button = document.getElementById("incrementBy10");//
  const toggleButton = document.getElementById("toggleButton");//
  const exportIMG = document.getElementById("exportIMG");//

  let colorRange = [];
  let increment = 10; // Default increment
  let isLightenMode = true; // Default to lightening colors
  let suffixLOrD = "";

  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  }

  function rgbToHex(r, g, b) {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b)
      .toString(16)
      .slice(1)
      .toUpperCase()}`;
  }

  function adjustColor(hex, percent, lightenMode) {
    const rgb = hexToRgb(hex);
    if (!rgb) return "";

    const adjust = (color) => {
      const newValue = lightenMode
        ? color + (255 - color) * (percent / 100)
        : color * (1 - percent / 100);
      return lightenMode
        ? Math.min(255, Math.floor(newValue))
        : Math.max(0, Math.ceil(newValue));
    };

    const adjusted = {
      r: adjust(rgb.r),
      g: adjust(rgb.g),
      b: adjust(rgb.b),
    };

    return rgbToHex(adjusted.r, adjusted.g, adjusted.b);
  }

  function calculateBrightness(hex) {
    const rgb = hexToRgb(hex);
    if (!rgb) return 0;

    // Standard formula to calculate brightness
    return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
  }

  function setTextColorBasedOnBackground(hex, element) {
    const brightness = calculateBrightness(hex);
    if (brightness > 186) {
      // Light background
      element.style.color = "black";
    } else {
      // Dark background
      element.style.color = "white";
    }
  }

  // Toggle the suffix from -L to -D depending on toggle switch state
  function toggleSuffix() {
    suffixLOrD = "";
    if (isLightenMode == true) {
      suffixLOrD = "L";
      console.log(suffixLOrD);
      return suffixLOrD;
    } else {
      suffixLOrD = "D";
      console.log(suffixLOrD);
      return suffixLOrD;
    }
  }

  function generateColorRange(hex, increment, lightenMode) {
    const range = [];
    const suffixCheck = toggleSuffix();
    for (let i = increment; i <= 100; i += increment) {
      const suffix = suffixCheck + `${i}`;
      range.push({
        color: adjustColor(hex, i, lightenMode),
        name: `${document.getElementById("colorName").value}-${suffix}`, 
      });
    }
    return range;
  }

  function updateColorRange() {
    const color = colorInput.value;
    if (color) {
      colorRange = generateColorRange(color, increment, isLightenMode);
      resultsContainer.innerHTML = "";
      colorRange.forEach(({ color, name }) => {
        const resultDiv = document.createElement("div");
        resultDiv.className = "result";
        resultDiv.style.backgroundColor = color;

        const nameContainer = document.createElement("div");
        nameContainer.className = "name-container";
        nameContainer.textContent = name;
        setTextColorBasedOnBackground(color, nameContainer);
        nameContainer.addEventListener("click", () => {
          navigator.clipboard.writeText(name);
          showCopyIndicator(nameContainer);
          nameContainer.textContent = "Copied!";
          setTimeout(() => {
            nameContainer.textContent = name;
          }, 1000);

          //   setTimeout(() => hideCopyIndicator(nameContainer), 1000);
        });

        const hexContainer = document.createElement("div");
        hexContainer.className = "hex-container";
        hexContainer.textContent = color;
        setTextColorBasedOnBackground(color, hexContainer);
        hexContainer.addEventListener("click", () => {
          navigator.clipboard.writeText(color);
          hexContainer.textContent = "Copied!";
          setTimeout(() => {
            hexContainer.textContent = color;
          }, 1000);

          showCopyIndicator(hexContainer);
          //   setTimeout(() => hideCopyIndicator(hexContainer), 1000);
        });

        const hoverIndicator = document.createElement("div");
        hoverIndicator.className = "hover-indicator";

        const copyIndicator = document.createElement("div");
        copyIndicator.className = "copy-indicator";

        resultDiv.appendChild(nameContainer);
        resultDiv.appendChild(hexContainer);
        resultDiv.appendChild(copyIndicator);
        resultDiv.appendChild(hoverIndicator);

        resultsContainer.appendChild(resultDiv);
        
        const csaBackground = document.getElementById("csaBackground");
        csaBackground.style.backgroundcolor = hexInput.value;
        exportButton.style.backgroundColor = hexInput.value;
        setTextColorBasedOnBackground(hexInput.value, exportButton);
      });
    }
  }
	   
  function showCopyIndicator(container) {
    const indicator = container.nextElementSibling; // Assuming copy indicator is next sibling
    indicator.style.opacity = 1;
  }

  function hideCopyIndicator(container) {
    const indicator = container.nextElementSibling; // Assuming copy indicator is next sibling
    indicator.style.opacity = 0;
  }

  function toggleMode() {
    isLightenMode = !isLightenMode;
    toggleButton.textContent = isLightenMode ? "Lighten" : "Darken";
    updateColorRange();
  }

  colorInput.addEventListener("input", updateColorRange);
  colorNameInput.addEventListener("input", updateColorRange);

  incrementBy5Button.addEventListener("click", () => {
    increment = 5;
    console.log("increment 5 button clicked");
    updateColorRange();
  });

  incrementBy10Button.addEventListener("click", () => {
    increment = 10;
    updateColorRange();
  });

  toggleButton.addEventListener("click", toggleMode);

  exportButton.addEventListener("click", () => {
    if (colorRange.length === 0) {
      alert("Please enter a color to generate the range first.");
      return;
    }
    const textData = colorRange
      .map(({ color, name }) => `${name}: ${color}`)
      .join("\n");
    const blob = new Blob([textData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "color-range.txt";
    a.click();
    URL.revokeObjectURL(url);
  });

	   
	  //***********ADDED IN**************//
// Save div as image
exportIMG.addEventListener("click", () => {
    console.log("export button clicked");
  });
	   
 // $( "#exportPNG" ).on( "click", function() {
	 
      // html2canvas(document.querySelector("#resultsContainer")).then(canvas => {
        // canvas.toBlob(function(blob) {
        //   window.saveAs(blob, 'chromastep-colors.jpg');
        // });
        // });
    // });
	   
// html2canvas([document.getElementById('resultsContainer')], {
//     onrendered: function(canvas) {
//        document.body.appendChild(canvas);
//        var data = canvas.toDataURL('image/png');
//        // AJAX call to send `data` to a PHP file that creates an image from the dataURI string and saves it to a directory on the server
//     }
// });
	
});
