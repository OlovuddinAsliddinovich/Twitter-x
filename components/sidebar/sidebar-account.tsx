import { IUSer } from "@/types";
import { signOut } from "next-auth/react";
import { RiLogoutCircleLine } from "react-icons/ri";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { MoreHorizontal } from "lucide-react";
import { Avatar, AvatarImage } from "../ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";

interface Props {
  user: IUSer;
}

const SidebarAccount = ({ user }: Props) => {
  console.log(user);
  return (
    <>
      {/* MOBILE SIDEBAR ACCOUNT */}
      <div className="lg:hidden block">
        <div
          className="mt-6 lg:hidden rounded-full h-14 w-14 p-4 flex items-center justify-center bg-red-500 hover:bg-opacity-80 transition cursor-pointer"
          onClick={() => signOut()}
        >
          <RiLogoutCircleLine size={24} color={"white"} />
        </div>
      </div>

      {/* DESKTOP SIDEBAR ACCOUNT */}
      <Popover>
        <PopoverTrigger className="w-full rounded-full hover:bg-slate-300 hidden lg:block cursor-pointer hover:bg-opacity-10 px-4 py-2 transition">
          <div className="flex items-center justify-between gap-2">
            <div className="flex gap-2 items-center">
              <Avatar className="flex items-center justify-center">
                <AvatarImage src={user.profileImage} />
                <AvatarFallback className="bg-orange-400 rounded-full p-2 px-[20px] text-2xl">{user.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start text-white">
                <p>{user.name.split(" ")[0]}</p>
                {user.username ? <p className="opacity-40">{user.username}</p> : <p className="opacity-40">Manage account</p>}
              </div>
            </div>
            <MoreHorizontal size={24} color="white" />
          </div>
        </PopoverTrigger>
        <PopoverContent className="bg-black border-none rounded-2xl shadow shadow-white px-0 mb-3">
          <div className="font-bold text-white cursor-pointer hover:bg-opacity-10 p-4 transition" onClick={() => signOut()}>
            Log out {user.username ? `@${user.username}` : user.name}
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default SidebarAccount;
