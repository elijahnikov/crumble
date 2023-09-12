const ProfileTab = () => {
    return (
        <div className="w-full">
            <div className="flex">
                <div className="w-[70%] px-4 pt-2">
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                        Favourite films
                    </p>
                    <div className="border-b pt-1 dark:border-slate-500" />
                    <p className="pt-1 text-sm font-normal">
                        Showcase your favourite films here...
                        <span className="pl-1 text-crumble underline">
                            Settings
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ProfileTab;
