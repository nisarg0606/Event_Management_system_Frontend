import { useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";

export default function Home() {
    const router = useRouter()
    return (
        <section>
            <title>Host Dashboard</title>
            <main>
                <h1 className="pt-6 pb-2 text-center text-4xl font-medium">Host Event Dashboard</h1>
                <div className="flex justify-between flex-row flex-wrap gap-x-10 gap-y-4 m-9 pl-5 pr-5 md:justify-center">
                    <a onClick={()=>{router.push("/host/venues/view")}} className="">
                        <figure className="max-w-xs mx-auto p-4 m-5 bg-[#DEE2E6] hover:bg-[#ADB5BD] rounded-lg">
                            <img src="/images/host-dashboard-element.jpg" alt="View Venues" className="h-auto rounded-lg" />
                            <figcaption className="text-center mt-4">View Venues</figcaption>
                        </figure>
                    </a>
                    <a onClick={()=>{router.push("/host/venues/create")}} className="">
                        <figure className="max-w-xs mx-auto p-4 m-5 bg-[#DEE2E6] hover:bg-[#ADB5BD] rounded-lg">
                            <img src="/images/host-dashboard-element.jpg" alt="Add Venues" className="h-auto rounded-lg" />
                            <figcaption className="text-center mt-4">Add Venues</figcaption>
                        </figure>
                    </a>
                    <a onClick={()=>{router.push("/host/activities/view")}} className="">
                        <figure className="max-w-xs mx-auto p-4 m-5 bg-[#DEE2E6] hover:bg-[#ADB5BD] rounded-lg">
                            <img src="/images/host-dashboard-element.jpg" alt="View Activities" className="h-auto rounded-lg" />
                            <figcaption className="text-center mt-4">View Activities</figcaption>
                        </figure>
                    </a>
                    <a onClick={()=>{router.push("/host/activities/create")}} className="">
                        <figure className="max-w-xs mx-auto p-4 m-5 bg-[#DEE2E6] hover:bg-[#ADB5BD] rounded-lg">
                            <img src="/images/host-dashboard-element.jpg" alt="Add Activities" className="h-auto rounded-lg" />
                            <figcaption className="text-center mt-4">Add Activities</figcaption>
                        </figure>
                    </a>
                    <a onClick={()=>{router.push("/host/bookings")}} className="">
                        <figure className="max-w-xs mx-auto p-4 m-5 bg-[#DEE2E6] hover:bg-[#ADB5BD] rounded-lg">
                            <img src="/images/host-dashboard-element.jpg" alt="Add Activities" className="h-auto rounded-lg" />
                            <figcaption className="text-center mt-4">View Bookings</figcaption>
                        </figure>
                    </a>
                </div>
            </main>
        </section>
    )
}
Home.auth = true
Home.Layout = "Host"