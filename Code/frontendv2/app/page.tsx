'use client'
import Image from "next/image";
import { useUser } from "@auth0/nextjs-auth0/client"
import { redirect } from "next/navigation";

export default function Landing() {
  const { user, error, isLoading } = useUser();

  if (user) {
    redirect("/dashboard")
  }
  return (
    <>
      <div className="flex flex-row">
        <div className="w-1/2 p-10 flex justify-center h-screen items-center">
          <div className="w-fit flex flex-col gap-[20px]">
            <h1 className="text-4xl font-bold">Welcome to the Sensor Dashboard.</h1>
            <p className="-mt-[15px] text-4xl">
              This is a simple dashboard to view sensor data.
            </p>
            <p className="text-xl">
              Please sign in or create an account to access the dashboard.
            </p>
            <div className="flex flex-row gap-[20px]">
              <a href="/api/auth/login" className="p-2 w-fit bg-[#00335B] hover:bg-[#00345be3] text-white rounded-xl">Login or Register</a>
            </div>
          </div>
        </div>
        <div className="w-1/2 p-10 flex justify-center h-screen items-center bg-[#00335B]">
          <Image src="/exampleDash.png" alt="Sensor" width={1000} height={500} className="rotate-1 rounded-xl drop-shadow-2xl shadow-2xl" />
        </div>
      </div>
    </>
  );
}