import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

export default function Navbar() {
  return (
    <header className="flex h-16 w-full shrink-0 items-center px-4 md:px-6 fixed bg-stone-900 z-20">
      <div className="lg:mx-20 font-bold text-white text-2xl bg-stone-900">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              size="icon"
              className="lg:hidden bg-purple-400 hover:bg-purple-500"
            >
              <MenuIcon className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="bg-stone-900 bg-opacity-50 text-white"
          >
            <SheetTitle className="sr-only" />
            <Link
              href={"/#home"}
              className="mr-6 hidden lg:flex"
              prefetch={false}
            >
              <MountainIcon className="h-6 w-6" />
              <span className="sr-only">Acme Inc</span>
            </Link>
            <div className="grid gap-2 py-6 ">
              <Link
                href={"/#home"}
                className="flex w-full items-center py-2 text-lg font-semibold hover:text-purple-400"
                prefetch={false}
              >
                Home
              </Link>
              <Link
                href={"/#services"}
                className="flex w-full items-center py-2 text-lg font-semibold hover:text-purple-400"
                prefetch={false}
              >
                Services
              </Link>
              <Link
                href={"/#workflow"}
                className="flex w-full items-center py-2 text-lg font-semibold hover:text-purple-400"
                prefetch={false}
              >
                Workflow
              </Link>
              <Link
                href={"/#technology"}
                className="flex w-full items-center py-2 text-lg font-semibold hover:text-purple-400"
                prefetch={false}
              >
                Technology
              </Link>
              <Link
                href={"/#ourteam"}
                className="flex w-full items-center py-2 text-lg font-semibold hover:text-purple-400"
                prefetch={false}
              >
                Our Team
              </Link>
              <Link
                href={"/#testimonials"}
                className="flex w-full items-center py-2 text-lg font-semibold hover:text-purple-400"
                prefetch={false}
              >
                Testimonials
              </Link>
            </div>
          </SheetContent>
        </Sheet>
        <Link href={"/#"} className="mr-6 hidden lg:flex" prefetch={false}>
          <MountainIcon className="h-6 w-6" />
          <span className="sr-only">Acme Inc</span>
        </Link>
      </div>

      <nav className="ml-auto hidden lg:flex gap-2 mr-10">
        <Link
          href={"/#home"}
          className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-none px-4 py-2 text-sm font-extrabold transition-colors text-white hover:text-purple-400 "
          prefetch={false}
        >
          Home
        </Link>
        <Link
          href={"/#services"}
          className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-none px-4 py-2 text-sm font-extrabold transition-colors text-white hover:text-purple-400 "
          prefetch={false}
        >
          Services
        </Link>
        <Link
          href={"/#workflow"}
          className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-none px-4 py-2 text-sm font-extrabold transition-colors text-white hover:text-purple-400 "
          prefetch={false}
        >
          Workflow
        </Link>
        <Link
          href={"/#technology"}
          className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-none px-4 py-2 text-sm font-extrabold transition-colors text-white hover:text-purple-400 "
          prefetch={false}
        >
          Technology
        </Link>
        <Link
          href={"/#ourteam"}
          className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-none px-4 py-2 text-sm font-extrabold transition-colors text-white hover:text-purple-400 "
          prefetch={false}
        >
          Our Team
        </Link>
        <Link
          href={"/#testimonials"}
          className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-none px-4 py-2 text-sm font-extrabold transition-colors text-white hover:text-purple-400 "
          prefetch={false}
        >
          Testimonials
        </Link>
        <Button className="font-bold text-stone-700 bg-purple-400 hover:bg-purple-500 lg:mr-10">
          <Link href={"/#getintouch"} prefetch={false}>
            Contact Us
          </Link>
        </Button>
      </nav>
    </header>
  );
}

function MenuIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

function MountainIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <h2 className="flex items-center ">
      <img src="LOGO-MEDKNIGHT.png" height={60} width={60} alt="logo" />
      <span className="bg-gradient-to-r from-stone-50 to-stone-400 bg-clip-text text-transparent">Med</span>
      <span className="bg-gradient-to-r from-purple-500 to-stone-600 bg-clip-text text-transparent">
        Knight
      </span>
    </h2>
  );
}
