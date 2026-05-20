"use client";

import { supabase } from "@/lib/supabaseClient";
import { useState, useEffect } from "react";

export interface Appointment {
    id: number;
    patient_name: string;
    patient_email: string;
    patient_phone: string;
    appointment_date: string;
    appointment_time: string;
    appointment_label: string;
    status: "pending" | "confirmed" | "cancelled";
    prescription_data: any[];
}

export interface DashboardStats {
    todayCount: number;
    monthCount: number;
    completionRate: number;
    monthRevenue: number;
}

export interface ChartData {
    day: string;
    count: number;
}

export function useDoctorDashboard() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [stats, setStats] = useState<DashboardStats>({
        todayCount: 0,
        monthCount: 0,
        completionRate: 0,
        monthRevenue: 0,
    });
    const [chartData, setChartData] = useState<ChartData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [doctorId, setDoctorId] = useState<number | null>(null);
    const [doctorName, setDoctorName] = useState<string>("");
    const [doctorPrice, setDoctorPrice] = useState<number>(0);

    useEffect(() => {
        async function fetchDashboard() {
            try {
                setLoading(true);

                // ١. جيب بيانات الدكتور الحالي
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) throw new Error("غير مسجل دخول");

                const { data: doctor, error: doctorError } = await supabase
                    .from("doctors")
                    .select("id, name, price")
                    .eq("user_id", user.id)
                    .single();

                if (doctorError || !doctor) throw new Error("لم يتم العثور على بيانات الطبيب");

                setDoctorId(doctor.id);
                setDoctorName(doctor.name);
                setDoctorPrice(doctor.price);

                // ٢. جيب كل الحجوزات
                const { data: appts, error: apptsError } = await supabase
                    .from("appointments")
                    .select("*")
                    .eq("doctor_id", doctor.id)
                    .order("appointment_date", { ascending: false });

                if (apptsError) throw apptsError;

                const allAppts: Appointment[] = appts || [];
                setAppointments(allAppts);

                // ٣. احسب الإحصائيات
                const today = new Date().toISOString().split("T")[0];
                const firstOfMonth = new Date();
                firstOfMonth.setDate(1);
                const firstOfMonthStr = firstOfMonth.toISOString().split("T")[0];

                const todayAppts = allAppts.filter(a => a.appointment_date === today);
                const monthAppts = allAppts.filter(a => a.appointment_date >= firstOfMonthStr);
                const confirmedMonth = monthAppts.filter(a => a.status === "confirmed");
                const completionRate = monthAppts.length > 0
                    ? Math.round((confirmedMonth.length / monthAppts.length) * 100)
                    : 0;

                setStats({
                    todayCount: todayAppts.length,
                    monthCount: monthAppts.length,
                    completionRate,
                    monthRevenue: confirmedMonth.length * doctor.price,
                });

                // ٤. داتا الـ chart - آخر 30 يوم
                const last30: ChartData[] = [];
                for (let i = 29; i >= 0; i--) {
                    const d = new Date();
                    d.setDate(d.getDate() - i);
                    const dateStr = d.toISOString().split("T")[0];
                    const dayLabel = `${d.getDate()}/${d.getMonth() + 1}`;
                    const count = allAppts.filter(a => a.appointment_date === dateStr).length;
                    last30.push({ day: dayLabel, count });
                }
                setChartData(last30);

            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchDashboard();
    }, []);

    const updateAppointmentStatus = async (id: number, status: "pending" | "confirmed" | "cancelled") => {
        const { error } = await supabase
            .from("appointments")
            .update({ status })
            .eq("id", id);

        if (!error) {
            setAppointments(prev =>
                prev.map(a => a.id === id ? { ...a, status } : a)
            );
        }
    };

    const savePrescription = async (id: number, prescription: any[]) => {
        const { error } = await supabase
            .from("appointments")
            .update({ prescription_data: prescription, status: "confirmed" })
            .eq("id", id);

        if (!error) {
            setAppointments(prev =>
                prev.map(a => a.id === id ? { ...a, prescription_data: prescription, status: "confirmed" } : a)
            );
        }
        return !error;
    };

    return {
        appointments, stats, chartData,
        loading, error,
        doctorId, doctorName, doctorPrice,
        updateAppointmentStatus, savePrescription,
    };
}