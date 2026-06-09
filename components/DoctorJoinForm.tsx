"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export function DoctorJoinForm() {
    const [name, setName] = useState("");
    const [specialty, setSpecialty] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase
            .from("doctor_join_requests")
            .insert([{ name, specialty, phone, email }]);

        setLoading(false);
        if (!error) setSent(true);
    };

    if (sent) return (
        <div className="text-center py-6 space-y-2">
            <div className="text-4xl">✅</div>
            <p className="font-black text-text-main">تم استلام طلبك!</p>
            <p className="text-xs text-text-muted">هنتواصل معاك على {email} قريباً</p>
        </div>
    );

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <input
                type="text" required placeholder="اسمك الكامل"
                value={name} onChange={(e) => setName(e.target.value)}
                className="w-full p-3 rounded-xl border border-card-border focus:outline-none focus:border-brand bg-card-bg text-text-main text-sm"
            />
            <input
                type="text" required placeholder="تخصصك الطبي"
                value={specialty} onChange={(e) => setSpecialty(e.target.value)}
                className="w-full p-3 rounded-xl border border-card-border focus:outline-none focus:border-brand bg-card-bg text-text-main text-sm"
            />
            <input
                type="tel" required placeholder="رقم موبايلك"
                value={phone} onChange={(e) => setPhone(e.target.value)}
                className="w-full p-3 rounded-xl border border-card-border focus:outline-none focus:border-brand bg-card-bg text-text-main text-sm"
                dir="ltr"
            />
            <input
                type="email" required placeholder="بريدك الإلكتروني"
                value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-xl border border-card-border focus:outline-none focus:border-brand bg-card-bg text-text-main text-sm"
                dir="ltr"
            />
            <button
                type="submit" disabled={loading}
                className="w-full bg-brand hover:bg-brand-hover text-background font-black py-3 rounded-xl transition cursor-pointer text-sm disabled:opacity-50"
            >
                {loading ? "جاري الإرسال..." : "أرسل طلب الانضمام ←"}
            </button>
        </form>
    );
}