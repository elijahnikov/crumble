import Button from "@/components/ui/Button/Button";
import { type RouterOutputs } from "@/utils/api";
import Link from "next/link";

interface PrivacyTabProps {
    user: NonNullable<RouterOutputs["user"]["getUser"]>;
}

const PrivacyTab = ({ user }: PrivacyTabProps) => {
    return (
        <>
            <div className="flex">
                <h2 className="w-[80%]">Profile</h2>
                <Link href="/[username]/profile" as={`/@${user.name}/profile`}>
                    <Button className="mt-[5px]" size="sm" intent={"secondary"}>
                        Back to profile
                    </Button>
                </Link>
            </div>
            <div className="mt-[20px]">
                <p className="pb-2 text-sm">
                    Change what others can see in your recent activity
                </p>
            </div>
        </>
    );
};

export default PrivacyTab;
