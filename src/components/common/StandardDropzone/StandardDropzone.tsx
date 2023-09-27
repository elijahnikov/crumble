import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";

interface StandardDropzoneProps {
    children: React.ReactNode;
    to: "header" | "image";
    callback: (from: "header" | "image", url: string) => void;
}

const StandardDropzone = ({
    children,
    to,
    callback,
}: StandardDropzoneProps) => {
    const { data: session } = useSession();
    const [presignedUrl, setPresignedUrl] = useState<string | null>(null);
    const { mutateAsync: fetchPresignedUrls } =
        api.s3.getStandardUploadPresignedUrl.useMutation();
    const apiUtils = api.useContext();

    const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
        maxFiles: 1,
        maxSize: 5 * 2 ** 30, // roughly 5GB
        multiple: false,
        onDropAccepted: (files, _event) => {
            const file = files[0] as File;

            fetchPresignedUrls({
                key: file.name,
                userId: session!.user.id,
            })
                .then((url) => {
                    setPresignedUrl(url);
                })
                .catch((err) => console.error(err));
        },
    });

    const handleSubmit = useCallback(async () => {
        if (acceptedFiles.length > 0 && presignedUrl !== null) {
            // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
            const file = acceptedFiles[0] as File;
            await axios
                .put(presignedUrl, file, {
                    headers: { "Content-Type": file.type },
                })
                .then(() => {
                    callback(to, presignedUrl.split("?X-Amz-Algorithm")[0]!);
                })
                .catch((err) => console.error(err));
            await apiUtils.s3.getObjects.invalidate();
        }
    }, [acceptedFiles, apiUtils.s3.getObjects, callback, presignedUrl, to]);

    useEffect(() => {
        if (presignedUrl !== null) void handleSubmit();
    }, [handleSubmit, presignedUrl]);

    return (
        <>
            <div {...getRootProps()}>
                <input {...getInputProps()} />
                {children}
            </div>
        </>
    );
};

export default StandardDropzone;
