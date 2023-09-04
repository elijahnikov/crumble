import clxsm from "@/utils/clsxm";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { BsThreeDots } from "react-icons/bs";

const ActionPopover = ({
    listAuthorId,
    currentUserId,
    deleteList,
    listId,
}: {
    listAuthorId: string;
    currentUserId: string | undefined;
    listId: string;
    deleteList: (variables: { id: string }) => void;
}) => {
    const matchingUserId = listAuthorId === currentUserId;

    const handleDeleteList = () => {
        deleteList({ id: listId });
    };
    return (
        <Menu as="div" className="relative ml-3">
            <div>
                <Menu.Button className="flex rounded-full focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                    <div>
                        <BsThreeDots className="mr-1 mt-1 fill-slate-700 dark:fill-slate-300" />
                    </div>
                </Menu.Button>
            </div>
            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md border-[1px] bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:border-gray-800 dark:bg-brand">
                    {!matchingUserId && (
                        <Menu.Item>
                            <div className="block px-4 py-2 text-sm font-medium text-gray-900 dark:text-white">
                                Report
                            </div>
                        </Menu.Item>
                    )}

                    {matchingUserId && (
                        <Menu.Item>
                            {({ active }) => (
                                <div
                                    onClick={handleDeleteList}
                                    className={clxsm(
                                        active ? "bg-brand-light" : "",
                                        "flex cursor-pointer px-4 py-2 text-sm text-crumble dark:text-crumble"
                                    )}
                                >
                                    Delete
                                </div>
                            )}
                        </Menu.Item>
                    )}
                </Menu.Items>
            </Transition>
        </Menu>
    );
};

export default ActionPopover;
