import { useCallback, useEffect } from "react";

export default function useKeyPress(key: string, execute: () => void) {
    const executeFunction = useCallback(
        (event: KeyboardEvent) => {
            if (event.key === key) {
                execute();
            }
        },
        [execute, key]
    );

    useEffect(() => {
        document.addEventListener("keydown", executeFunction, false);

        return () => {
            document.removeEventListener("keydown", executeFunction, false);
        };
    }, [executeFunction]);
}
