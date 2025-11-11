import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 3600; // 1 hour

export async function GET() {
  try {
    // Parallel queries for better performance
    const [
      totalStudents,
      totalArticles,
      totalCodingLabTasks,
      totalWebLabAssignments,
      totalActivities,
      totalAnnouncements,
      totalGalleryItems,
      totalAssignments,
      completedAssignmentsCount,
    ] = await Promise.all([
      // Total active students
      prisma.student.count(),

      // Total articles
      prisma.article.count({
        where: {
          publishedAt: {
            not: null,
          },
        },
      }),

      // Total coding lab tasks
      prisma.codingLabTask.count(),

      // Total web lab assignments
      prisma.webLabAssignment.count({
        where: {
          status: "PUBLISHED",
        },
      }),

      // Total activities
      prisma.event.count(),

      // Total announcements
      prisma.announcement.count(),

      // Total gallery items
      prisma.gallery.count(),

      // Total assignments
      prisma.assignment.count(),

      // Count assignments that have at least one submission (completed assignments)
      prisma.assignment.count({
        where: {
          submissions: {
            some: {},
          },
        },
      }),
    ]);

    // Calculate stats
    const stats = {
      totalStudents,
      totalTutorials: totalArticles,
      totalCodingLabs: totalCodingLabTasks + totalWebLabAssignments,
      totalActivities,
      totalAnnouncements,
      totalGalleryItems,
      totalAssignments,
      completedAssignments: completedAssignmentsCount, // Assignments that have submissions
      upcomingEventsToday: 0, // Will be calculated separately
      upcomingEventsThisWeek: 0, // Will be calculated separately
    };

    // Calculate upcoming events
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(startOfToday);
    endOfToday.setDate(endOfToday.getDate() + 1);

    const startOfWeek = new Date(startOfToday);
    const endOfWeek = new Date(startOfToday);
    endOfWeek.setDate(endOfWeek.getDate() + 7);

    const [upcomingEventsToday, upcomingEventsThisWeek] = await Promise.all([
      prisma.event.count({
        where: {
          date: {
            gte: startOfToday.toISOString(),
            lt: endOfToday.toISOString(),
          },
        },
      }),

      prisma.event.count({
        where: {
          date: {
            gte: startOfToday.toISOString(),
            lt: endOfWeek.toISOString(),
          },
        },
      }),
    ]);

    stats.upcomingEventsToday = upcomingEventsToday;
    stats.upcomingEventsThisWeek = upcomingEventsThisWeek;

    return NextResponse.json({
      success: true,
      data: stats,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching public stats:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch stats",
        data: {
          totalStudents: 0,
          totalTutorials: 0,
          totalCodingLabs: 0,
          totalActivities: 0,
          totalAnnouncements: 0,
          totalGalleryItems: 0,
          totalAssignments: 0,
          completedAssignments: 0,
          upcomingEventsToday: 0,
          upcomingEventsThisWeek: 0,
        },
      },
      { status: 500 }
    );
  }
}
