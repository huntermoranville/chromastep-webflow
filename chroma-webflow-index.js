//<!--🟢 COLOR SHADER CODE 🟢-->
document.addEventListener("DOMContentLoaded", () => {
  // Color Input variables
  const colorInput = document.getElementById("myColor");
  var hexInput = document.getElementById("hexInput");
  var colorNameInput = document.getElementById("colorName"); //
  // Results variables
  const resultsContainer = document.getElementById("resultsContainer"); //
  const exportButton = document.getElementById("exportButton"); //
  // Button variables
  const incrementBy5Button = document.getElementById("incrementBy5"); //
  const incrementBy10Button = document.getElementById("incrementBy10"); //
  const toggleButton = document.getElementById("toggleButton"); //

  let colorRange = [];
  let increment = 10; // Default increment
  let isLightenMode = true; // Default to lightening colors
  let suffixLOrD = "";

  updateColorRange();
  hexInput.textContent = colorInput.value;
  colorNameInput.addEventListener("input", updateColorRange());
  console.log(colorInput.value);

  // Listen to the color input and automatically update on input change
  colorInput.addEventListener("input", () => {
    hexInput.textContent = colorInput.value;
    updateColorRange();
    console.log(colorInput.value);
  });

  // Listen to the color name input and automatically update on input change
  colorNameInput.addEventListener("input", () => {
    updateColorRange();
  });

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

        // Set color name in swatch div
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
        });

        // Set hex value in swatch div
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

  incrementBy5Button.addEventListener("click", () => {
    increment = 5;
    console.log("increment 5 button clicked");
    updateColorRange();
  });

  incrementBy10Button.addEventListener("click", () => {
    increment = 10;
    console.log("increment 10 button clicked");
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
    console.log("exported text");
  });
});
