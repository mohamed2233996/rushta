"use client";

import { supabase } from "@/lib/supabaseClient";
import { useState, useCallback } from "react";

export function useAvailableSlots() {
    const [availableSlots, setAvailableSlots] = useState<string[]>([]);
    const [loadingSlots, setLoadingSlots] = useState(false);

    const fetchAvailableSlots = useCallback(async (
        doctorId: number,
        date: string,       
        allSlots: string[] 
    ) => {
        try {
            setLoadingSlots(true);

            // جيب الـ slots المحجوزة لهذا الدكتور في هذا اليوم بالتحديد
            const { data, error } = await supabase
                .from("appointments")
                .select("appointment_time")
                .eq("doctor_id", doctorId)
                .eq("appointment_date", date)
                .in("status", ["pending", "confirmed"]);

            if (error) throw error;

            const bookedTimes = (data || []).map((b) => b.appointment_time);

            // شيل المحجوز وسيب المتاح
            setAvailableSlots(allSlots.filter((slot) => !bookedTimes.includes(slot)));
        } catch (err: any) {
            console.error("Error fetching slots:", err.message);
            setAvailableSlots(allSlots); // لو حصل error، اعرض الكل
        } finally {
            setLoadingSlots(false);
        }
    }, []);

    return { availableSlots, loadingSlots, fetchAvailableSlots };
}