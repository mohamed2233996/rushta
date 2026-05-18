"use client";

import Link from "next/link";
import React from "react";

export default function Footer() {
    return (
        <footer className="bg-card-bg border-t border-card-border text-text-main py-12 transition-colors mt-auto" dir="rtl">
            <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">

                <div className="space-y-3 text-right">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl select-none">🏥</span>
                        <h3 className="text-lg font-black text-brand">منصة روشته (Roshetta)</h3>
                    </div>
                    <p className="text-sm text-text-muted leading-relaxed">
                        منصتك الطبية المتكاملة لحجز الاستشارات والكشوفات الطبية بسرعة وسهولة. هدفنا تقديم تجربة صحية سلسة وبدون تعقيد للمريض والطبيب.
                    </p>
                </div>

                <div className="space-y-3 text-right">
                    <h4 className="text-sm font-bold text-text-main border-r-2 border-brand pr-2">روابط سريعة</h4>
                    <ul className="space-y-2 text-sm">
                        <li>
                            <Link href="/" className="text-text-muted hover:text-brand transition-colors block">
                                الرئيسية
                            </Link>
                        </li>
                        <li>
                            <Link href="/booking" className="text-text-muted hover:text-brand transition-colors block">
                                احجز الآن
                            </Link>
                        </li>
                        <li>
                            <Link href="/doctors" className="text-text-muted hover:text-brand transition-colors block">
                                دليل الأطباء
                            </Link>
                        </li>
                    </ul>
                </div>

                <div className="space-y-3 text-right">
                    <h4 className="text-sm font-bold text-text-main border-r-2 border-brand pr-2">تواصل معنا</h4>
                    <ul className="space-y-2 text-sm text-text-muted">
                        <li className="flex items-center gap-2 justify-start">
                            <span>📧</span>
                            <a href="mailto:support@dawak.com" className="hover:text-brand transition-colors" dir="ltr">
                            medomano771@gmail.com
                            </a>
                        </li>
                        <li className="flex items-center gap-2 justify-start">
                            <span>📱</span>
                            <span dir="ltr">+20 1025402633</span>
                        </li>
                        <li className="flex items-center gap-2 justify-start">
                            <span>📍</span>
                            <span>منوف -المنوفية -مصر</span>
                        </li>
                    </ul>
                </div>

            </div>

            {/* شريط الحقوق السفلي */}
            <div className="max-w-6xl mx-auto px-4 mt-8 pt-6 border-t border-card-border/60 text-center text-xs text-text-muted flex flex-col sm:flex-row items-center justify-between gap-4">
                <p>© {new Date().getFullYear()} روشته. جميع الحقوق محفوظة.</p>
                <p className="text-xs">
                    تم التطوير بكل ❤️ لدعم الرعاية الصحية برعاية المهندس محمد جمال
                </p>
            </div>
        </footer>
    );
}