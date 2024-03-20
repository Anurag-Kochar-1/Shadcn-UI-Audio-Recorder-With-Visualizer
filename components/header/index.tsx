import React from "react";
import { ThemeDropdownMenu } from "../theme-dropdown-menu";
import { Button } from "../ui/button";
import {  X } from "lucide-react";

export const Header = () => {
  return (
    <div className="h-16 bg-transparent backdrop-blur-md sticky top-0 w-full flex justify-end items-center px-2 md:px-4 lg:px-6">
      <div className="flex gap-2 md:gap-4">
        <a
          href={`https://twitter.com/anurag__kochar`}
          target="_blank"
          rel="noreferrer"
        >
          <Button size={"icon"} variant={"outline"}>
            {" "}
            <X size={15} />{" "}
          </Button>
        </a>
        <ThemeDropdownMenu />
      </div>
    </div>
  );
};
