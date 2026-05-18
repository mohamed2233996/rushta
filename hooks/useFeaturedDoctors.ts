"use client";
import { supabase } from "@/lib/supabaseClient";
import { useState, useEffect } from "react";

export interface Doctor {
    id: number;
    name: string;
    specialty: string;
    price: number;
    time_slots: string[];
    created_at: string;
}

export function useFeaturedDoctors(limit: number = 6) {
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
                    .select("id, name, specialty, price, time_slots, created_at")
                    .order("created_at", { ascending: false })
                    .limit(limit);

                if (error) throw error;
                setDoctors(data || []);
            } catch (err: any) {
                console.error("Error fetching doctors:", err.message);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchDoctors();
    }, [limit]);

    return { doctors, loading, error };
}
