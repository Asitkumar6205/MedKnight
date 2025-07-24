// app/api/dashboard/turnaround/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateRange = searchParams.get('dateRange') || 'weekly';
    const modality = searchParams.get('modality') || 'all';
    const view = searchParams.get('view') || 'daily';

    // Calculate date range based on filter
    const now = new Date();
    let startDate: Date;
    let periodCount: number;

    switch (dateRange) {
      case 'weekly':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - (8 * 7)); // 8 weeks
        periodCount = 8;
        break;
      case 'monthly':
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 12); // 12 months
        periodCount = 12;
        break;
      case 'quarterly':
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - (8 * 3)); // 8 quarters (2 years)
        periodCount = 8;
        break;
      default:
        startDate = new Date(now);
        startDate.setDate(now.getDate() - (8 * 7));
        periodCount = 8;
    }

    // Build where clause for modality filter
    const whereClause: any = {
      AND: [
        { reportTime: { not: null } },
        { reportTime: { not: "" } },
        { caseUploadTime: { not: null } },
        { caseUploadTime: { not: "" } },
        { createdAt: { gte: startDate } },
      ],
    };

    // Add modality filter if not "all"
    if (modality !== 'all') {
      whereClause.AND.push({ modality: modality });
    }

    // Fetch cases with turnaround time data
    const casesWithTurnaround = await db.case.findMany({
      where: whereClause,
      select: {
        createdAt: true,
        caseUploadTime: true,
        reportTime: true,
        modality: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Helper function to calculate turnaround time in hours
    const calculateTurnaroundHours = (uploadTime: string, reportTime: string): number | null => {
      try {
        const upload = new Date(uploadTime);
        const report = new Date(reportTime);
        
        if (!isNaN(upload.getTime()) && !isNaN(report.getTime())) {
          const diffInHours = (report.getTime() - upload.getTime()) / (1000 * 60 * 60);
          return diffInHours > 0 ? diffInHours : null;
        }
      } catch (error) {
        console.error("Error parsing dates:", error);
      }
      return null;
    };

    let turnaroundTimeData: any[] = [];
    let weeklyTurnaroundTimeData: any[] = [];

    if (view === 'daily') {
      // Generate daily data based on date range
      if (dateRange === 'weekly') {
        // Last 7 days
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
          const date = new Date(now);
          date.setDate(now.getDate() - i);
          last7Days.push({
            date: date.toISOString().split('T')[0],
            dayName: date.toLocaleDateString("en-US", { weekday: "short" }),
          });
        }

        const dailyTurnaroundMap = new Map<string, number[]>();
        
        casesWithTurnaround.forEach(case_ => {
          if (case_.caseUploadTime && case_.reportTime) {
            const turnaroundHours = calculateTurnaroundHours(case_.caseUploadTime, case_.reportTime);
            if (turnaroundHours !== null) {
              const reportDate = new Date(case_.reportTime).toISOString().split('T')[0];
              if (!dailyTurnaroundMap.has(reportDate)) {
                dailyTurnaroundMap.set(reportDate, []);
              }
              dailyTurnaroundMap.get(reportDate)!.push(turnaroundHours);
            }
          }
        });

        turnaroundTimeData = last7Days.map(dayInfo => {
          const casesForDay = dailyTurnaroundMap.get(dayInfo.date) || [];
          const averageTime = casesForDay.length > 0
            ? casesForDay.reduce((sum, time) => sum + time, 0) / casesForDay.length
            : 0;
          
          return {
            day: dayInfo.dayName,
            time: Math.round(averageTime * 100) / 100,
            caseCount: casesForDay.length
          };
        });
      } else if (dateRange === 'monthly') {
        // Last 12 months - daily averages by month
        const monthlyData = new Map<string, number[]>();
        
        casesWithTurnaround.forEach(case_ => {
          if (case_.caseUploadTime && case_.reportTime) {
            const turnaroundHours = calculateTurnaroundHours(case_.caseUploadTime, case_.reportTime);
            if (turnaroundHours !== null) {
              const reportDate = new Date(case_.reportTime);
              const monthKey = reportDate.toLocaleDateString("en-US", {
                month: "short",
                year: "numeric"
              });
              
              if (!monthlyData.has(monthKey)) {
                monthlyData.set(monthKey, []);
              }
              monthlyData.get(monthKey)!.push(turnaroundHours);
            }
          }
        });

        // Generate last 12 months
        const months = [];
        for (let i = 11; i >= 0; i--) {
          const date = new Date(now);
          date.setMonth(now.getMonth() - i);
          const monthKey = date.toLocaleDateString("en-US", {
            month: "short",
            year: "numeric"
          });
          months.push(monthKey);
        }

        turnaroundTimeData = months.map(month => {
          const casesForMonth = monthlyData.get(month) || [];
          const averageTime = casesForMonth.length > 0
            ? casesForMonth.reduce((sum, time) => sum + time, 0) / casesForMonth.length
            : 0;
          
          return {
            day: month,
            time: Math.round(averageTime * 100) / 100,
            caseCount: casesForMonth.length
          };
        });
      } else if (dateRange === 'quarterly') {
        // Last 8 quarters - daily averages by quarter
        const quarterlyData = new Map<string, number[]>();
        
        casesWithTurnaround.forEach(case_ => {
          if (case_.caseUploadTime && case_.reportTime) {
            const turnaroundHours = calculateTurnaroundHours(case_.caseUploadTime, case_.reportTime);
            if (turnaroundHours !== null) {
              const reportDate = new Date(case_.reportTime);
              const quarter = Math.floor(reportDate.getMonth() / 3) + 1;
              const quarterKey = `Q${quarter} ${reportDate.getFullYear()}`;
              
              if (!quarterlyData.has(quarterKey)) {
                quarterlyData.set(quarterKey, []);
              }
              quarterlyData.get(quarterKey)!.push(turnaroundHours);
            }
          }
        });

        // Generate last 8 quarters
        const quarters = [];
        for (let i = 7; i >= 0; i--) {
          const date = new Date(now);
          date.setMonth(now.getMonth() - (i * 3));
          const quarter = Math.floor(date.getMonth() / 3) + 1;
          const quarterKey = `Q${quarter} ${date.getFullYear()}`;
          quarters.push(quarterKey);
        }

        turnaroundTimeData = quarters.map(quarter => {
          const casesForQuarter = quarterlyData.get(quarter) || [];
          const averageTime = casesForQuarter.length > 0
            ? casesForQuarter.reduce((sum, time) => sum + time, 0) / casesForQuarter.length
            : 0;
          
          return {
            day: quarter,
            time: Math.round(averageTime * 100) / 100,
            caseCount: casesForQuarter.length
          };
        });
      }
    } else {
      // Weekly view - average by day of week
      const weeklyTurnaroundMap = casesWithTurnaround.reduce((acc, case_) => {
        if (case_.caseUploadTime && case_.reportTime) {
          const turnaroundHours = calculateTurnaroundHours(case_.caseUploadTime, case_.reportTime);
          if (turnaroundHours !== null) {
            const reportDate = new Date(case_.reportTime);
            const dayOfWeek = reportDate.toLocaleDateString("en-US", {
              weekday: "short",
            });
            
            if (!acc[dayOfWeek]) {
              acc[dayOfWeek] = { day: dayOfWeek, times: [] };
            }
            acc[dayOfWeek].times.push(turnaroundHours);
          }
        }
        return acc;
      }, {} as Record<string, { day: string; times: number[] }>);

      // Convert to format expected by chart
      weeklyTurnaroundTimeData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => {
        const dayData = weeklyTurnaroundMap[day];
        const averageTime = dayData && dayData.times.length > 0
          ? dayData.times.reduce((sum, time) => sum + time, 0) / dayData.times.length
          : 0;
        
        return {
          day,
          time: Math.round(averageTime * 100) / 100,
          caseCount: dayData ? dayData.times.length : 0
        };
      });
    }

    // Debug logging
    console.log(`Turnaround Time Debug Info:`);
    console.log(`Date Range: ${dateRange}, Modality: ${modality}, View: ${view}`);
    console.log(`Cases found: ${casesWithTurnaround.length}`);
    console.log(`Data points: ${view === 'daily' ? turnaroundTimeData.length : weeklyTurnaroundTimeData.length}`);

    return NextResponse.json({
      turnaroundTimeData,
      weeklyTurnaroundTimeData,
      filters: {
        dateRange,
        modality,
        view
      },
      totalCases: casesWithTurnaround.length
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching turnaround data:", error);
    return NextResponse.json(
      {
        message: "Error fetching turnaround time data",
        error: error instanceof Error ? error.message : error,
      },
      { status: 500 }
    );
  }
}