// app/api/teams/join/route.ts
// R3: Join team via invite link — validates invite code and adds user to team

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
    const supabase = await createClient();

    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { inviteCode } = body;

    if (!inviteCode || typeof inviteCode !== "string") {
        return NextResponse.json(
            { error: "Invite code is required." },
            { status: 400 }
        );
    }

    // Validate UUID format
    const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if (!uuidRegex.test(inviteCode.trim())) {
        return NextResponse.json(
            { error: "Invalid invite code format." },
            { status: 400 }
        );
    }

    // No expiry check — OQ3 unresolved, links currently permanent.
    // Enforced inside the DB function itself (see migration 002), not just
    // here — so this check can't be bypassed by calling Supabase directly.

    // The invite lookup + membership insert now happen atomically inside
    // join_team_via_invite (SECURITY DEFINER), which is the only path that
    // can write to team_members for a join. Direct table inserts are no
    // longer permitted by RLS at all.
    const { data: teamId, error: rpcError } = await supabase.rpc(
        "join_team_via_invite",
        { invite_code_input: inviteCode.trim() }
    );

    if (rpcError) {
        console.error("JOIN TEAM ERROR:", rpcError);

        // The RPC raises this specific message for a code that doesn't match
        // any team — surface that as a clear 404, not a generic 500.
        if (rpcError.message?.includes("Invalid invite code")) {
            return NextResponse.json(
                { error: "Invalid invite code. No team found." },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { error: "Something went wrong joining the team. Please try again." },
            { status: 500 }
        );
    }

    // Fetch the team name for the response (function only returns the id)
    const { data: team } = await supabase
        .from("teams")
        .select("name")
        .eq("id", teamId)
        .single();

    return NextResponse.json({ teamId, name: team?.name ?? "" });
}