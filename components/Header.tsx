"use client";

import React, { useEffect, useState, useRef } from "react";
import { useTheme } from "next-themes";
import { useAuth } from "@/hooks/useAuth";
import { useRouter, usePathname } from "next/navigation";

export default function Header() {
    const { setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const { isLoggedIn, user, logout } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => { setMounted(true); }, []);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (!mounted) {
        return <nav className="bg-card-bg border-b border-card-border sticky top-0 z-50 h-16 shadow-sm" />;
    }

    const isDarkMode = resolvedTheme === "dark";

const userName = user?.user_metadata?.full_name ?? user?.email ?? "";
const avatarLetter = userName.charAt(0).toUpperCase();

    const handleLogout = async () => {
        setDropdownOpen(false);
        await logout();
        router.push("/");
    };

    return (
        <nav className="bg-card-bg border-b border-card-border sticky top-0 z-50 shadow-sm transition-colors" dir="rtl">
            <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">

                <div
                    onClick={() => router.push("/")}
                    className="flex items-center gap-2 cursor-pointer select-none"
                >
                    <div className="w-10 h-10 bg-brand text-background rounded-xl flex items-center justify-center font-bold text-xl shadow-md shadow-brand/10">
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
                    >
                        {isDarkMode ? "☀️" : "🌙"}
                    </button>

                    <div className="h-6 w-px bg-card-border mx-1" />

                    {pathname !== "/" && (
                        <button
                            onClick={() => router.push("/")}
                            className="text-sm font-medium text-text-muted hover:text-brand transition px-2.5 py-2 rounded-xl cursor-pointer"
                        >
                            الرئيسية
                        </button>
                    )}

                    {pathname === "/" && (
                        <button
                            onClick={() => router.push("/doctorDashboard/login")}
                            className="text-sm font-medium text-text-muted hover:text-brand transition px-3 py-2 border border-card-border bg-background hover:bg-card-hover rounded-xl cursor-pointer"
                        >
                            لوحة الطبيب
                        </button>
                    )}

                    {isLoggedIn ? (
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="flex items-center gap-2 bg-background border border-card-border hover:border-brand/40 px-2.5 py-1.5 rounded-xl transition cursor-pointer"
                            >
                                <div className="w-7 h-7 rounded-full bg-brand text-background flex items-center justify-center text-sm font-black">
                                    {avatarLetter}
                                </div>
                                <span className="text-sm font-bold text-text-main hidden sm:block max-w-[100px] truncate">
                                    {userName}
                                </span>
                                <span className={`text-text-muted text-xs transition-transform ${dropdownOpen ? "rotate-180" : ""}`}>
                                    ▾
                                </span>
                            </button>

                            {/* الـ Dropdown */}
                            {dropdownOpen && (
                                <div className="absolute left-0 top-12 w-52 bg-card-bg border border-card-border rounded-2xl shadow-xl z-50 overflow-hidden" dir="rtl">
                                    
                                    <div className="px-4 py-3 border-b border-card-border bg-brand-light">
                                        <p className="text-xs text-text-muted">مرحباً بك 👋</p>
                                        <p className="text-sm font-bold text-text-main truncate">{userName}</p>
                                    </div>

                                    <div className="p-1.5 space-y-0.5">
                                        <button
                                            onClick={() => { setDropdownOpen(false); router.push("/dashboard"); }}
                                            className="w-full text-right flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-card-hover text-sm text-text-main transition cursor-pointer"
                                        >
                                            <span className="text-base">🏥</span>
                                            <span className="font-medium">حسابي وحجوزاتي</span>
                                        </button>

                                        <div className="border-t border-card-border my-1" />

                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-right flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-red-500/10 text-sm text-red-500 transition cursor-pointer"
                                        >
                                            <span className="text-base">🚪</span>
                                            <span className="font-medium">تسجيل الخروج</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                    ) : (
                        <button
                            onClick={() => router.push("/?openLogin=true")}
                            className="text-sm font-bold bg-brand hover:bg-brand-hover text-background px-4 py-2 rounded-xl transition cursor-pointer shadow-sm"
                        >
                            تسجيل الدخول
                        </button>
                    )}

                </div>
            </div>
        </nav>
    );
}