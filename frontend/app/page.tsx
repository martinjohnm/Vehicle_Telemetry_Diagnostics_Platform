import Image from "next/image";
import { LandingTopBox } from "./components/Landing/LandingTopBox";
import { LandingMain } from "./components/Landing/LandingMain";

export default function Home() {
  return (
    <div>
      <LandingTopBox/>
      <LandingMain/>
    </div>
  );
}
