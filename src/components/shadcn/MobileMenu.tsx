import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { RxHamburgerMenu } from "react-icons/rx";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { GiLinkedRings } from "react-icons/gi";

const MobileMenu = () => {
  return (
    <Sheet>
      <SheetTrigger className="tablet:hidden block">
        <RxHamburgerMenu className="text-2xl" />
      </SheetTrigger>
      <SheetContent>
        <SheetHeader className="flex items-start">
          <SheetTitle className="flex items-center justify-center gap-1 text-purple-600">
            <GiLinkedRings className="text-2xl" />
            LostLink
          </SheetTitle>
          <Separator />
          <SheetDescription className="flex flex-col items-start gap-3 py-3">
            <Link href="/" className="font-poppins font-medium text-base">
              Home
            </Link>
            <Link
              href="/explore"
              className="font-poppins font-medium text-base"
            >
              Explore
            </Link>
            <Link
              href="/list-item"
              className="font-poppins font-medium text-base"
            >
              List-Item
            </Link>
            <Link
              href="/profile"
              className="font-poppins font-medium text-base"
            >
              Profile
            </Link>
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
