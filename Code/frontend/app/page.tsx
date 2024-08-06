'use client'
import Image from "next/image";
import { useUser } from "@auth0/nextjs-auth0/client";
import { redirect } from "next/navigation";

export default function Landing() {
  const { user, error, isLoading } = useUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <>
      <div className="flex flex-col lg:flex-row h-screen">
        <div className="lg:w-1/2 p-10 flex flex-col justify-center items-center bg-gray-50">
          <div className="max-w-md text-center lg:text-left animate-fadeIn">
            <h1 className="text-5xl font-bold mb-6 text-[#00335B]">
              Welcome to the Sensor Dashboard
            </h1>
            <p className="text-2xl mb-4">
              A simple and intuitive way to view your sensor data.
            </p>
            <p className="text-lg mb-8">
              Please sign in or create an account to access your personalized dashboard.
            </p>
            <a href="/api/auth/login" className="inline-block px-6 py-3 bg-[#00335B] hover:bg-[#002b4b] text-white text-lg font-medium rounded-lg transition duration-300">
              Login or Register
            </a>
          </div>
        </div>
        {/* flex justify-center items-center */}
        <div className="lg:w-1/2 p-10 h-full lg:h-screen  bg-[#00335B] relative">
          <div className="h-1/4"></div>
          <div className="h-1/2 flex justify-center items-center">
            <Image
              src="/exampleDash.png"
              alt="Sensor Dashboard Example"
              width={1000}
              height={500}
              className="rotate-1 rounded-xl shadow-2xl animate-slideIn"
              priority
            />
          </div>
          <div className="h-1/4 flex justify-end items-end">
            <footer className="hidden lg:block text-gray-400 bg-[#00335B]">
              <div className="container mx-auto text-center">
                <p>Made with Next.js, Flask, and Auth0. Hosted on Nest and Vercel. Open source on <a className="underline" href="https://github.com/crnicholson/Plant-Monitor/">GitHub</a>.</p>
                <p className="mb-4">&copy; 2024 Charles Nicholson. Licensed under MIT Software License.</p>
                <div className="flex justify-center space-x-4">
                  <span>
                    <a href="/" className="hover:underline">Home</a>{" "}|{" "}
                    <a href="/" className="hover:underline">About</a>{" "}|{" "}
                    <a href="/" className="hover:underline">Contact</a>{" "}|{" "}
                    <a href="/" className="hover:underline">Help</a>
                  </span>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </div>
      <footer className="block lg:hidden text-gray-400 pt-[80px] bg-[#00335B] p-10">
        <div className="container mx-auto text-center">
          <p>Made with Next.js, Flask, and Auth0. Hosted on Nest and Vercel. Open source on <a className="underline" href="https://github.com/crnicholson/Plant-Monitor/">GitHub</a>.</p>
          <p className="mb-4">&copy; 2024 Charles Nicholson. Licensed under MIT Software License.</p>
          <div className="flex justify-center space-x-4">
            <span>
              <a href="/" className="hover:underline">Home</a>{" "}|{" "}
              <a href="/" className="hover:underline">About</a>{" "}|{" "}
              <a href="/" className="hover:underline">Contact</a>{" "}|{" "}
              <a href="/" className="hover:underline">Help</a>
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}
