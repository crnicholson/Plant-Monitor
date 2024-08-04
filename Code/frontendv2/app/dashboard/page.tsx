'use client'
import { useUser } from "@auth0/nextjs-auth0/client";
import { redirect } from "next/navigation";
import Display from "../../components/display";

export default function Dashboard() {
    const { user, error, isLoading } = useUser();

    if (user) {
        return (
            <>
                <div className="p-10">
                    <p className="text-sm">WELCOME TO YOUR</p>
                    <h1 className="text-4xl font-bold">Dashboard</h1>
                    <div className="h-[32px] w-full"></div>
                    <Display />
                    <div className="h-[32px] w-full"></div>
                    <a className="underline hover:text-[#00345be3]" href="/api/auth/logout">Logout</a>
                </div>
            </>
        );
    }

    redirect("api/auth/login");

    return (
        <div>
            <h1>You are unauthorized for this page.</h1>
        </div>
    );
}
