"use client";

import Image from "next/image";
import { useSession } from "next-auth/react"; // Import useSession from next-auth/react
import { defaultButton } from "./styles";
import AuthButton from "../components/AuthButton";
import { useEffect, useState } from "react";

export default function Home() {
  const { data: session } = useSession(); // Fetch session data using useSession

  // Access user data from the session
  useEffect(() => {
    console.log("session", session);
  }, [session]);

  return (
    <main className="bg-rose-950 flex min-h-screen items-center justify-between p-24">
      <div>
        <Image src="/revs_logo.png" width={400} height={400} alt="" />
      </div>
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-white text-3xl">Rev&apos;s American Grill POS</h1>
        <div className="flex gap-4">
          {/* Pass session data to AuthButton */}
          <AuthButton serverSession={session}></AuthButton>
          {/* Display user email from session */}
          <a href="/manager" className={defaultButton}>
            Manager
          </a>
          <a href="/cashier" className={defaultButton}>
            Cashier
          </a>
          <a href="/customer" className={defaultButton}>
            Customer
          </a>
          <a href="/menu" className={defaultButton}>
            Menu
          </a>
          <a href="/employee" className={defaultButton}>
            Admin
          </a>
          <a href="/kitchen" className={defaultButton}>
            Kitchen
          </a>
        </div>
      </div>
    </main>
  );
}
