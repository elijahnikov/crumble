import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

const LogoutButton = () => {
    return (
        <button
            onClick={() => void signOut()}
            className="rounded-lg p-1.5 text-stone-700 transition-all duration-150 ease-in-out hover:bg-slate-100 active:bg-slate-200 dark:text-white dark:hover:bg-slate-700 dark:active:bg-slate-800"
        >
            <LogOut width={18} />
        </button>
    );
};

export default LogoutButton;
