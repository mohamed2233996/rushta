// hooks/useDoctor.ts
"use client";

import { supabase } from "@/lib/supabaseClient";
import { useState, useEffect } from "react";
import { Doctor } from "./useDoctors";

export function useDoctor(id: number) {
    const [doctor, setDoctor] = useState<Doctor | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchDoctor() {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from("doctors")
                    .select("id, name, specialty, price, time_slots, bio, experience_years, location, avatar_url, sub_specialties")
                    .eq("id", id)
                    .single();

                if (error) throw error;

                setDoctor({
                    id: data.id,
                    name: data.name,
                    specialty: data.specialty,
                    price: data.price,
                    timeSlots: data.time_slots ?? [],
                    bio: data.bio ?? null,
                    experienceYears: data.experience_years ?? null,
                    location: data.location ?? null,
                    avatarUrl: data.avatar_url ?? null,
                    subSpecialties: data.sub_specialties ?? [],
                });
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        if (id) fetchDoctor();
    }, [id]);

    return { doctor, loading, error };
}