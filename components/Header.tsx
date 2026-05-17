// components/Header.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useAuth } from "@/hooks/useAuth"; 
import { useRouter, usePathname } from "next/navigation";

export default function Header() {
    const { setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const { isLoggedIn, logout } = useAuth();
    
    const router = useRouter();
    const pathname = usePathname(); // لقط المسار الحالي من الرابط فوراً

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <nav className="bg-card-bg border-b border-card-border sticky top-0 z-50 h-16 shadow-sm" />
        );
    }

    const isDarkMode = resolvedTheme === "dark";

    const handleLogoutClick = async () => {
        try {
            await logout();
            router.push("/"); 
        } catch (error) {
            console.error("خطأ أثناء تسجيل الخروج:", error);
        }
    };

    const handleDashboardClick = () => {
        if (isLoggedIn) {
            router.push("/dashboard");
        } else {
            router.push("/?openLogin=true");
        }
    };

    return (
        <nav className="bg-card-bg border-b border-card-border sticky top-0 z-50 shadow-sm transition-colors" dir="rtl">
            <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between font-['Cairo']">

                <div
                    onClick={() => router.push("/")}
                    className="flex items-center gap-2 cursor-pointer select-none"
                >
                    <div className="w-10 h-10 bg-brand text-background rounded-xl flex items-center justify-center font-bold text-xl shadow-md shadow-brand/10 dark:shadow-none">
                        ر
                    </div>
                    <span className="text-2xl font-black tracking-tight text-text-main">
                        روشتة<span className="text-brand">.</span>
                    </span>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">

                    <button
                        onClick={() => setTheme(isDarkMode ? "light" : "dark")}
                        className="p-2 rounded-xl bg-background text-text-muted hover:bg-card-hover hover:text-text-main transition border border-card-border cursor-pointer text-lg"
                        title={isDarkMode ? "تفعيل الوضع الفاتح" : "تفعيل الوضع الداكن"}
                    >
                        {isDarkMode ? "☀️" : "🌙"}
                    </button>

                    <div className="h-6 w-[1px] bg-card-border mx-1"></div>

                    {pathname !== "/" && (
                        <button
                            onClick={() => router.push("/")}
                            className="text-sm font-medium text-text-muted hover:text-brand transition px-2.5 py-2 rounded-xl cursor-pointer"
                        >
                            الرئيسية
                        </button>
                    )}

                    {(pathname === "/" || pathname === "/booking") && (
                        <button
                            onClick={handleDashboardClick}
                            className="text-sm font-medium text-text-muted hover:text-brand transition px-2.5 py-2 rounded-xl cursor-pointer"
                        >
                            {isLoggedIn ? "حسابي" : "تسجيل الدخول"}
                        </button>
                    )}

                    {pathname === "/" && (
                        <button
                            onClick={() => router.push("/doctor")}
                            className="text-sm font-medium text-text-muted hover:text-brand transition px-3 py-2 border border-card-border shadow-sm bg-background hover:bg-card-hover rounded-xl cursor-pointer"
                        >
                            لوحة الطبيب
                        </button>
                    )}

                    {(pathname === "/dashboard" || pathname === "/doctor" || isLoggedIn) && pathname !== "/" && (
                        <button
                            onClick={handleLogoutClick}
                            className="text-sm font-bold text-red-500 dark:text-red-400 hover:bg-red-500/10 transition px-3 py-2 rounded-xl border border-red-500/20 cursor-pointer"
                        >
                            تسجيل الخروج
                        </button>
                    )}

                </div>
            </div>
        </nav>
    );
}