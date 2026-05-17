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

                const { data, error } = await supabase
                    .from("doctors")
                    .select("id, name, specialty, price, time_slots")
                    .order("created_at", { ascending: true });

                if (error) throw error;

                const formattedDoctors: Doctor[] = (data || []).map((doc) => ({
                    id: doc.id,
                    name: doc.name,
                    specialty: doc.specialty,
                    price: doc.price,
                    timeSlots: doc.time_slots,
                }));

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