import { useSetRecoilState } from "recoil";
import { selectedCarState } from "../store/atoms";
import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";
import type { carId } from "../types/store";
import { API_BASES } from "../config";






export const useInitialize = () => {
    const setCarIds = useSetRecoilState(selectedCarState)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // This runs only once on component mount
    const fetchCars = async () => {
      try {
        
        const response = await apiRequest<{data : carId[]}>(API_BASES.BACKEND, "/api/v1/car/distinct");
        
        setCarIds(response.data)

      } catch (error) {
        console.error("Error fetching cars:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []); // <-- empty dependency array ensures it runs only once


  return {loading}
}