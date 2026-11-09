// React Theme — extracted from https://benkaluza.com
// Compatible with: Chakra UI, Stitches, Vanilla Extract, or any CSS-in-JS

/**
 * TypeScript type definition for this theme:
 *
 * interface Theme {
 *   colors: {
    primary: string;
    secondary: string;
    background: string;
    foreground: string;
    neutral50: string;
    neutral100: string;
    neutral200: string;
    neutral300: string;
    neutral400: string;
    neutral500: string;
    neutral600: string;
    neutral700: string;
    neutral800: string;
    neutral900: string;
 *   };
 *   fonts: {
    body: string;
    mono: string;
 *   };
 *   fontSizes: {
    '15': string;
    '16': string;
    '17': string;
    '92.16': string;
    '63.2158': string;
    '53.2': string;
    '48.64': string;
    '40.96': string;
    '35.84': string;
    '30.9': string;
    '25.6': string;
    '19.2': string;
 *   };
 *   space: {
    '2': string;
    '38': string;
    '51': string;
    '58': string;
    '71': string;
    '76': string;
    '90': string;
    '96': string;
    '101': string;
    '110': string;
    '154': string;
    '427': string;
    '444': string;
 *   };
 *   radii: {
    md: string;
 *   };
 *   shadows: {

 *   };
 *   states: {
 *     hover: { opacity: number };
 *     focus: { opacity: number };
 *     active: { opacity: number };
 *     disabled: { opacity: number };
 *   };
 * }
 */

export const theme = {
  "colors": {
    "primary": "#faf600",
    "secondary": "#b3261e",
    "background": "#0b0b0b",
    "foreground": "#000000",
    "neutral50": "#0b0b0b",
    "neutral100": "#f2f2f2",
    "neutral200": "#e2e2dd",
    "neutral300": "#8a8a85",
    "neutral400": "#cfcfca",
    "neutral500": "#000000",
    "neutral600": "#5e5e5a",
    "neutral700": "#6e6e6a",
    "neutral800": "#ffffff",
    "neutral900": "#bdbdb8"
  },
  "fonts": {
    "body": "'Archivo', sans-serif",
    "mono": "'Geist Mono', monospace"
  },
  "fontSizes": {
    "15": "15px",
    "16": "16px",
    "17": "17px",
    "92.16": "92.16px",
    "63.2158": "63.2158px",
    "53.2": "53.2px",
    "48.64": "48.64px",
    "40.96": "40.96px",
    "35.84": "35.84px",
    "30.9": "30.9px",
    "25.6": "25.6px",
    "19.2": "19.2px"
  },
  "space": {
    "2": "2px",
    "38": "38px",
    "51": "51px",
    "58": "58px",
    "71": "71px",
    "76": "76px",
    "90": "90px",
    "96": "96px",
    "101": "101px",
    "110": "110px",
    "154": "154px",
    "427": "427px",
    "444": "444px"
  },
  "radii": {
    "md": "10px"
  },
  "shadows": {},
  "states": {
    "hover": {
      "opacity": 0.08
    },
    "focus": {
      "opacity": 0.12
    },
    "active": {
      "opacity": 0.16
    },
    "disabled": {
      "opacity": 0.38
    }
  }
};

// MUI v5 theme
export const muiTheme = {
  "palette": {
    "primary": {
      "main": "#faf600",
      "light": "hsl(59, 100%, 64%)",
      "dark": "hsl(59, 100%, 34%)"
    },
    "secondary": {
      "main": "#b3261e",
      "light": "hsl(3, 71%, 56%)",
      "dark": "hsl(3, 71%, 26%)"
    },
    "background": {
      "default": "#0b0b0b",
      "paper": "#141413"
    },
    "text": {
      "primary": "#000000",
      "secondary": "#f2f2f2"
    }
  },
  "typography": {
    "fontFamily": "'Archivo', sans-serif",
    "h1": {
      "fontSize": "35.84px",
      "fontWeight": "800",
      "lineHeight": "32.256px"
    }
  },
  "shape": {
    "borderRadius": 6
  },
  "shadows": []
};

export default theme;
