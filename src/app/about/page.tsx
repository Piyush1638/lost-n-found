"use client"
import React from 'react'
import { useUser } from "@clerk/nextjs";

const page = () => {
  /*const { isLoaded, isSignedIn, user } = useUser();
  if (!isLoaded || !isSignedIn) {
    return null;
  }
  console.log(user);*/
  return (
    <div>page</div>
  )
}

export default page