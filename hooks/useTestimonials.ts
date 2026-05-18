"use client";

import { supabase } from "@/lib/supabaseClient";
import { useState, useEffect } from "react";

export interface Testimonial {
    id: number;
    patient_name: string;
    review: string;
    rating: number;
    doctor_name: string | null;
    created_at: string;
}

export function useTestimonials() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchTestimonials() {
            try {
                setLoading(true);
                setError(null);

                const { data, error } = await supabase
                    .from("testimonials")
                    .select("id, patient_name, review, rating, doctor_name, created_at")
                    .order("created_at", { ascending: false });

                if (error) throw error;
                setTestimonials(data || []);
            } catch (err: any) {
                console.error("Error fetching testimonials:", err.message);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchTestimonials();
    }, []);

    return { testimonials, loading, error };
}