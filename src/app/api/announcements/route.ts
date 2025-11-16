import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const isActive = searchParams.get("isActive");
    const showOnHomepage = searchParams.get("showOnHomepage");

    const where: any = {};

    if (category && category !== "all") {
      where.category = category.toUpperCase();
    }

    if (isActive !== null) {
      where.isActive = isActive === "true";
    }

    if (showOnHomepage !== null) {
      where.showOnHomepage = showOnHomepage === "true";
    }

    const announcements = await prisma.announcement.findMany({
      where,
      orderBy: [
        { isImportant: "desc" },
        { publishDate: "desc" },
      ],
    });

    return NextResponse.json(announcements);
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return NextResponse.json(
      { error: "Failed to fetch announcements" },
      { status: 500 }
    );
  }
}
