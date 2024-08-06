'use client'
import { useUser } from "@auth0/nextjs-auth0/client";
import { redirect } from "next/navigation";
import Display from "../../components/display";

export default function Dashboard() {
    const { user, error, isLoading } = useUser();

    if (user) {
        return (
            <div className="flex flex-col min-h-screen">
                <div className="flex-grow p-10">
                    <p className="text-sm">WELCOME TO YOUR</p>
                    <h1 className="text-4xl font-bold">Dashboard</h1>
                    <div className="h-[32px] w-full"></div>
                    <Display />
                    <div className="h-[10px] w-full"></div>
                </div>
                <footer className="p-7 text-gray-400 bg-[#00335B]">
                    <div className="container mx-auto text-center">
                        <p>Made with Next.js, Flask, and Auth0. Hosted on Nest and Vercel. Open source on <a className="underline" href="https://github.com/crnicholson/Plant-Monitor/">GitHub</a>.</p>
                        <p className="mb-4">&copy; 2024 Charles Nicholson. Licensed under GNU GPL v3 Software License.</p>
                        <div className="flex justify-center space-x-4">
                            <span>
                                <a href="/api/auth/logout" className="hover:underline">Logout</a>{" "}|{" "}
                                <a href="https://github.com/crnicholson/Plant-Monitor/blob/main/README.md#about" className="hover:underline">About</a>{" "}|{" "}
                                {/* <a href="/" className="hover:underline">Contact</a>{" "}|{" "} */}
                                <a href="https://github.com/crnicholson/Plant-Monitor/blob/main/README.md#need-help?" className="hover:underline">Help</a>
                            </span>
                        </div>
                    </div>
                </footer>
            </div>
        );
    }

    redirect("api/auth/login");

    return (
        <div>
            <h1>You are unauthorized for this page.</h1>
        </div>
    );
}
