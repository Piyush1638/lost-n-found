import React from "react";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { UserButton, auth } from "@clerk/nextjs";
import MobileMenu from "../shadcn/MobileMenu";
import { GiLinkedRings } from "react-icons/gi";
import { ModeToggle } from "../ModeToggle";


const Navbar = () => {
  const { userId } = auth();
  return (
    <nav className="w-full p-3 bg-transparent">
      <div className="flex items-center justify-between px-3 py-2">
        <Link href="/" className="flex items-center gap-1">
          <GiLinkedRings className="text-2xl text-purple-600"/>
          <h1 className="text-xl font-montserrat font-semibold text-purple-600">
            LostLink
          </h1>
        </Link>
        {userId ? (
          <>
            <div className="flex items-center justify-center gap-3">
              <div className="tablet:flex hidden items-center justify-center gap-6">
                <Link href="/" className="font-poppins font-medium hover:scale-[1.05]">
                  Home
                </Link>
                <Link href="/explore" className="font-poppins font-medium hover:scale-[1.05]">
                  Explore
                </Link>
                <Link href="/list-item" className="font-poppins font-medium hover:scale-[1.05]">
                  List-Item
                </Link>
                <Link href={`/profile/${userId}`} className="font-poppins font-medium hover:scale-[1.05]">
                  Profile
                </Link>
                {/* <ModeToggle/> */}
              </div>
              <div className="p-1 bg-purple-600 rounded-full">
                <UserButton afterSignOutUrl="/" />
              </div>
              <MobileMenu />
            </div>
          </>
        ) : (
          <Link
            href="/sign-in"
            className="bg-purple-600 text-white px-3 py-2 rounded-xl"
          >
            Get Started
          </Link>
        )}
      </div>
      <Separator />
    </nav>
  );
};

export default Navbar;
