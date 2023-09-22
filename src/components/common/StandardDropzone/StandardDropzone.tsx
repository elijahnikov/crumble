import { useCallback, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import Button from "@/components/ui/Button/Button";

interface StandardDropzoneProps {
    children: React.ReactNode;
    to: "header" | "image";
}

const StandardDropzone = ({ children, to }: StandardDropzoneProps) => {
    const [presignedUrl, setPresignedUrl] = useState<string | null>(null);
    const { mutateAsync: fetchPresignedUrls } =
        api.s3.getStandardUploadPresignedUrl.useMutation({
            onSuccess: (file) => {
                console.log(file);
                console.log(file.split("?X-Amz-Algorithm"));
            },
        });
    const [submitDisabled, setSubmitDisabled] = useState(true);
    const apiUtils = api.useContext();
    const { data: session } = useSession();

    const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
        useDropzone({
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
                        setSubmitDisabled(false);
                        console.log(url);
                    })
                    .catch((err) => console.error(err));
            },
        });
    const files = useMemo(() => {
        if (!submitDisabled)
            return acceptedFiles.map((file) => (
                <li key={file.name}>{file.name}</li>
            ));
        return null;
    }, [acceptedFiles, submitDisabled]);

    const handleSubmit = useCallback(async () => {
        if (acceptedFiles.length > 0 && presignedUrl !== null) {
            // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
            const file = acceptedFiles[0] as File;
            await axios
                .put(presignedUrl, file.slice(), {
                    headers: { "Content-Type": file.type },
                })
                .then(() => {
                    console.log("Successfully uploaded ", file.name);
                    console.log(presignedUrl.split("?X-Amz-Algorithm"));
                })
                .catch((err) => console.error(err));
            setSubmitDisabled(true);
            await apiUtils.s3.getObjects.invalidate();
        }
    }, [acceptedFiles, apiUtils.s3.getObjects, presignedUrl]);

    return (
        <>
            <div {...getRootProps()}>
                <input {...getInputProps()} />
                {children}
            </div>
            {/* <aside className="my-2">
                <h4 className="font-semibold text-zinc-400">
                    Files pending upload
                </h4>
                <ul>{files}</ul>
            </aside> */}
            {/* {to === "image" && (
                <button
                    onClick={() => void handleSubmit()}
                    disabled={
                        presignedUrl === null ||
                        acceptedFiles.length === 0 ||
                        submitDisabled
                    }
                >
                    Upload
                </button>
            )} */}
        </>
    );
};

export default StandardDropzone;
