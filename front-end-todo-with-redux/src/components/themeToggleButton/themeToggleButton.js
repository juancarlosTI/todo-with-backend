// Imports
import { useContext } from "react";
import { ThemeContext, themes } from "../contexts/toggleButtonContext";


export const ThemeTogglerButton = () => {

    // Context
    const { theme, setTheme } = useContext(ThemeContext);

    return <img className="icon-toggle" src={theme.image_toggle} alt="icon-toggle" onClick={() => setTheme(theme === themes.dark ? themes.light : themes.dark)}/>
}
