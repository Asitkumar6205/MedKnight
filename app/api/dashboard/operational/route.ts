// app/api/dashboard/operational/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateRange = searchParams.get('dateRange') || 'monthly';

    // Calculate date ranges based on selection
    const now = new Date();
    let startDate: Date;
    let groupingFunction: (date: Date) => string;
    let periodCount: number;

    switch (dateRange) {
      case 'yearly':
        startDate = new Date(now);
        startDate.setFullYear(now.getFullYear() - 3);
        periodCount = 3;
        groupingFunction = (date: Date) => date.getFullYear().toString();
        break;
      case 'quarterly':
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - (8 * 3));
        periodCount = 8;
        groupingFunction = (date: Date) => {
          const quarter = Math.floor(date.getMonth() / 3) + 1;
          return `Q${quarter} ${date.getFullYear()}`;
        };
        break;
      case 'monthly':
      default:
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 6);
        periodCount = 6;
        groupingFunction = (date: Date) => {
          return date.toLocaleDateString("en-US", {
            month: "short",
            year: "2-digit"
          });
        };
        break;
    }

    // 1. Case Urgency Distribution Over Time
    const urgencyCases = await db.case.findMany({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
      select: {
        createdAt: true,
        priority: true,
      },
    });

    // Group urgency data by time period
    const urgencyGrouped = urgencyCases.reduce((acc, case_) => {
      const period = groupingFunction(case_.createdAt);
      
      if (!acc[period]) {
        acc[period] = { 
          month: period, 
          urgent: 0, 
          high: 0, 
          medium: 0,
          date: case_.createdAt
        };
      }

      switch (case_.priority) {
        case 'Stat':
          acc[period].urgent += 1;
          break;
        case 'Urgent':
          acc[period].high += 1;
          break;
        case 'Routine':
          acc[period].medium += 1;
          break;
      }

      return acc;
    }, {} as Record<string, { 
      month: string; 
      urgent: number; 
      high: number; 
      medium: number;
      date: Date;
    }>);

    const caseUrgencyTrendData = Object.values(urgencyGrouped)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .map(({ month, urgent, high, medium }) => ({ month, urgent, high, medium }));

    // 2. Average Wait Times by Priority
    const casesWithTurnaround = await db.case.findMany({
      where: {
        AND: [
          { caseUploadTime: { not: null } },
          { reportTime: { not: null } },
          { caseUploadTime: { not: "" } },
          { reportTime: { not: "" } },
        ],
      },
      select: {
        priority: true,
        caseUploadTime: true,
        reportTime: true,
      },
    });

    // Calculate average wait time by priority
    const waitTimesByPriority = casesWithTurnaround.reduce((acc, case_) => {
      if (case_.caseUploadTime && case_.reportTime) {
        try {
          const uploadTime = new Date(case_.caseUploadTime);
          const reportTime = new Date(case_.reportTime);
          
          if (!isNaN(uploadTime.getTime()) && !isNaN(reportTime.getTime())) {
            const diffInHours = (reportTime.getTime() - uploadTime.getTime()) / (1000 * 60 * 60);
            
            if (diffInHours > 0) {
              if (!acc[case_.priority]) {
                acc[case_.priority] = [];
              }
              acc[case_.priority].push(diffInHours);
            }
          }
        } catch (error) {
          console.error("Error parsing dates for wait time:", error);
        }
      }
      return acc;
    }, {} as Record<string, number[]>);

    const waitTimeData = Object.entries(waitTimesByPriority).map(([priority, times]) => ({
      priority,
      avgTime: Math.round((times.reduce((sum, time) => sum + time, 0) / times.length) * 100) / 100,
    }));

    // 3. Peak Usage Times (cases created by hour over last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentCases = await db.case.findMany({
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
      select: {
        createdAt: true,
      },
    });

    // Group by hour
    const hourlyUsage = recentCases.reduce((acc, case_) => {
      const hour = case_.createdAt.getHours();
      const hourLabel = hour === 0 ? "12am" 
        : hour === 12 ? "12pm"
        : hour < 12 ? `${hour}am` 
        : `${hour - 12}pm`;
      
      acc[hourLabel] = (acc[hourLabel] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Create structured peak usage data for all 24 hours
    const allHours = [
      "12am", "1am", "2am", "3am", "4am", "5am", "6am", "7am", "8am", "9am", "10am", "11am",
      "12pm", "1pm", "2pm", "3pm", "4pm", "5pm", "6pm", "7pm", "8pm", "9pm", "10pm", "11pm"
    ];

    const peakUsageData = allHours.map(hour => ({
      hour,
      cases: hourlyUsage[hour] || 0,
    }));

    // 4. Subspeciality Case Distribution (last 30 days)
    // Assuming you have a subspeciality field in your case model
    // If not, you might need to derive this from studyDescription or modality
    const subspecialityCases = await db.case.findMany({
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
      select: {
        studyDescription: true,
        modality: true,
      },
    });

    // Map modalities or study descriptions to subspecialities
    // You'll need to adjust this mapping based on your actual data structure
    const modalityToSubspeciality: Record<string, string> = {
      'MRI': 'Neuroradiology',
      'CT': 'Chest',
      'X-Ray': 'Musculoskeletal',
      'Ultrasound': 'Abdominal',
      'Mammography': 'Breast Imaging',
      'Nuclear Medicine': 'Nuclear Medicine',
    };

    const subspecialityCount = subspecialityCases.reduce((acc, case_) => {
      // Try to map modality to subspeciality, or use a default approach
      let subspeciality = modalityToSubspeciality[case_.modality] || case_.modality;
      
      // If you have a more sophisticated mapping based on studyDescription, add it here
      if (case_.studyDescription) {
        const description = case_.studyDescription.toLowerCase();
        if (description.includes('brain') || description.includes('neuro')) {
          subspeciality = 'Neuroradiology';
        } else if (description.includes('chest') || description.includes('lung')) {
          subspeciality = 'Chest';
        } else if (description.includes('abdomen') || description.includes('liver')) {
          subspeciality = 'Abdominal';
        } else if (description.includes('bone') || description.includes('joint')) {
          subspeciality = 'Musculoskeletal';
        } else if (description.includes('heart') || description.includes('cardiac')) {
          subspeciality = 'Cardiac';
        }
      }
      
      acc[subspeciality] = (acc[subspeciality] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const subspecialityData = Object.entries(subspecialityCount)
      .map(([subspeciality, cases]) => ({
        subspeciality,
        cases,
        availability: 85 + Math.random() * 15 // Mock availability percentage for now
      }))
      .sort((a, b) => b.cases - a.cases); // Sort by case count descending

    console.log("Operational Dashboard Debug:");
    console.log("Date range:", dateRange);
    console.log("Urgency trend periods:", caseUrgencyTrendData.length);
    console.log("Wait time priorities:", waitTimeData.length);
    console.log("Peak usage hours:", peakUsageData.length);
    console.log("Subspecialities:", subspecialityData.length);

    return NextResponse.json(
      {
        caseUrgencyTrendData,
        waitTimeData,
        peakUsageData,
        subspecialityData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching operational dashboard data:", error);
    return NextResponse.json(
      {
        message: "Error fetching operational dashboard data",
        error: error instanceof Error ? error.message : error,
      },
      { status: 500 }
    );
  }
}