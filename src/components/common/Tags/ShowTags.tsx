import React from "react";

interface TagsProps {
    tags: string;
}

const ShowTags = ({ tags }: TagsProps) => {
    return (
        <div className="float-left mt-[2vh] flex">
            {tags.split(",").map((tag) => (
                <p
                    className="m-1 cursor-pointer rounded-lg border-[1px] border-slate-300 bg-none p-[4px] text-xs dark:border-slate-700 dark:text-white"
                    key={tag}
                >
                    {tag}
                </p>
            ))}
        </div>
    );
};

export default ShowTags;
