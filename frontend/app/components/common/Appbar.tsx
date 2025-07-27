

"use client"
import { useRouter } from "next/navigation"


export const Appbar = () => {

    const router = useRouter()

    return <div className="w-full h-16 bg-black p-4">
        <div className="justify-between items-center flex h-full">

            <div className="flex gap-4 items-center justify-center">

                <div className="text-2xl text-yellow-600 font-semibold" onClick={() => router.push("/")}>
                    CARS-102
                </div>
                
                <div className="text-white font-semibold" onClick={() => router.push("/trade")}>
                    Trade
                </div>
            
                <div className="text-white font-semibold" onClick={() => router.push("/markets")}>
                    Markets
                </div>

            

            </div>

            <div className="flex justify-center items-center gap-2">
                <button>Hia</button>
            </div>
        </div>
    </div>
}