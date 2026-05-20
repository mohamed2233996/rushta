// hooks/useDoctors.ts
"use client";

import { supabase } from "@/lib/supabaseClient";
import { useState, useEffect } from "react";

export interface Doctor {
    id: number;
    name: string;
    specialty: string;
    price: number;
    timeSlots: string[];
}

export function useDoctors() {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchDoctors() {
            try {
                setLoading(true);
                setError(null);

                const { data: doctorsData, error: doctorsError } = await supabase
                    .from("doctors")
                    .select("id, name, specialty, price, time_slots")
                    .order("created_at", { ascending: true });

                if (doctorsError) throw doctorsError;

                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const in7Days = new Date(today);
                in7Days.setDate(today.getDate() + 6);

                const { data: bookedSlots, error: bookedError } = await supabase
                    .from("appointments")
                    .select("doctor_id, appointment_date, appointment_time")
                    .in("status", ["pending", "confirmed"])
                    .gte("appointment_date", today.toISOString().split("T")[0])
                    .lte("appointment_date", in7Days.toISOString().split("T")[0]);

                if (bookedError) throw bookedError;

                const formattedDoctors: Doctor[] = (doctorsData || []).map((doc) => {
                    const docBookedSlots = (bookedSlots || [])
                        .filter((b) => b.doctor_id === doc.id)
                        .map((b) => b.appointment_time);

                    return {
                        id: doc.id,
                        name: doc.name,
                        specialty: doc.specialty,
                        price: doc.price,
                        timeSlots: doc.time_slots.filter(
                            (slot: string) => !docBookedSlots.includes(slot)
                        ),
                    };
                });

                setDoctors(formattedDoctors);
            } catch (err: any) {
                console.error("Error fetching doctors:", err.message);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchDoctors();
    }, []);

    return { doctors, loading, error };
}