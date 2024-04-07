"use client";
import Image from "next/image";
import React from "react";
import { useUser } from "@clerk/nextjs";
import { Label } from "@/components/ui/label";

const page = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  if (!isLoaded || !isSignedIn) {
    return null;
  }
  
  const { imageUrl, fullName, emailAddresses, username, id } = user;
  return (
    <main className="min-h-screen">
      <div className="w-full laptop:px-10 laptop:py-19 tablet:p-12 p-4 py-5">
        <div className="flex laptop:flex-row flex-col gap-3">
            
          <div className="laptop:w-2/5 w-full flex flex-col gap-2">
            <div className="px-3 py-4 bg-white shadow-lg shadow-gray-300 border border-gray-600 rounded-xl flex flex-col items-center justify-center gap-3">
              <Image
                src={imageUrl}
                alt="profile"
                height={200}
                width={200}
                className="rounded-full object-contain"
              />
              <h3 className="text-black tablet:text-lg text-base font-semibold">
                {fullName}
              </h3>
            </div>
            <div className="px-3 py-4 bg-white shadow-lg shadow-gray-300 border border-gray-600 rounded-xl flex flex-col items-center justify-center gap-3">
              <h3 className="font-poppins">User Platform Details</h3>
              <div className="flex w-full items-center gap-3">
                <Label htmlFor="username">Username</Label>
                <p>{username}</p>
              </div>
              <div className="flex w-full items-center gap-3">
                <Label htmlFor="email">Email</Label>
                <p id="email">{emailAddresses[0].emailAddress}</p>
              </div>
              <div className="flex w-full items-center gap-3">
                <Label htmlFor="id">UserId</Label>
                <p  id="id">{id}</p>
              </div>
            </div>

            <div className="px-3 py-4 bg-white shadow-lg shadow-gray-300 rounded-xl flex flex-col items-center justify-center gap-3">
            <div className="flex items-center gap-3 w-full">
                <button className="px-3 py-2 font-poppins text-base border border-gray-500 rounded-md w-1/2">Lost</button>
                <button className="px-3 py-2 font-poppins text-base border border-gray-500 rounded-md w-1/2">Found</button>
            </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default page;
