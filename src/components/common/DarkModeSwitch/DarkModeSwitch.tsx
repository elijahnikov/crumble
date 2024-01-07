// Next
import { useTheme } from "next-themes";

// React
import { useEffect, useState } from "react";

// ReactIcons
import { BsFillSunFill, BsMoonFill } from "react-icons/bs";

const DarkModeSwitch = () => {
    const { theme, setTheme } = useTheme();
    const [isDark, setIsDark] = useState<boolean>(theme === "dark");
    useEffect(() => {
        setIsDark(theme === "dark");
    }, [theme]);

    return (
        <div
            className="ml-2 cursor-pointer rounded-md p-2"
            onClick={() => {
                setTheme(theme === "light" ? "dark" : "light");
            }}
        >
            {!isDark ? (
                <BsMoonFill className="fill-black" />
            ) : (
                <BsFillSunFill className="fill-white" />
            )}
        </div>
    );
};

export default DarkModeSwitch;
