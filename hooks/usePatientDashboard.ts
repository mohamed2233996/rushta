"use client";

import { supabase } from "@/lib/supabaseClient";
import { useState, useEffect } from "react";

export interface PatientAppointment {
    id: number;
    appointment_date: string;
    appointment_time: string;
    appointment_label: string;
    status: "pending" | "confirmed" | "cancelled";
    prescription_data: {
        name: string;
        dose: string;
        duration: string;
    }[];
    doctor: {
        name: string;
        specialty: string;
    };
}

export function usePatientDashboard() {
    const [appointments, setAppointments] = useState<PatientAppointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [patientEmail, setPatientEmail] = useState<string>("");
    const [patientName, setPatientName] = useState<string>("");

    useEffect(() => {
        async function fetchPatientData() {
            try {
                setLoading(true);

                // جيب الـ user المسجل دخول
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) throw new Error("غير مسجل دخول");

                setPatientEmail(user.email ?? "");
                setPatientName(user.user_metadata?.full_name ?? user.email ?? "غير معروف");

                // جيب الحجوزات بتاعته مع بيانات الدكتور
                const { data, error } = await supabase
                    .from("appointments")
                    .select(`
                        id,
                        appointment_date,
                        appointment_time,
                        appointment_label,
                        status,
                        prescription_data,
                        doctors (
                            name,
                            specialty
                        )
                    `)
                    .eq("patient_email", user.email)
                    .order("appointment_date", { ascending: false });

                if (error) throw error;

                const formatted: PatientAppointment[] = (data || []).map((a: any) => ({
                    id: a.id,
                    appointment_date: a.appointment_date,
                    appointment_time: a.appointment_time,
                    appointment_label: a.appointment_label,
                    status: a.status,
                    prescription_data: a.prescription_data || [],
                    doctor: {
                        name: a.doctors?.name ?? "غير معروف",
                        specialty: a.doctors?.specialty ?? "",
                    },
                }));

                setAppointments(formatted);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchPatientData();
    }, []);

    // الحجوزات القادمة
const upcomingAppointments = appointments
    .filter(a =>
        a.status !== "cancelled" &&
        new Date(a.appointment_date) >= new Date(new Date().toDateString())
    )
    .sort((a, b) => 
        new Date(a.appointment_date).getTime() - new Date(b.appointment_date).getTime()
    );

    const cancelAppointment = async (id: number) => {
    const { error } = await supabase
        .from("appointments")
        .update({ status: "cancelled" })
        .eq("id", id);

    if (!error) {
        setAppointments(prev =>
            prev.map(a => a.id === id ? { ...a, status: "cancelled" } : a)
        );
    }
};


    // الروشتات الموجودة
    const prescriptions = appointments.filter(a =>
        a.prescription_data && a.prescription_data.length > 0
    );

    return {
        appointments,
        upcomingAppointments,
        cancelAppointment,
        prescriptions,
        loading,
        error,
        patientEmail,
        patientName,
    };
}