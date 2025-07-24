// app/api/dashboard/stats/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  try {
    // Get the date range from query parameters
    const { searchParams } = new URL(request.url);
    const dateRange = searchParams.get('dateRange') || 'monthly';

    // Get total active cases (where activeCase = true)
    const totalActiveCases = await db.case.count({
      where: {
        activeCase: true,
      },
    });

    // Get urgent cases (both Stat and Urgent priority, and activeCase = true)
    const urgentCases = await db.case.count({
      where: {
        activeCase: true,
        priority: {
          in: ["Stat", "Urgent"],
        },
      },
    });

    // Get total cases count
    const totalCases = await db.case.count();

    // Get completed cases count
    const completedCases = await db.case.count({
      where: {
        completedCase: true,
      },
    });

    // Get review cases count
    const reviewCases = await db.case.count({
      where: {
        reviewCase: true,
      },
    });

    // Additional stats you might want
    const lockedCases = await db.case.count({
      where: {
        isLocked: true,
      },
    });

    // Calculate average turnaround time - FIXED for string dates
    const casesWithTurnaroundTime = await db.case.findMany({
      where: {
        AND: [
          { caseUploadTime: { not: null } },
          { reportTime: { not: null } },
          { caseUploadTime: { not: "" } },
          { reportTime: { not: "" } },
        ],
      },
      select: {
        caseUploadTime: true,
        reportTime: true,
      },
    });

    let averageTurnaroundTime = 0;
    if (casesWithTurnaroundTime.length > 0) {
      const totalTurnaroundTime = casesWithTurnaroundTime.reduce(
        (sum: number, case_) => {
          if (case_.caseUploadTime && case_.reportTime) {
            try {
              // Parse string dates to Date objects
              const uploadTime = new Date(case_.caseUploadTime);
              const reportTime = new Date(case_.reportTime);
              
              // Check if dates are valid
              if (!isNaN(uploadTime.getTime()) && !isNaN(reportTime.getTime())) {
                const diffInHours = (reportTime.getTime() - uploadTime.getTime()) / (1000 * 60 * 60);
                // Only add positive differences (report time should be after upload time)
                if (diffInHours > 0) {
                  return sum + diffInHours;
                }
              }
            } catch (error) {
              console.error("Error parsing date:", error);
            }
          }
          return sum;
        },
        0
      );

      averageTurnaroundTime = totalTurnaroundTime / casesWithTurnaroundTime.length;
    }

    // Priority breakdown for all cases (not just active)
    const priorityBreakdown = await db.case.groupBy({
      by: ["priority"],
      _count: {
        priority: true,
      },
    });

    // Modality breakdown for all cases (not just active)
    const modalityBreakdown = await db.case.groupBy({
      by: ["modality"],
      _count: {
        modality: true,
      },
    });

    // Get case summary data based on date range
    const now = new Date();
    let startDate: Date;
    let groupingFunction: (date: Date) => string;

    switch (dateRange) {
      case 'weekly':
        // Last 8 weeks
        startDate = new Date(now);
        startDate.setDate(now.getDate() - (8 * 7));
        groupingFunction = (date: Date) => {
          const weekStart = new Date(date);
          weekStart.setDate(date.getDate() - date.getDay()); // Start of week (Sunday)
          return `Week ${weekStart.getMonth() + 1}/${weekStart.getDate()}`;
        };
        break;
      case 'quarterly':
        // Last 8 quarters (2 years)
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - (8 * 3));
        groupingFunction = (date: Date) => {
          const quarter = Math.floor(date.getMonth() / 3) + 1;
          return `Q${quarter} ${date.getFullYear()}`;
        };
        break;
      case 'monthly':
      default:
        // Last 6 months
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 6);
        groupingFunction = (date: Date) => {
          return date.toLocaleDateString("en-US", {
            month: "short",
            year: "numeric"
          });
        };
        break;
    }

    const caseSummaryData = await db.case.findMany({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
      select: {
        createdAt: true,
        activeCase: true,
        completedCase: true,
        reviewCase: true,
      },
    });

    // Group cases by the selected period
    const periodData = caseSummaryData.reduce((acc, case_) => {
      const period = groupingFunction(case_.createdAt);
      
      if (!acc[period]) {
        acc[period] = { 
          period, 
          reported: 0, 
          active: 0, 
          underReview: 0,
          date: case_.createdAt // Store first date for sorting
        };
      }

      if (case_.completedCase) {
        acc[period].reported += 1;
      }

      if (case_.activeCase) {
        acc[period].active += 1;
      }

      if (case_.reviewCase) {
        acc[period].underReview += 1;
      }

      return acc;
    }, {} as Record<string, { 
      period: string; 
      reported: number; 
      active: number; 
      underReview: number;
      date: Date;
    }>);

    // Convert to array and sort by date
    const caseData = Object.values(periodData)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .map(({ period, reported, active, underReview }) => ({
        [dateRange === 'weekly' ? 'week' : dateRange === 'quarterly' ? 'quarter' : 'month']: period,
        reported,
        active,
        underReview
      }));

    // FIXED: Get turnaround time data for the last 30 days with proper string date handling
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentCasesWithTurnaround = await db.case.findMany({
      where: {
        AND: [
          { reportTime: { not: null } },
          { reportTime: { not: "" } },
          { caseUploadTime: { not: null } },
          { caseUploadTime: { not: "" } },
          { createdAt: { gte: thirtyDaysAgo } }, // Use createdAt for filtering recent cases
        ],
      },
      select: {
        createdAt: true,
        caseUploadTime: true,
        reportTime: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Create a map for the last 7 days with proper day names
    const last7Days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      last7Days.push({
        date: date.toISOString().split('T')[0], // YYYY-MM-DD format
        dayName: date.toLocaleDateString("en-US", { weekday: "short" }),
        cases: []
      });
    }

    // Group cases by actual date (not just day of week) - FIXED for string dates
    const dailyTurnaroundMap = new Map<string, number[]>();
    
    recentCasesWithTurnaround.forEach(case_ => {
      if (case_.caseUploadTime && case_.reportTime) {
        try {
          // Parse string dates
          const uploadTime = new Date(case_.caseUploadTime);
          const reportTime = new Date(case_.reportTime);
          
          // Check if dates are valid
          if (!isNaN(uploadTime.getTime()) && !isNaN(reportTime.getTime())) {
            const reportDate = reportTime.toISOString().split('T')[0];
            const diffInHours = (reportTime.getTime() - uploadTime.getTime()) / (1000 * 60 * 60);
            
            // Only add positive turnaround times
            if (diffInHours > 0) {
              if (!dailyTurnaroundMap.has(reportDate)) {
                dailyTurnaroundMap.set(reportDate, []);
              }
              dailyTurnaroundMap.get(reportDate)!.push(diffInHours);
            }
          }
        } catch (error) {
          console.error("Error parsing dates for case:", error);
        }
      }
    });

    // Calculate average turnaround time for each of the last 7 days
    const turnaroundTimeData = last7Days.map(dayInfo => {
      const casesForDay = dailyTurnaroundMap.get(dayInfo.date) || [];
      const averageTime = casesForDay.length > 0
        ? casesForDay.reduce((sum: number, time: number) => sum + time, 0) / casesForDay.length
        : 0;
      
      return {
        day: dayInfo.dayName,
        time: Math.round(averageTime * 100) / 100,
        caseCount: casesForDay.length
      };
    });

    // Alternative: Weekly average turnaround time by day of week - FIXED for string dates
    const weeklyTurnaroundData = recentCasesWithTurnaround.reduce(
      (acc, case_) => {
        if (case_.caseUploadTime && case_.reportTime) {
          try {
            // Parse string dates
            const uploadTime = new Date(case_.caseUploadTime);
            const reportTime = new Date(case_.reportTime);
            
            // Check if dates are valid
            if (!isNaN(uploadTime.getTime()) && !isNaN(reportTime.getTime())) {
              const dayOfWeek = reportTime.toLocaleDateString("en-US", {
                weekday: "short",
              });
              
              if (!acc[dayOfWeek]) {
                acc[dayOfWeek] = { day: dayOfWeek, times: [] };
              }
              
              const diffInHours = (reportTime.getTime() - uploadTime.getTime()) / (1000 * 60 * 60);
              
              // Only add positive turnaround times
              if (diffInHours > 0) {
                acc[dayOfWeek].times.push(diffInHours);
              }
            }
          } catch (error) {
            console.error("Error parsing dates for weekly data:", error);
          }
        }
        
        return acc;
      },
      {} as Record<string, { day: string; times: number[] }>
    );

    // Convert weekly data to format expected by chart
    const weeklyTurnaroundTimeData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => {
      const dayData = weeklyTurnaroundData[day];
      const averageTime = dayData && dayData.times.length > 0
        ? dayData.times.reduce((sum: number, time: number) => sum + time, 0) / dayData.times.length
        : 0;
      
      return {
        day,
        time: Math.round(averageTime * 100) / 100,
        caseCount: dayData ? dayData.times.length : 0
      };
    });

    // Format priority breakdown for frontend
    const formattedPriorityData = priorityBreakdown.map((item) => ({
      name: item.priority,
      value: item._count.priority,
    }));

    // Format modality breakdown for frontend
    const formattedModalityData = modalityBreakdown.map((item) => ({
      name: item.modality,
      value: item._count.modality,
    }));

    // Debug logging
    console.log(`Dashboard Stats Debug Info (${dateRange}):`);
    console.log("Cases with turnaround time:", casesWithTurnaroundTime.length);
    console.log("Average turnaround time:", averageTurnaroundTime);
    console.log("Case data periods:", caseData.length);
    console.log("Date range:", dateRange);

    return NextResponse.json(
      {
        totalActiveCases,
        urgentCases,
        totalCases,
        completedCases,
        reviewCases,
        lockedCases,
        averageTurnaroundTime: Math.round(averageTurnaroundTime * 100) / 100,
        priorityBreakdown: formattedPriorityData,
        modalityBreakdown: formattedModalityData,
        caseData,
        turnaroundTimeData, // Daily data for last 7 days
        weeklyTurnaroundTimeData, // Weekly average by day of week (more stable)
        dateRange, // Return the date range for frontend reference
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      {
        message: "Error fetching dashboard statistics",
        error: error instanceof Error ? error.message : error,
      },
      { status: 500 }
    );
  }
}