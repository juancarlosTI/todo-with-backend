// Imports
import { createContext, useState } from "react";

// Images
import darkIcon from '../../assets/Icons/dark_mode.svg';
import lightIcon from '../../assets/Icons/light_mode.svg';
import darkHeader from '../../assets/images/bg-desktop-dark.jpg';
import lightHeader from '../../assets/images/bg-desktop-light.jpg';

export const themes = {
    light: {
        color: '#454444',
        list_color:'#FFFFFF',
        background:'#FAFAFA',
        image_header: lightHeader,
        image_toggle: darkIcon,
        border_color:'#d1d2d6',
        bottom_filter:'#d1d2d6',
        bottom_active:'#78a0f8',
        bottom_hover:'#454444',
        box_shadow:'0px 100px 45px rgba(0, 0, 0, 0.1);'
    },
    
    dark: {
        color:'#d1d2d6',
        list_color:'#292b3d',
        background: '#101221',
        image_header:darkHeader,
        image_toggle: lightIcon,
        border_color:'#3f3e3e',
        bottom_filter: '#4e505b',
        bottom_active: '#78a0f8',
        bottom_hover:'#d1d2d6',
        box_shadow: '0px 0px 45px rgba(0, 0, 0, 0.3);'
    }
}

export const ThemeContext = createContext({});

export const ThemeProvider = (props) => {
    const [theme,setTheme] = useState(themes.dark);

    return (
        <ThemeContext.Provider value={{theme, setTheme}}>
            {props.children}
        </ThemeContext.Provider>
    )
}