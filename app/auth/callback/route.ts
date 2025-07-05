import { createClient } from "@/lib/supabase/server-route";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/todo";

  console.log("Auth callback received:", { code: !!code, next, origin });

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      console.log(
        "Authentication successful, redirecting to:",
        `${origin}${next}`
      );
      // Successful authentication, redirect to the intended page
      return NextResponse.redirect(`${origin}${next}`);
    } else {
      console.error("Authentication error:", error);
    }
  }

  console.log("Redirecting to login page");
  // If there's an error or no code, redirect to login page
  return NextResponse.redirect(`${origin}/auth/login`);
}
