import { useRouter } from "next/router";

export const useGetURLParam = (param: string) => {
    const router = useRouter();

    return router.query[param] ?? null;
};
