import Link from "next/link";
import Image from "next/image";

const NavigationBar = () => {
  return (
    <div className="fixed z-10 flex min-h-[5vh] w-full border-b-[1px] bg-white text-center text-black dark:border-gray-800 dark:bg-black dark:text-white">
      <div className="align-center ml-[10px] inline-flex w-full min-w-[80%] items-center ">
        <Link href={"/"} className="align-center ml-[10px] flex items-center">
          <Image
            alt="Supercrumble logo"
            width={60}
            height={60}
            src="https://i.ibb.co/r4WtSVc/supercrumble800x800.png"
          />
          <h4 className="ml-[10px]">Crumble</h4>
        </Link>
      </div>
      <div className="mx-0 flex w-[10vw] min-w-[10vw] items-center justify-center text-center">
        {/* <DarkModeSwitch />
        <div className="ml-2">
          <a href="https://github.com/elijahnikov/ui">
            <AiFillGithub className="float-right ml-2 h-6 w-6 fill-slate-700 dark:fill-white" />
          </a>
        </div> */}
      </div>
    </div>
  );
};

export default NavigationBar;
