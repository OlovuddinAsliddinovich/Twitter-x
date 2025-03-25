import { IUSer } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { sliceText } from "@/lib/utils";

const User = ({ user }: { user: IUSer }) => {
  return (
    <div className="flex gap-3 items-center justify-between hover:bg-slate-300 hover:bg-opacity-10 p-2 rounded-md cursor-pointer transition px-3">
      <div className="flex gap-2 cursor-pointer">
        <Avatar>
          <AvatarImage src={`${user.profileImage}`} />
          <AvatarFallback className="bg-blue-950">{user.name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <p className="text-white font-semibold text-sm line-camp-1">{user.name}</p>
          <p className="text-neutral-400 text-sm line-clamp-1">
            {user?.username ? sliceText(user.username, 16) : user?.email ? sliceText(user.email, 16) : ""}
          </p>
        </div>
      </div>
    </div>
  );
};

export default User;
