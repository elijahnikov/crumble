import Input from "@/components/ui/Input/Input";
import type { SetStateType } from "@/utils/types/helpers";
import { useEffect, useState } from "react";
import { BiX } from "react-icons/bi";

interface TagsProps {
    tags: string[];
    setTags: SetStateType<string[]>;
    reviewStarted: boolean;
    placeholder: string;
}

const InputTags = ({
    tags,
    setTags,
    reviewStarted,
    placeholder,
}: TagsProps) => {
    const [tag, setTag] = useState<string>("");
    const [disabled, setDisabled] = useState<boolean>(false);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
        if (event.key === "Enter") {
            if (
                !tags.includes(tag) &&
                tags.length < 4 &&
                tag !== "" &&
                tag.length < 10
            ) {
                setTags([...tags, tag]);
                setTag("");
            } else {
                setTag("");
            }
        }
    };

    useEffect(() => {
        if (tags.length >= 4) setDisabled(true);
        else setDisabled(false);
    }, [tags]);

    const removeTag = (tag: string) => {
        setTags(tags.filter((item) => item !== tag));
    };

    return (
        <div className="w-[250px]">
            <p className="mb-2 text-sm">Tags</p>
            <div>
                <Input
                    value={tag}
                    disabled={disabled || !reviewStarted}
                    placeholder={placeholder}
                    type="text"
                    onKeyDown={handleKeyDown}
                    change={setTag}
                />
            </div>
            <div className="mt-2 flex flex-wrap">
                {tags.map((item, index) => (
                    <div
                        key={index}
                        className="mr-1 mt-1 flex cursor-pointer rounded-lg border-[1px] border-ink-darker bg-ink-darkest p-2"
                        onClick={() => removeTag(item)}
                    >
                        <p className="flex text-xs">{item}</p>
                        <BiX className="ml-1 inline fill-crumble" />
                    </div>
                ))}
            </div>
        </div>
    );
};
export default InputTags;
