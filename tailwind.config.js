import withMT from '@material-tailwind/react/utils/withMT'

/** @type {import('tailwindcss').Config} */
export default withMT({
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                greyBg: '#F4F4F4',
                darkGrey: '#444446',
                lightPink: '#FFC2C3',
                coral: '#FE7773',
                redRose: '#8E1E25',
                blackberry: '#0E0301',
            },
            fontFamily: {
                lobster: ['Lobster', 'sans-serif'],
                kalnia: ['Kalnia Glaze', 'serif'],
                roboto: ['Roboto', 'sans-serif'],
                greatVibes: ['Great Vibes', 'cursive'],
            },
        },
    },
    plugins: [],
})

// /** @type {import('tailwindcss').Config} */
// export default {
//     content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
//     theme: {
//         extend: {
//             colors: {
//                 greyBg: '#F4F4F4',
//                 darkGrey: '#444446',
//                 lightPink: '#FFC2C3',
//                 coral: '#FE7773',
//                 redRose: '#8E1E25',
//                 blackberry: '#0E0301',
//             },
//             fontFamily: {
//                 lobster: ['Lobster', 'sans-serif'],
//                 kalnia: ['Kalnia Glaze', 'serif'],
//                 roboto: ['Roboto', 'sans-serif'],
//                 greatVibes: ['Great Vibes', 'cursive'],
//             },
//         },
//     },
//     plugins: [],
// }
