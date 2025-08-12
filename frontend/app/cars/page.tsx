


"use client"


import { CarsMain } from "../components/cars/CarsMain";
import MapView from "../components/cars/MapView";



export default function Page() {
    return (
    <div >
        <MapView lat={52.52} lng={13.405}/>
        <CarsMain/>
    </div>
    )
}