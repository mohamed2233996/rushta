import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
    const res = NextResponse.next();

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return req.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        res.cookies.set(name, value, options);
                    });
                },
            },
        }
    );

    const { data: { session } } = await supabase.auth.getSession();

    const isDoctorRoute =
        req.nextUrl.pathname.startsWith("/doctor") &&
        req.nextUrl.pathname !== "/doctor/login";

    if (isDoctorRoute && !session) {
        return NextResponse.redirect(new URL("/doctor/login", req.url));
    }

    return res;
}

export const config = {
    matcher: ["/doctor/:path*"],
};