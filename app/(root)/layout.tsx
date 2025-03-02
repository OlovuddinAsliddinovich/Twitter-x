import AuthPage from "@/components/auth";
import { authOptions } from "@/lib/auth-options";
import { getServerSession } from "next-auth";
import React, { ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import NextTopLoader from "nextjs-toploader";
import Sidebar from "@/components/sidebar/sidebar";
import FollowBar from "@/components/shared/follow-bar";
interface Props {
  children: ReactNode;
}
const Layout = async ({ children }: Props) => {
  const session: any = await getServerSession(authOptions);
  if (!session) {
    return (
      <div className="container max-w-7xl h-screen mx-auto px-4">
        <AuthPage />
      </div>
    );
  }
  return (
    <div className="lg:container h-screen mx-auto lg:max-w-7xl">
      <div className="flex">
        <Sidebar user={session} />
        <div className="flex flex-1 border-x-[1px] border-neutral-800 lg:mx-4 ml-1">
          <div className="w-full">
            <NextTopLoader
              color="#2299dd"
              initialPosition={0.08}
              crawlSpeed={200}
              height={3}
              crawl={true}
              showSpinner={false}
              easing="ease"
              speed={200}
              shadow={"0 0 10px #2299dd, 0 0 5px #2299dd"}
            />
            {children}
            <Toaster />
          </div>
        </div>
        <FollowBar />
      </div>
    </div>
  );
};

export default Layout;
