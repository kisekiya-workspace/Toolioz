// Basic Basic CSS Color Names
const colorNames: { [key: string]: string } = {
    "AliceBlue": "#f0f8ff",
    "AntiqueWhite": "#faebd7",
    "Aqua": "#00ffff",
    "Aquamarine": "#7fffd4",
    "Azure": "#f0ffff",
    "Beige": "#f5f5dc",
    "Bisque": "#ffe4c4",
    "Black": "#000000",
    "BlanchedAlmond": "#ffebcd",
    "Blue": "#0000ff",
    "BlueViolet": "#8a2be2",
    "Brown": "#a52a2a",
    "BurlyWood": "#deb887",
    "CadetBlue": "#5f9ea0",
    "Chartreuse": "#7fff00",
    "Chocolate": "#d2691e",
    "Coral": "#ff7f50",
    "CornflowerBlue": "#6495ed",
    "Cornsilk": "#fff8dc",
    "Crimson": "#dc143c",
    "Cyan": "#00ffff",
    "DarkBlue": "#00008b",
    "DarkCyan": "#008b8b",
    "DarkGoldenRod": "#b8860b",
    "DarkGray": "#a9a9a9",
    "DarkGreen": "#006400",
    "DarkKhaki": "#bdb76b",
    "DarkMagenta": "#8b008b",
    "DarkOliveGreen": "#556b2f",
    "DarkOrange": "#ff8c00",
    "DarkOrchid": "#9932cc",
    "DarkRed": "#8b0000",
    "DarkSalmon": "#e9967a",
    "DarkSeaGreen": "#8fbc8f",
    "DarkSlateBlue": "#483d8b",
    "DarkSlateGray": "#2f4f4f",
    "DarkTurquoise": "#00ced1",
    "DarkViolet": "#9400d3",
    "DeepPink": "#ff1493",
    "DeepSkyBlue": "#00bfff",
    "DimGray": "#696969",
    "DodgerBlue": "#1e90ff",
    "FireBrick": "#b22222",
    "FloralWhite": "#fffaf0",
    "ForestGreen": "#228b22",
    "Fuchsia": "#ff00ff",
    "Gainsboro": "#dcdcdc",
    "GhostWhite": "#f8f8ff",
    "Gold": "#ffd700",
    "GoldenRod": "#daa520",
    "Gray": "#808080",
    "Green": "#008000",
    "GreenYellow": "#adff2f",
    "HoneyDew": "#f0fff0",
    "HotPink": "#ff69b4",
    "IndianRed": "#cd5c5c",
    "Indigo": "#4b0082",
    "Ivory": "#fffff0",
    "Khaki": "#f0e68c",
    "Lavender": "#e6e6fa",
    "LavenderBlush": "#fff0f5",
    "LawnGreen": "#7cfc00",
    "LemonChiffon": "#fffacd",
    "LightBlue": "#add8e6",
    "LightCoral": "#f08080",
    "LightCyan": "#e0ffff",
    "LightGoldenRodYellow": "#fafad2",
    "LightGray": "#d3d3d3",
    "LightGreen": "#90ee90",
    "LightPink": "#ffb6c1",
    "LightSalmon": "#ffa07a",
    "LightSeaGreen": "#20b2aa",
    "LightSkyBlue": "#87cefa",
    "LightSlateGray": "#778899",
    "LightSteelBlue": "#b0c4de",
    "LightYellow": "#ffffe0",
    "Lime": "#00ff00",
    "LimeGreen": "#32cd32",
    "Linen": "#faf0e6",
    "Magenta": "#ff00ff",
    "Maroon": "#800000",
    "MediumAquaMarine": "#66cdaa",
    "MediumBlue": "#0000cd",
    "MediumOrchid": "#ba55d3",
    "MediumPurple": "#9370db",
    "MediumSeaGreen": "#3cb371",
    "MediumSlateBlue": "#7b68ee",
    "MediumSpringGreen": "#00fa9a",
    "MediumTurquoise": "#48d1cc",
    "MediumVioletRed": "#c71585",
    "MidnightBlue": "#191970",
    "MintCream": "#f5fffa",
    "MistyRose": "#ffe4e1",
    "Moccasin": "#ffe4b5",
    "NavajoWhite": "#ffdead",
    "Navy": "#000080",
    "OldLace": "#fdf5e6",
    "Olive": "#808000",
    "OliveDrab": "#6b8e23",
    "Orange": "#ffa500",
    "OrangeRed": "#ff4500",
    "Orchid": "#da70d6",
    "PaleGoldenRod": "#eee8aa",
    "PaleGreen": "#98fb98",
    "PaleTurquoise": "#afeeee",
    "PaleVioletRed": "#db7093",
    "PapayaWhip": "#ffefd5",
    "PeachPuff": "#ffdab9",
    "Peru": "#cd853f",
    "Pink": "#ffc0cb",
    "Plum": "#dda0dd",
    "PowderBlue": "#b0e0e6",
    "Purple": "#800080",
    "RebeccaPurple": "#663399",
    "Red": "#ff0000",
    "RosyBrown": "#bc8f8f",
    "RoyalBlue": "#4169e1",
    "SaddleBrown": "#8b4513",
    "Salmon": "#fa8072",
    "SandyBrown": "#f4a460",
    "SeaGreen": "#2e8b57",
    "SeaShell": "#fff5ee",
    "Sienna": "#a0522d",
    "Silver": "#c0c0c0",
    "SkyBlue": "#87ceeb",
    "SlateBlue": "#6a5acd",
    "SlateGray": "#708090",
    "Snow": "#fffafa",
    "SpringGreen": "#00ff7f",
    "SteelBlue": "#4682b4",
    "Tan": "#d2b48c",
    "Teal": "#008080",
    "Thistle": "#d8bfd8",
    "Tomato": "#ff6347",
    "Turquoise": "#40e0d0",
    "Violet": "#ee82ee",
    "Wheat": "#f5deb3",
    "White": "#ffffff",
    "WhiteSmoke": "#f5f5f5",
    "Yellow": "#ffff00",
    "YellowGreen": "#9acd32"
};

// --- Conversion Functions ---

export const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return null;
    return {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    };
};

export const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

export const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // achromatic
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
};

export const rgbToCmyk = (r: number, g: number, b: number) => {
    const c = 1 - (r / 255);
    const m = 1 - (g / 255);
    const y = 1 - (b / 255);
    const k = Math.min(c, m, y);

    if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };

    return {
        c: Math.round(((c - k) / (1 - k)) * 100),
        m: Math.round(((m - k) / (1 - k)) * 100),
        y: Math.round(((y - k) / (1 - k)) * 100),
        k: Math.round(k * 100)
    };
};

// Find closest color name (Euclidean distance in RGB)
// Find closest color name (Euclidean distance in RGB)
export const getClosestColorName = (hex: string) => {
    const rgb = hexToRgb(hex);
    if (!rgb) return "Unknown";

    let minDistance = Infinity;
    let closestColor = "Unknown";

    Object.entries(colorNames).forEach(([name, nameHex]) => {
        const nameRgb = hexToRgb(nameHex);
        if (nameRgb) {
            const distance = Math.sqrt(
                Math.pow(rgb.r - nameRgb.r, 2) +
                Math.pow(rgb.g - nameRgb.g, 2) +
                Math.pow(rgb.b - nameRgb.b, 2)
            );
            if (distance < minDistance) {
                minDistance = distance;
                closestColor = name;
            }
        }
    });

    return closestColor;
};

export const getColorNameExact = (hex: string) => {
    const entry = Object.entries(colorNames).find(([_, h]) => h.toLowerCase() === hex.toLowerCase());
    return entry ? entry[0] : null;
};
