import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getMaintenanceMode } from "@/lib/system-settings";

export async function POST(req: NextRequest) {
  try {
    const maintenance = await getMaintenanceMode();
    if (maintenance.enabled) {
      return NextResponse.json(
        { error: "Portal is currently under scheduled maintenance. Please try again later." },
        { status: 503 }
      );
    }

    const body = await req.json();

    const category = (body.category || "general").trim();
    const fullName = (body.fullName || "").trim();
    const email = (body.email || "").trim().toLowerCase();
    const phone = (body.phone || "").trim();
    const rollNo = (body.rollNo || "").trim();
    const subject = (body.subject || "").trim();
    const message = (body.message || "").trim();

    if (!fullName || !email || !message) {
      return NextResponse.json(
        { error: "Full Name, Email, and Message are required fields." },
        { status: 400 }
      );
    }

    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("contact_inquiries")
      .insert({
        category,
        full_name: fullName,
        email,
        phone: phone || null,
        roll_no: rollNo || null,
        subject: subject || null,
        message,
        status: "new",
      })
      .select("id")
      .single();

    if (error) {
      console.error("Error inserting contact inquiry:", error);
      return NextResponse.json(
        { error: "Failed to record your inquiry. Please try again later." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Your inquiry has been submitted successfully.",
        id: data?.id,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Unexpected error in contact API:", err);
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}
