import { useState, useEffect } from "react";

const useIsMobile = (width = 500) => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        function handleResize() {
            const isMobileDevice = window.innerWidth <= width;
            setIsMobile(isMobileDevice);
        }

        handleResize();

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [width]);

    return isMobile;
};

export default useIsMobile;
