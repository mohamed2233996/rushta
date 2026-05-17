// hooks/useAuth.ts
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export function useAuth() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
        };
        getSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const login = async (email: string, password: string) => {
        setLoading(true);
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        setLoading(false);
        if (error) throw error;
        return data;
    };

    const signUp = async (email: string, password: string, phone?: string) => {
        setLoading(true);
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    phone_number: phone || null, // تخزين اختياري
                },
            },
        });
        setLoading(false);
        if (error) throw error;
        return data;
    };

    const logout = async () => {
        setLoading(true);
        await supabase.auth.signOut();
        setLoading(false);
    };

    return { user, isLoggedIn: !!user, loading, login, signUp, logout };
}