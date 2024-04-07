"use client"
import React from "react";
import { FaInstagram } from "react-icons/fa6";
import { SlSocialTwitter } from "react-icons/sl";
import { FaFacebook } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { Separator } from "@radix-ui/react-separator";





const Footer = () => {
  return (
    <footer className="w-full border-t-2">
      <Separator/>
      <div className="w-full flex tablet:flex-row flex-col tablet:justify-between justify-center gap-5 px-10 py-5">
        <div className="flex gap-2 flex-col">
          <h3 className="text-lg tablet:text-start text-center font-montserrat font-medium">LostLink</h3>
          <p className="text-sm">Copyright {new Date().getFullYear()} LostLink. All rights reserved.</p>
        </div>
        <div className="flex tablet:items-center tablet:justify-center flex-col  gap-2">
          <h3 className="tablet:text-start text-center font-montserrat font-semibold">Follow Us</h3>
          <div className="flex items-center justify-center gap-3">
            <FaInstagram className="text-2xl mx-2 hover:scale-[1.05]" />
            <SlSocialTwitter className="text-2xl mx-2 hover:scale-[1.05]" />
            <FaFacebook className="text-2xl mx-2 hover:scale-[1.05]" />
            <FaLinkedin className="text-2xl mx-2 hover:scale-[1.05]" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
