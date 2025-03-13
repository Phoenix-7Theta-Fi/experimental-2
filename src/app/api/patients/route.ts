import { getPatientsByPractitioner } from "@/lib/db/users";
import { NextRequest, NextResponse } from "next/server";
import { getUserSession } from "@/lib/auth";
import { getDB } from "@/lib/db";

export async function GET(request: NextRequest) {
  const userId = await getUserSession();
  
  if (!userId) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const db = getDB();
  const user = db.prepare('SELECT role FROM users WHERE id = ?').get(userId) as { role: string } | undefined;
  if (!user || user.role !== "practitioner") {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const patients = getPatientsByPractitioner(userId);

  return NextResponse.json({ patients });
}
