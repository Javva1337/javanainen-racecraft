/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
    colors: {
        primary: {
            '50': 'hsl(59, 100%, 97%)',
            '100': 'hsl(59, 100%, 94%)',
            '200': 'hsl(59, 100%, 86%)',
            '300': 'hsl(59, 100%, 76%)',
            '400': 'hsl(59, 100%, 64%)',
            '500': 'hsl(59, 100%, 50%)',
            '600': 'hsl(59, 100%, 40%)',
            '700': 'hsl(59, 100%, 32%)',
            '800': 'hsl(59, 100%, 24%)',
            '900': 'hsl(59, 100%, 16%)',
            '950': 'hsl(59, 100%, 10%)',
            DEFAULT: '#faf600'
        },
        secondary: {
            '50': 'hsl(3, 71%, 97%)',
            '100': 'hsl(3, 71%, 94%)',
            '200': 'hsl(3, 71%, 86%)',
            '300': 'hsl(3, 71%, 76%)',
            '400': 'hsl(3, 71%, 64%)',
            '500': 'hsl(3, 71%, 50%)',
            '600': 'hsl(3, 71%, 40%)',
            '700': 'hsl(3, 71%, 32%)',
            '800': 'hsl(3, 71%, 24%)',
            '900': 'hsl(3, 71%, 16%)',
            '950': 'hsl(3, 71%, 10%)',
            DEFAULT: '#b3261e'
        },
        'neutral-50': '#0b0b0b',
        'neutral-100': '#f2f2f2',
        'neutral-200': '#e2e2dd',
        'neutral-300': '#8a8a85',
        'neutral-400': '#cfcfca',
        'neutral-500': '#000000',
        'neutral-600': '#5e5e5a',
        'neutral-700': '#6e6e6a',
        'neutral-800': '#ffffff',
        'neutral-900': '#bdbdb8',
        background: '#0b0b0b',
        foreground: '#000000'
    },
    fontFamily: {
        sans: [
            'Archivo',
            'sans-serif'
        ],
        font1: [
            'Geist',
            'sans-serif'
        ],
        mono: [
            'Geist Mono',
            'sans-serif'
        ]
    },
    fontSize: {
        '12': [
            '12px',
            {
                lineHeight: '18px'
            }
        ],
        '13': [
            '13px',
            {
                lineHeight: 'normal'
            }
        ],
        '14': [
            '14px',
            {
                lineHeight: 'normal'
            }
        ],
        '15': [
            '15px',
            {
                lineHeight: '21.75px'
            }
        ],
        '16': [
            '16px',
            {
                lineHeight: 'normal'
            }
        ],
        '17': [
            '17px',
            {
                lineHeight: '25.5px'
            }
        ],
        '92.16': [
            '92.16px',
            {
                lineHeight: '79.2576px',
                letterSpacing: '-1.3824px'
            }
        ],
        '63.2158': [
            '63.2158px',
            {
                lineHeight: '54.3656px',
                letterSpacing: '-0.948237px'
            }
        ],
        '53.2': [
            '53.2px',
            {
                lineHeight: '47.88px',
                letterSpacing: '-0.532px'
            }
        ],
        '48.64': [
            '48.64px',
            {
                lineHeight: '44.7488px',
                letterSpacing: '-0.2432px'
            }
        ],
        '40.96': [
            '40.96px',
            {
                lineHeight: '38.912px',
                letterSpacing: '-0.8192px'
            }
        ],
        '35.84': [
            '35.84px',
            {
                lineHeight: '32.256px',
                letterSpacing: '-0.3584px'
            }
        ],
        '30.9': [
            '30.9px',
            {
                lineHeight: '27.81px',
                letterSpacing: '0.309px'
            }
        ],
        '25.6': [
            '25.6px',
            {
                lineHeight: '24.32px',
                letterSpacing: '-0.128px'
            }
        ],
        '19.2': [
            '19.2px',
            {
                lineHeight: '27.84px'
            }
        ]
    },
    spacing: {
        '1': '2px',
        '19': '38px',
        '29': '58px',
        '38': '76px',
        '45': '90px',
        '48': '96px',
        '55': '110px',
        '77': '154px',
        '222': '444px',
        '51px': '51px',
        '71px': '71px',
        '101px': '101px',
        '427px': '427px'
    },
    borderRadius: {
        md: '10px'
    },
    screens: {
        md: '780px'
    },
    transitionDuration: {
        '200': '0.2s',
        '250': '0.25s',
        '300': '0.3s',
        '400': '0.4s',
        '450': '0.45s',
        '1000': '1s'
    },
    transitionTimingFunction: {
        custom: 'cubic-bezier(0.2, 0.7, 0.2, 1)'
    },
    container: {
        center: true,
        padding: '8px'
    },
    maxWidth: {
        container: '100%'
    }
},
  },
};
