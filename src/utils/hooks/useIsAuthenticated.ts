import { useSession } from "next-auth/react";

const useIsAuthenticated = () => {
    const { data: session } = useSession();
    return !!session;
};

export default useIsAuthenticated;
