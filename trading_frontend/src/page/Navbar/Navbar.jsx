import React from "react";

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  DragHandleHorizontalIcon,
  MagnifyingGlassIcon,
} from "@radix-ui/react-icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Sidebar from "./Sidebar";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const {auth} = useSelector(store => store)
  const navigate = useNavigate();

  return (
    <div className="px-2 py-3 border-b z-50bg-background bg-opacity-0 sticky top-0 left-0 right-0 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <Sheet>
          <SheetTrigger>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full w-11 h-11"
            >
              <DragHandleHorizontalIcon className="h-7! w-7!" />
            </Button>
          </SheetTrigger>
          <SheetContent
            className="w-72 border-r-0 flex flex-col justify-center "
            side="left"
          >
            <SheetHeader>
              <SheetTitle>
                <div className="text-3xl flex justify-center items-center gap-1">
                  <Avatar>
                    <AvatarImage src="https://imgs.search.brave.com/qUNBQbhxzKDpUb3q0GxqrQq__Vrsbs1dfkdePLaO-F4/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzA0LzA4Lzk0LzE0/LzM2MF9GXzQwODk0/MTQ4OF9qbm11amJ2/NFZTVnVrZEpsT1pj/MEV1cjRmWmVyZFkw/RC5qcGc" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div>
                    <span className="font-bold text-orange-700">Nex</span>
                    <span>Trade</span>
                  </div>
                </div>
              </SheetTitle>
            </SheetHeader>
            <Sidebar />
          </SheetContent>
        </Sheet>
        <button
          type="button"
          className="cursor-pointer text-sm lg:text-base"
          onClick={() => navigate("/")}
          aria-label="Go to home page"
        >
          NexTrade
        </button>

        <div className="p-0 ml-9">
          <Button
            variant="outline"
            className="flex items-center gap-3"
            onClick={() => navigate("/search")}
            aria-label="Search coins"
          >
            <MagnifyingGlassIcon />
            <span>Search</span>
          </Button>
        </div>
      </div>

      <div>
        <button
          type="button"
          className="cursor-pointer rounded-full"
          onClick={() => navigate("/profile")}
          aria-label="Go to profile page"
        >
          <Avatar>
            <AvatarFallback>
              {auth.user?.fullName?.[0]?.toUpperCase() ?? "U"}
            </AvatarFallback>
          </Avatar>
        </button>
      </div>
    </div>
  );
};

export default Navbar;
