import { fontFamily } from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",

        // Or if using `src` directory:
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            fontFamily: {
                primary: ["Inter", ...fontFamily.sans],
            },
            colors: {
                brand: { DEFAULT: "#0a0a0a", light: "#212121" },
                primary: {
                    lightest: "#E7E7FF",
                    lighter: "#C6C4FF",
                    light: "#9990FF",
                    base: "#6B4EFF",
                    dark: "#5538EE",
                    darker: "#4830c2",
                },
                sky: {
                    lightest: "#F7F9FA",
                    lighter: "#F2F4F5",
                    light: "#E3E5E5",
                    base: "#CDCFD0",
                    dark: "#979C9E",
                },
                ink: {
                    lighter: "#72777A",
                    light: "#6C7072",
                    base: "#404446",
                    dark: "#303437",
                    darker: "#202325",
                    darkest: "#090A0A",
                },
                crumble: {
                    DEFAULT: "#EF4444",
                    lightest: "#F9B5B5",
                    lighter: "#F58F8F",
                    light: "#F26A6A",
                    base: "#EF4444",
                    dark: "#E71414",
                    darker: "#B30F0F",
                    darkest: "#800B0B",
                },
            },
            borderRadius: {
                md: "0.25rem",
            },
            boxShadow: {
                button: "0 0.0625rem 0 rgba(0,0,0,.05)",
            },
            keyframes: {
                slideDown: {
                    from: { height: 0 },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                slideUp: {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: 0 },
                },
            },
            animation: {
                slideDown: "slideDown 300ms cubic-bezier(0.87, 0, 0.13, 1)",
                slideUp: "slideUp 300ms cubic-bezier(0.87, 0, 0.13, 1)",
            },
        },
    },
    plugins: [],
};
