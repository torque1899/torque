// src/app/api/settings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from '@/lib/cloudflare';
import { drizzle } from 'drizzle-orm/d1';
import { settings } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { verifyToken } from '@/lib/auth';

export const runtime = 'edge';

// Default homepage configuration fallback if database is empty
const defaultHomepageConfig = {
  alerts: [
    "IGNOU June Term End Exam Assignment submission deadline extended",
    "New Sarkari Job alerts: SBI PO and SSC CGL notifications out!"
  ],
  portals: [
    { label: "IGNOU Official Website", href: "https://www.ignou.ac.in" },
    { label: "IGNOU Student Samarth Portal", href: "https://ignou.samarth.edu.in" },
    { label: "Online Exam Form Submission", href: "https://exam.ignou.ac.in" },
    { label: "Revaluation Result Portal", href: "https://revaluation.ignou.ac.in" },
    { label: "Sarkari Job Results Board", href: "https://www.sarkaripost.com" }
  ],
  checklist: [
    { label: "June Term-End Assignments", status: "Active / Open", color: "#16a34a" },
    { label: "June Term-End Examinations Form", status: "Extended / Open", color: "#16a34a" },
    { label: "New Academic Cycle Admission", status: "Extended", color: "#b45309" },
    { label: "Hall Ticket / Admit Card link", status: "Awaiting Link", color: "#d33" },
    { label: "Grade Card Re-evaluation status", status: "Updated Daily", color: "#2563eb" }
  ],
  telegram: {
    title: "Join Telegram Channel",
    description: "Get instant notifications on your mobile for IGNOU announcements, question sheets, syllabus releases, and Government Job Alerts.",
    channelUrl: "https://t.me/ignou_study_jobs"
  }
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const key = searchParams.get('key') || 'homepage';

    const { env } = await getCloudflareContext();
    const db = drizzle(env.DB);

    const [row] = await db
      .select()
      .from(settings)
      .where(eq(settings.key, key))
      .limit(1);

    if (!row) {
      if (key === 'homepage') {
        return NextResponse.json({ value: defaultHomepageConfig });
      }
      return NextResponse.json({ error: 'Setting not found' }, { status: 404 });
    }

    try {
      const parsedValue = JSON.parse(row.value);
      return NextResponse.json({ value: parsedValue });
    } catch {
      return NextResponse.json({ value: row.value });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const token = req.cookies.get('torque_token')?.value;
    const payload = token ? await verifyToken(token) : null;
    if (!payload || payload.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = req.nextUrl;
    const key = searchParams.get('key') || 'homepage';

    const body = await req.json() as any;
    const { value } = body;
    if (value === undefined) {
      return NextResponse.json({ error: 'Value required' }, { status: 400 });
    }

    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);

    const { env } = await getCloudflareContext();
    const db = drizzle(env.DB);

    // D1 upsert/update
    const [existing] = await db
      .select()
      .from(settings)
      .where(eq(settings.key, key))
      .limit(1);

    if (existing) {
      await db
        .update(settings)
        .set({ value: stringValue })
        .where(eq(settings.key, key));
    } else {
      await db
        .insert(settings)
        .values({ key, value: stringValue });
    }

    return NextResponse.json({ success: true, key, value });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
