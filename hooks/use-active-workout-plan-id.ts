import { useState, useEffect } from "react";
import { getHomeData } from "@/lib/api/fetch-generated";
import dayjs from "dayjs";

export function useActiveWorkoutPlanId() {
  const [activePlanId, setActivePlanId] = useState<string | null>(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const response = await getHomeData(dayjs().format("YYYY-MM-DD"));
        if (response.status === 200 && response.data.activeWorkoutPlanId) {
          setActivePlanId(response.data.activeWorkoutPlanId);
        }
      } catch (error) {
        console.error("Failed to fetch active workout plan id", error);
      }
    };

    fetchHomeData();
  }, []);

  return activePlanId;
}
