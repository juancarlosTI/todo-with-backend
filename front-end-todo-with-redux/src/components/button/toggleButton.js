// Imports
import { useContext } from "react";
import { ThemeContext, themes } from "../contexts/toggleButtonContext";

// Images
import darkIcon from '../../assets/Icons/dark_mode.svg';
import lightIcon from '../../assets/Icons/light_mode.svg';


export const Button = (props) => {

    const { theme, setTheme } = useContext(ThemeContext);

    return (

        <img className="icon-toggle" src={theme.src} alt="icon-toggle" onClick={(theme) => theme.dark ? setTheme(themes.light): setTheme(themes.dark)}/>

    )
}