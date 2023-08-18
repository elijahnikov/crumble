import React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { BsX } from "react-icons/bs";
import clxsm from "@/utils/clsxm";

interface ModalProps {
    children: React.ReactNode;
}

const Modal = ({
    children,
    ...props
}: ModalProps & DialogPrimitive.DialogProps) => {
    return <DialogPrimitive.Root {...props}>{children}</DialogPrimitive.Root>;
};

const Trigger = ({ children }: { children: React.ReactNode }) => {
    return (
        <DialogPrimitive.Trigger
            className={clxsm([
                "inline-flex items-center justify-center rounded-lg font-medium",
                "focus-visible:ring-crumble-500 focus:outline-none focus-visible:ring",
                "shadow-sm",
                "transition-colors duration-75",
                "bg-crumble-base text-white",
                "hover:bg-crumble-dark active:bg-crumble-darker",
                "px-3 py-1.5 text-sm md:text-base",
            ])}
        >
            {children}
        </DialogPrimitive.Trigger>
    );
};

const Content = ({
    children,
    title,
    ...props
}: {
    children: React.ReactNode;
    title?: string;
} & DialogPrimitive.DialogPortalProps) => {
    return (
        <DialogPrimitive.Portal {...props}>
            <DialogPrimitive.Overlay className="bg-background/80 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:fade-in fixed inset-0 z-10 backdrop-blur-md transition-all duration-100" />
            <DialogPrimitive.Content
                className={clxsm(
                    "w-[50vw] min-w-[50vw] max-w-[50vw]",
                    "animate-in data-[state=open]:fade-in-90 data-[state=open]:slide-in-from-bottom-10 data-[state=open]:sm:slide-in-from-bottom-0 fixed left-[50%] top-[50%] z-20 max-h-[85vh] translate-x-[-50%] translate-y-[-50%] rounded-[6px] border-[1px] border-gray-300 bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none dark:border-brand-light dark:bg-brand"
                )}
            >
                <h4 className="absolute left-[20px] top-[20px]  inline-flex text-crumble">
                    {title}
                </h4>
                <div className="mt-[40px]">{children}</div>
                <DialogPrimitive.Close asChild>
                    <button
                        className="focus-none text-violet11 hover:bg-violet4 absolute right-[10px] top-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full"
                        aria-label="Close"
                    >
                        <BsX className="h-5 w-5" />
                    </button>
                </DialogPrimitive.Close>
            </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
    );
};

const Title = ({
    children,
    ...props
}: { children: React.ReactNode } & DialogPrimitive.DialogTitleProps) => {
    return (
        <DialogPrimitive.Title
            {...props}
            className="text-mauve12 m-0 mb-5 text-[17px] font-medium"
        >
            {children}
        </DialogPrimitive.Title>
    );
};

const Close = ({
    children,
    ...props
}: { children: React.ReactNode } & DialogPrimitive.DialogCloseProps) => {
    return (
        <DialogPrimitive.Close
            {...props}
            asChild
            className="focus-none float-right mx-2 mt-5 outline-none"
        >
            {children}
        </DialogPrimitive.Close>
    );
};

Modal.Trigger = Trigger;
Modal.Content = Content;
Modal.Title = Title;
Modal.Close = Close;

export default Modal;
