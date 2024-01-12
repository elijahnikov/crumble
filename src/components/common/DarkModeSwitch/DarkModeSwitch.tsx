// Next
import { useTheme } from "next-themes";

// React
import { useEffect, useState } from "react";

import { Moon, Sun } from "lucide-react";

const DarkModeSwitch = () => {
    const { theme, setTheme } = useTheme();
    const [isDark, setIsDark] = useState<boolean>(theme === "dark");
    useEffect(() => {
        setIsDark(theme === "dark");
    }, [theme]);

    return (
        <button
            className="rounded-lg p-1.5 text-stone-700 transition-all duration-150 ease-in-out hover:bg-slate-100 active:bg-slate-200 dark:text-white dark:hover:bg-slate-700 dark:active:bg-slate-800"
            onClick={() => {
                setTheme(theme === "light" ? "dark" : "light");
            }}
        >
            {!isDark ? (
                <Moon width={18} className="fill-slate-700" />
            ) : (
                <Sun width={18} className="fill-white" />
            )}
        </button>
    );
};

export default DarkModeSwitch;
