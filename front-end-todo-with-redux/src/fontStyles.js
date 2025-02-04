import { createGlobalStyle } from "styled-components";
import UbuntuBold from './assets/fonts/Ubuntu-Bold.ttf';
import UbuntuRegular from './assets/fonts/Ubuntu-Regular.ttf';
import Ubuntu from './assets/fonts/Ubuntu-Medium.ttf';


const FontStyles = createGlobalStyle`
    @font-face {
        font-family:'Ubuntu Regular';
        src: url(${UbuntuRegular}) format('truetype');
    }

    @font-face {
        font-family:'Ubuntu';
        src: url(${Ubuntu}) format('truetype');
    }

    @font-face {
        font-family:'Ubuntu Bold';
        src: url(${UbuntuBold}) format('truetype');
    }
`

export default FontStyles;