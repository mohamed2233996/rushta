"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function DoctorLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // ١. تسجيل دخول
            const { data, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) throw authError;

            const { data: doctorData, error: doctorError } = await supabase
                .from("doctors")
                .select("id, name")
                .eq("user_id", data.user.id)
                .single();

            if (doctorError || !doctorData) {
                await supabase.auth.signOut();
                throw new Error("هذا الحساب غير مسجل كطبيب في المنظومة");
            }

            router.push("/doctor-dashboard");

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4" dir="rtl">
            <div className="w-full max-w-md space-y-6">

                {/* الهيدر */}
                <div className="text-center space-y-2">
                    <div className="w-14 h-14 bg-brand text-background rounded-2xl flex items-center justify-center font-bold text-2xl mx-auto shadow-md">
                        ر
                    </div>
                    <h1 className="text-2xl font-black text-text-main">بوابة الأطباء</h1>
                    <p className="text-sm text-text-muted">سجل دخولك للوصول للوحة التحكم الخاصة بك</p>
                </div>

                {/* الفورم */}
                <div className="bg-card-bg border border-card-border rounded-2xl p-6 shadow-sm space-y-4">

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-3 rounded-xl text-right">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-text-main">البريد الإلكتروني:</label>
                            <input
                                type="email"
                                required
                                placeholder="doctor@rushta.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-3 rounded-xl border border-card-border focus:outline-none focus:border-brand bg-background text-text-main"
                                dir="ltr"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-text-main">كلمة السر:</label>
                            <input
                                type="password"
                                required
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-3 rounded-xl border border-card-border focus:outline-none focus:border-brand bg-background text-text-main"
                                dir="ltr"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-brand hover:bg-brand-hover text-background font-black py-3 rounded-xl transition shadow-md cursor-pointer disabled:opacity-50"
                        >
                            {loading ? "جاري التحقق..." : "دخول لوحة التحكم ←"}
                        </button>
                    </form>
                </div>

                <p className="text-center text-xs text-text-muted">
                    هذه البوابة مخصصة للأطباء المسجلين فقط
                </p>
            </div>
        </div>
    );
}