import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();

  try {
    const { name } = await req.json();

    if (!name) {
      return NextResponse.json({ error: "Missing name" }, { status: 400 });
    }

    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData || !userData.user) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    const user = userData.user;

    if (userError || !user) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    const { data, error } = await supabase.from("customers").insert([
      {
        name,
        email: user.email,
        user_id: user.id,
      },
    ]);

    if (error) {
      throw error;
    }

    return NextResponse.json({ message: "Customer added successfully", data });
  } catch (error) {
    console.error("Error adding customer:", error);
    return NextResponse.json(
      { error: error || "Internal server error" },
      { status: 500 }
    );
  }
}
