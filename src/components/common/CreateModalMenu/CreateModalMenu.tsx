import { Menu, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { BiCommentDetail } from "react-icons/bi";
import { BsCardList, BsPlus } from "react-icons/bs";
import CreateListModal from "../CreateListModal/CreateListModal";
import CreateReviewModal from "../CreateReviewModal/CreateReviewModal";
import clxsm from "@/utils/clsxm";

const CreateModalMenu = () => {
    const [reviewOpen, setReviewOpen] = useState<boolean>(false);
    const [listOpen, setListOpen] = useState<boolean>(false);

    return (
        <>
            <Menu as="div">
                <Menu.Button>
                    <div
                        className={clxsm([
                            "inline-flex items-center justify-center rounded-lg font-medium",
                            "focus-visible:ring-crumble-500 focus:outline-none focus-visible:ring",
                            "shadow-sm",
                            "transition-colors duration-75",
                            "bg-crumble-base text-white",
                            "hover:bg-crumble-dark active:bg-crumble-darker",
                            "px-2 py-1 text-sm md:text-base",
                        ])}
                    >
                        Add
                        <BsPlus />
                    </div>
                </Menu.Button>
                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <Menu.Items className="right absolute bottom-[130px] left-[30px]  mt-2 w-40 divide-y divide-gray-700 rounded-md bg-brand ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="px-1 py-1 ">
                            <Menu.Item>
                                <button
                                    onClick={() => {
                                        setReviewOpen(!reviewOpen);
                                    }}
                                    className={`group flex w-[100%] items-center rounded-md px-2 py-2 text-sm text-gray-200 hover:bg-brand-light`}
                                >
                                    <BiCommentDetail className={`mr-2 `} />
                                    Movie Log
                                </button>
                            </Menu.Item>
                            <Menu.Item>
                                <button
                                    className={`group flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-200 hover:bg-brand-light`}
                                    onClick={() => {
                                        setListOpen(!listOpen);
                                    }}
                                >
                                    <BsCardList className={`mr-2 `} />
                                    List
                                </button>
                            </Menu.Item>
                        </div>
                    </Menu.Items>
                </Transition>
            </Menu>
            <CreateReviewModal
                fromMenu={true}
                open={reviewOpen}
                setOpen={setReviewOpen}
            />
            <CreateListModal
                fromMenu={true}
                open={listOpen}
                setOpen={setListOpen}
            />
        </>
    );
};

export default CreateModalMenu;
