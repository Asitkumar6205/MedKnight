"use client";
import React, { useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Clock,
  DollarSign,
  Activity,
  FileText,
  Users,
  AlertTriangle,
  BarChart2,
  Clipboard,
  Award,
  PieChart as PieChartIcon,
  Filter,
  Download,
  Bell,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { User as UserIcon } from "lucide-react";
import UserInfo from "./UserInfo";
import AdminDashboard from "./AdminDashboard";
import Link from "next/link";

interface ChartData {
  name: string;
  value: number;
}

interface ChartDataWithPercentage extends ChartData {
  percentage: string;
}

interface TurnaroundTimeData {
  day: string;
  time: number;
  caseCount?: number;
}

interface CaseData {
  month?: string;
  week?: string;
  quarter?: string;
  reported: number;
  active: number;
  underReview: number;
}

interface OperationalData {
  caseUrgencyTrendData: Array<{
    month: string;
    urgent: number;
    high: number;
    medium: number;
  }>;
  waitTimeData: Array<{
    priority: string;
    avgTime: number;
  }>;
  peakUsageData: Array<{
    hour: string;
    cases: number;
  }>;
  subspecialityData: Array<{
    subspeciality: string;
    cases: number;
    availability: number;
  }>;
}

interface DashboardData {
  totalActiveCases: number;
  urgentCases: number;
  totalCases: number;
  completedCases: number;
  reviewCases: number;
  loading: boolean;
  averageTurnaroundTime: number;
  lockedCases?: number;
  priorityBreakdown?: ChartData[];
  modalityBreakdown?: ChartData[];
  caseData?: CaseData[];
  turnaroundTimeData?: TurnaroundTimeData[];
  weeklyTurnaroundTimeData?: TurnaroundTimeData[];
  dateRange?: string;
  operationalData?: OperationalData;
}

interface CaseDataItem {
  id: string;
  patientId: string;
  patientName: string;
  studyDescription: string;
  modality: string;
  priority: "Stat" | "Urgent" | "Routine";
  doctor: string;
  createdAt: string;
  activeCase: boolean;
  isLocked: boolean;
  lockedAt?: string;
  lockedByUser?: {
    id: string;
    name?: string;
    username?: string;
  };
}

const caseUrgencyTrendData = [
  { month: "Jan", urgent: 15, high: 25, medium: 65, low: 40 },
  { month: "Feb", urgent: 18, high: 22, medium: 58, low: 34 },
  { month: "Mar", urgent: 22, high: 29, medium: 62, low: 38 },
  { month: "Apr", urgent: 19, high: 31, medium: 70, low: 44 },
  { month: "May", urgent: 23, high: 33, medium: 75, low: 47 },
  { month: "Jun", urgent: 20, high: 28, medium: 68, low: 46 },
];

const waitTimeData = [
  { priority: "Stat", avgTime: 0.5 },
  { priority: "Urgent", avgTime: 1.2 },
  { priority: "Routine", avgTime: 6.2 },
];

const peakUsageData = [
  { hour: "6am", cases: 5 },
  { hour: "8am", cases: 12 },
  { hour: "10am", cases: 25 },
  { hour: "12pm", cases: 18 },
  { hour: "2pm", cases: 22 },
  { hour: "4pm", cases: 19 },
  { hour: "6pm", cases: 15 },
  { hour: "8pm", cases: 10 },
  { hour: "10pm", cases: 7 },
  { hour: "12am", cases: 3 },
];

const subspecialityData = [
  { subspeciality: "Neuroradiology", cases: 32, availability: 85 },
  { subspeciality: "Musculoskeletal", cases: 45, availability: 92 },
  { subspeciality: "Abdominal", cases: 38, availability: 78 },
  { subspeciality: "Chest", cases: 29, availability: 90 },
  { subspeciality: "Cardiac", cases: 18, availability: 75 },
];

const financialData = [
  { month: "Jan", cost: 15600, revenue: 22400 },
  { month: "Feb", cost: 14800, revenue: 20900 },
  { month: "Mar", cost: 16200, revenue: 24300 },
  { month: "Apr", cost: 17400, revenue: 26100 },
  { month: "May", cost: 18200, revenue: 28400 },
  { month: "Jun", cost: 16800, revenue: 25600 },
];

const radiologistPerformanceData = [
  { name: "Dr. Smith", satisfaction: 4.8, accuracy: 4.9, turnaround: 4.7 },
  { name: "Dr. Johnson", satisfaction: 4.6, accuracy: 4.8, turnaround: 4.9 },
  { name: "Dr. Williams", satisfaction: 4.9, accuracy: 4.7, turnaround: 4.6 },
  { name: "Dr. Brown", satisfaction: 4.7, accuracy: 4.6, turnaround: 4.8 },
];

const patientTimelineData = [
  { stage: "Scan Completed", avgTime: 0 },
  { stage: "Case Uploaded", avgTime: 0.5 },
  { stage: "Radiologist Assigned", avgTime: 0.8 },
  { stage: "Report Generated", avgTime: 3.2 },
  { stage: "Report Available to Patient", avgTime: 3.5 },
];

const incidentalFindingsData = [
  { month: "Jan", count: 18, followedUp: 15 },
  { month: "Feb", count: 22, followedUp: 19 },
  { month: "Mar", count: 25, followedUp: 23 },
  { month: "Apr", count: 20, followedUp: 17 },
  { month: "May", count: 24, followedUp: 21 },
  { month: "Jun", count: 27, followedUp: 24 },
];

const aiTriageMetricsData = [
  { month: "Jan", withAI: 24, withoutAI: 42 },
  { month: "Feb", withAI: 22, withoutAI: 44 },
  { month: "Mar", withAI: 21, withoutAI: 45 },
  { month: "Apr", withAI: 19, withoutAI: 46 },
  { month: "May", withAI: 18, withoutAI: 47 },
  { month: "Jun", withAI: 17, withoutAI: 48 },
];

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
];

export default function UserDashboard() {
  const { data: session, status } = useSession({ required: true });
  const [user, setUser] = useState<{
    image: string;
    name: string;
    role?: string;
    email?: string;
  } | null>(null);

  const [isUserInfoOpen, setIsUserInfoOpen] = useState(false);
  const [turnaroundTimeView, setTurnaroundTimeView] = useState<
    "daily" | "weekly"
  >("daily");
  const [turnaroundDateRange, setTurnaroundDateRange] = useState<
    "weekly" | "monthly" | "quarterly"
  >("weekly");
  const [turnaroundModality, setTurnaroundModality] = useState<string>("all");

  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalActiveCases: 0,
    urgentCases: 0,
    totalCases: 0,
    completedCases: 0,
    reviewCases: 0,
    loading: true,
    averageTurnaroundTime: 0,
    lockedCases: 0,
    priorityBreakdown: [],
    modalityBreakdown: [],
    caseData: [],
    turnaroundTimeData: [],
    weeklyTurnaroundTimeData: [],
    dateRange: "monthly",
    operationalData: undefined,
  });

  const [cases, setCases] = useState<CaseDataItem[]>([]);
  const [dateRange, setDateRange] = useState("monthly");
  const [operationalDateRange, setOperationalDateRange] = useState("monthly");

  useEffect(() => {
    const fetchOperationalData = async () => {
      try {
        const response = await fetch(
          `/api/dashboard/operational?dateRange=${operationalDateRange}`
        );
        const data = await response.json();

        if (response.ok) {
          setDashboardData((prev) => ({
            ...prev,
            operationalData: data,
          }));
        } else {
          console.log("Error fetching operational data:", data.message);
        }
      } catch (error) {
        console.error("Error fetching operational data:", error);
      }
    };

    fetchOperationalData();
  }, [operationalDateRange]);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setDashboardData((prev) => ({ ...prev, loading: true }));

        const response = await fetch(
          `/api/dashboard/stats?dateRange=${dateRange}`
        );
        const data = await response.json();

        if (response.ok) {
          setDashboardData({
            totalActiveCases: data.totalActiveCases || 0,
            urgentCases: data.urgentCases || 0,
            totalCases: data.totalCases || 0,
            completedCases: data.completedCases || 0,
            reviewCases: data.reviewCases || 0,
            loading: false,
            averageTurnaroundTime: data.averageTurnaroundTime || 0,
            lockedCases: data.lockedCases || 0,
            priorityBreakdown: data.priorityBreakdown || [],
            modalityBreakdown: data.modalityBreakdown || [],
            caseData: data.caseData || [],
            turnaroundTimeData: data.turnaroundTimeData || [],
            weeklyTurnaroundTimeData: data.weeklyTurnaroundTimeData || [],
            dateRange: data.dateRange || dateRange, // Fixed: now matches interface
          });
        } else {
          console.log("Error fetching dashboard data:", data.message);
          setDashboardData((prev) => ({ ...prev, loading: false }));
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setDashboardData((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchDashboardData();
  }, [dateRange]);

  // Function to get the appropriate dataKey for X-axis based on date range
  const getXAxisDataKey = () => {
    switch (dateRange) {
      case "weekly":
        return "week";
      case "quarterly":
        return "quarter";
      case "monthly":
      default:
        return "month";
    }
  };

  // Function to get chart title based on date range
  const getChartTitle = () => {
    switch (dateRange) {
      case "weekly":
        return "Weekly Case Summary (Last 8 Weeks)";
      case "quarterly":
        return "Quarterly Case Summary (Last 8 Quarters)";
      case "monthly":
      default:
        return "Monthly Case Summary (Last 6 Months)";
    }
  };

  // Export function for CSV download
  const exportToCSV = () => {
    // Fixed: Added null check and proper typing
    const caseData = dashboardData.caseData || [];
    if (caseData.length === 0) {
      console.warn("No data to export");
      return;
    }

    const csvData = caseData.map((item) => ({
      Period: item.month || item.week || item.quarter || "",
      "Reported Cases": item.reported,
      "Active Cases": item.active,
      "Under Review": item.underReview,
    }));

    const csvContent = [
      Object.keys(csvData[0]).join(","),
      ...csvData.map((row) => Object.values(row).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `case-summary-${dateRange}-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Fetch recent cases
  useEffect(() => {
    const fetchCases = async () => {
      try {
        const response = await fetch("/api/getCases");
        const data = await response.json();
        setCases(data.cases || []);
      } catch (error) {
        console.error("Error fetching cases:", error);
      }
    };

    fetchCases();
  }, []);

  const formatTurnaroundTime = (hours: number) => {
    if (hours === 0) return "N/A";
    if (hours < 1) {
      const minutes = Math.round(hours * 60);
      return `${minutes} min`;
    }
    if (hours < 24) {
      return `${hours.toFixed(1)} hours`;
    } else {
      const days = Math.floor(hours / 24);
      const remainingHours = hours % 24;
      if (remainingHours < 1) {
        return `${days} day${days !== 1 ? "s" : ""}`;
      }
      return `${days}d ${remainingHours.toFixed(1)}h`;
    }
  };

  const getTurnaroundChartTitle = () => {
    const baseTitle = "Average Turnaround Time";
    const rangeText =
      turnaroundDateRange === "weekly"
        ? "Weekly"
        : turnaroundDateRange === "monthly"
        ? "Monthly"
        : "Quarterly";
    const viewText = turnaroundTimeView === "daily" ? "Daily" : "Weekly";
    const modalityText =
      turnaroundModality === "all" ? "All Modalities" : turnaroundModality;

    return `${baseTitle} - ${rangeText} ${viewText} (${modalityText})`;
  };

  const getTurnaroundXAxisLabel = () => {
    if (turnaroundTimeView === "weekly") {
      return "Day of Week";
    }

    switch (turnaroundDateRange) {
      case "weekly":
        return "Day";
      case "monthly":
        return "Month";
      case "quarterly":
        return "Quarter";
      default:
        return "Period";
    }
  };

  // Enhanced getCurrentTurnaroundData function
  const getCurrentTurnaroundData = () => {
    if (turnaroundTimeView === "weekly") {
      return dashboardData.weeklyTurnaroundTimeData || [];
    }
    return dashboardData.turnaroundTimeData || [];
  };

  // Function to get summary statistics
  const getTurnaroundSummary = () => {
    const data = getCurrentTurnaroundData();

    if (!data || data.length === 0) {
      return { avg: 0, min: 0, max: 0, totalCases: 0 };
    }

    const validData = data.filter((d) => d.time > 0);
    const times = validData.map((d) => d.time);
    const totalCases = data.reduce((sum, d) => sum + (d.caseCount || 0), 0);

    if (times.length === 0) {
      return { avg: 0, min: 0, max: 0, totalCases };
    }

    const avg = times.reduce((sum, time) => sum + time, 0) / times.length;
    const min = Math.min(...times);
    const max = Math.max(...times);

    return {
      avg: Math.round(avg * 100) / 100,
      min: Math.round(min * 100) / 100,
      max: Math.round(max * 100) / 100,
      totalCases,
    };
  };

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      setUser({
        image: session.user.image || "",
        name: session.user.name || (session.user.username as string),
        role: session.user.role || "",
        email: session.user.email || "",
      });
    }
  }, [session, status]);

  // Calculate percentages for labels
  const calculatePercentages = (
    data: ChartData[]
  ): ChartDataWithPercentage[] => {
    const total = data.reduce(
      (sum: number, item: ChartData) => sum + item.value,
      0
    );
    return data.map((item: ChartData) => ({
      ...item,
      percentage: total > 0 ? ((item.value / total) * 100).toFixed(0) : "0",
    }));
  };

  // Custom tooltip for turnaround time chart
  const TurnaroundTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
          <p className="font-semibold text-gray-800">{label}</p>
          <p className="text-blue-600 font-medium">
            Avg. Time: {formatTurnaroundTime(data.time)}
          </p>
          {data.caseCount !== undefined && (
            <p className="text-gray-600 text-sm">
              Cases: {data.caseCount} {data.caseCount === 1 ? "case" : "cases"}
            </p>
          )}
          {turnaroundModality !== "all" && (
            <p className="text-purple-600 text-sm">
              Modality: {turnaroundModality}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  // Toggle the user info modal
  const toggleUserInfo = () => {
    setIsUserInfoOpen(!isUserInfoOpen);
  };

  const [activeTab, setActiveTab] = useState("overview");
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    {
      id: 1,
      text: "Critical case #4582 needs urgent review",
      time: "10 minutes ago",
      type: "urgent",
    },
    {
      id: 2,
      text: "Dr. Johnson completed 12 reports today",
      time: "1 hour ago",
      type: "info",
    },
    {
      id: 3,
      text: "System maintenance scheduled for tonight at 2 AM",
      time: "2 hours ago",
      type: "warning",
    },
    {
      id: 4,
      text: "New billing report available for review",
      time: "Yesterday",
      type: "info",
    },
  ];

  const renderNotifications = () => (
    <div
      className={`absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-10 ${
        showNotifications ? "block" : "hidden"
      }`}
    >
      <div className="p-3 border-b border-gray-200">
        <h3 className="text-lg font-semibold">Notifications</h3>
      </div>
      <div className="max-h-80 overflow-y-auto">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="p-3 border-b border-gray-100 hover:bg-gray-50"
          >
            <div className="flex items-start">
              <div
                className={`h-2 w-2 mt-1.5 mr-2 rounded-full ${
                  notification.type === "urgent"
                    ? "bg-red-500"
                    : notification.type === "warning"
                    ? "bg-yellow-500"
                    : "bg-blue-500"
                }`}
              ></div>
              <div>
                <p className="text-sm text-gray-800">{notification.text}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {notification.time}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="p-3 border-t border-gray-200 text-center">
        <button className="text-sm text-blue-500 hover:text-blue-700">
          Mark all as read
        </button>
      </div>
    </div>
  );

  const renderOverviewTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Case Summary Card */}
      <div className="bg-white rounded-lg shadow p-4 col-span-1 lg:col-span-2">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <FileText className="mr-2 text-blue-500" />
            <h3 className="text-lg font-semibold">{getChartTitle()}</h3>
          </div>
          <div className="flex space-x-2">
            <select
              className="bg-gray-100 text-sm rounded-lg p-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setDateRange(e.target.value)}
              value={dateRange}
              disabled={dashboardData.loading}
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
            </select>
            <button
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={exportToCSV}
              disabled={
                dashboardData.loading ||
                !dashboardData.caseData ||
                dashboardData.caseData.length === 0
              }
              title="Export to CSV"
            >
              <Download size={16} />
            </button>
          </div>
        </div>

        {dashboardData.loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : !dashboardData.caseData || dashboardData.caseData.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-gray-500">
            No data available for the selected period
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={dashboardData.caseData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey={getXAxisDataKey()}
                fontSize={12}
                angle={0}
                textAnchor="middle"
                height={30}
              />
              <YAxis allowDecimals={false} fontSize={12} />
              <Tooltip
                formatter={(value: number, name: string) => [value, name]}
                labelFormatter={(label) => {
                  switch (dateRange) {
                    case "weekly":
                      return `Week of ${label}`;
                    case "quarterly":
                      return `Quarter ${label}`;
                    case "monthly":
                    default:
                      return `Month: ${label}`;
                  }
                }}
              />
              <Legend />
              <Bar dataKey="reported" name="Reported Cases" fill="#0088FE" />
              <Bar dataKey="active" name="Active Cases" fill="#00C49F" />
              <Bar dataKey="underReview" name="Under Review" fill="#FFBB28" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Priority Distribution */}
      <div className="bg-white rounded-lg shadow p-3 sm:p-4 min-w-0">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="flex items-center min-w-0">
            <AlertTriangle className="mr-2 text-yellow-500 flex-shrink-0" />
            <h3 className="text-sm sm:text-lg font-semibold truncate">
              Priority Distribution
            </h3>
          </div>
          <button className="p-1 text-gray-500 hover:text-gray-700 flex-shrink-0">
            <Filter size={16} />
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center">
          <div className="flex flex-row sm:flex-col justify-center sm:justify-start space-x-4 sm:space-x-0 sm:space-y-2 mb-4 sm:mb-0 sm:pr-4 w-full sm:w-1/2">
            {calculatePercentages(dashboardData.priorityBreakdown || []).map(
              (entry: ChartDataWithPercentage, index: number) => (
                <div key={entry.name} className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-1 sm:mr-2 flex-shrink-0"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span className="font-medium whitespace-nowrap">
                    {entry.name}: {entry.percentage}%
                  </span>
                </div>
              )
            )}
          </div>

          <div className="w-full sm:w-1/2 h-48 sm:h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dashboardData.priorityBreakdown}
                  cx="50%"
                  cy="50%"
                  outerRadius="100%"
                  fill="#8884d8"
                  dataKey="value"
                >
                  {(dashboardData.priorityBreakdown || []).map(
                    (entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    )
                  )}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value}`, name]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Modality Distribution */}
      <div className="bg-white rounded-lg shadow p-3 sm:p-4 min-w-0">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="flex items-center min-w-0">
            <BarChart2 className="mr-2 text-purple-500 flex-shrink-0" />
            <h3 className="text-sm sm:text-lg font-semibold truncate">
              Modality Distribution
            </h3>
          </div>
          <button className="p-1 text-gray-500 hover:text-gray-700 flex-shrink-0">
            <PieChartIcon size={16} />
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center">
          <div className="flex flex-row sm:flex-col justify-center sm:justify-start space-x-4 sm:space-x-0 sm:space-y-2 mb-4 sm:mb-0 sm:pr-4 w-full sm:w-1/2">
            {calculatePercentages(dashboardData.modalityBreakdown || []).map(
              (entry: ChartDataWithPercentage, index: number) => (
                <div key={entry.name} className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-1 sm:mr-2 flex-shrink-0"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span className="font-medium whitespace-nowrap">
                    {entry.name}: {entry.percentage}%
                  </span>
                </div>
              )
            )}
          </div>

          <div className="w-full sm:w-1/2 h-48 sm:h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dashboardData.modalityBreakdown}
                  cx="50%"
                  cy="50%"
                  outerRadius="100%"
                  fill="#8884d8"
                  dataKey="value"
                >
                  {(dashboardData.modalityBreakdown || []).map(
                    (entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    )
                  )}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value}`, name]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Average Turnaround Time */}
      <div className="bg-white rounded-lg shadow p-4 col-span-1 lg:col-span-2">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Clock className="mr-2 text-green-500" />
            <h3 className="text-lg font-semibold">
              Average Turnaround Time (Hours)
            </h3>
          </div>
          <div className="flex space-x-2">
            {/* Date Range Filter */}
            <select
              className="bg-gray-100 text-sm rounded-lg p-1 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) =>
                setTurnaroundDateRange(
                  e.target.value as "weekly" | "monthly" | "quarterly"
                )
              }
              value={turnaroundDateRange}
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
            </select>

            {/* View Type Filter */}
            <select
              className="bg-gray-100 text-sm rounded-lg p-1 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) =>
                setTurnaroundTimeView(e.target.value as "daily" | "weekly")
              }
              value={turnaroundTimeView}
            >
              <option value="daily">Daily Average</option>
              <option value="weekly">Weekly Average</option>
            </select>

            {/* Modality Filter */}
            <select
              className="bg-gray-100 text-sm rounded-lg p-1 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setTurnaroundModality(e.target.value)}
              value={turnaroundModality}
            >
              <option value="all">All Modalities</option>
              <option value="MRI">MRI</option>
              <option value="CT">CT</option>
              <option value="X-Ray">X-Ray</option>
              <option value="Ultrasound">Ultrasound</option>
              <option value="Mammography">Mammography</option>
              <option value="Nuclear Medicine">Nuclear Medicine</option>
            </select>
          </div>
        </div>

        {dashboardData.loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={getCurrentTurnaroundData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="day"
                fontSize={12}
                angle={turnaroundDateRange === "quarterly" ? -45 : 0}
                textAnchor={
                  turnaroundDateRange === "quarterly" ? "end" : "middle"
                }
                height={turnaroundDateRange === "quarterly" ? 60 : 30}
              />
              <YAxis fontSize={12} tickFormatter={(value) => `${value}h`} />
              <Tooltip content={<TurnaroundTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="time"
                name="Avg. Hours"
                stroke="#8884d8"
                strokeWidth={2}
                activeDot={{ r: 6 }}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}

        {/* Enhanced data summary */}
        <div className="mt-2 text-xs text-gray-500 flex justify-between">
          <span>
            {turnaroundTimeView === "daily"
              ? `Daily averages for ${turnaroundDateRange} period`
              : `Weekly averages by day of week (${turnaroundDateRange} period)`}
          </span>
          <span>
            {turnaroundModality === "all"
              ? "All modalities"
              : `${turnaroundModality} only`}
          </span>
        </div>
      </div>
    </div>
  );

  const renderOperationalTab = ( ) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Case Urgency Distribution */}
      <div className="bg-white rounded-lg shadow p-4 col-span-1 md:col-span-2">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <AlertTriangle className="mr-2 text-yellow-500" />
            <h3 className="text-lg font-semibold">
              Case Urgency Distribution Over Time
            </h3>
          </div>
          <select
            className="bg-gray-100 text-sm rounded-lg p-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setOperationalDateRange(e.target.value)}
            value={operationalDateRange}
            disabled={dashboardData.loading}
          >
            <option value="monthly">Last 6 Months</option>
            <option value="quarterly">Last 8 Quarters</option>
            <option value="yearly">Last 3 Years</option>
          </select>
        </div>

        {dashboardData.loading || !dashboardData.operationalData ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : dashboardData.operationalData.caseUrgencyTrendData.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-gray-500">
            No urgency trend data available for the selected period
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={dashboardData.operationalData.caseUrgencyTrendData}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="urgent"
                name="Stat"
                stackId="1"
                fill="#FF8042"
                stroke="#FF8042"
              />
              <Area
                type="monotone"
                dataKey="high"
                name="Urgent"
                stackId="1"
                fill="#FFBB28"
                stroke="#FFBB28"
              />
              <Area
                type="monotone"
                dataKey="medium"
                name="Routine"
                stackId="1"
                fill="#00C49F"
                stroke="#00C49F"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Average Wait Times */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center mb-4">
          <Clock className="mr-2 text-blue-500" />
          <h3 className="text-lg font-semibold">
            Average Wait Times by Priority (Hours)
          </h3>
        </div>

        {dashboardData.loading || !dashboardData.operationalData ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : dashboardData.operationalData.waitTimeData.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-gray-500">
            No wait time data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={dashboardData.operationalData.waitTimeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="priority" />
              <YAxis />
              <Tooltip
                formatter={(value) => [`${value} hours`, "Avg. Hours"]}
              />
              <Bar dataKey="avgTime" name="Avg. Hours" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Peak Usage Times */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center mb-4">
          <Activity className="mr-2 text-green-500" />
          <h3 className="text-lg font-semibold">
            Peak Usage Times (Last 30 Days)
          </h3>
        </div>

        {dashboardData.loading || !dashboardData.operationalData ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : dashboardData.operationalData.peakUsageData.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-gray-500">
            No peak usage data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={dashboardData.operationalData.peakUsageData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis allowDecimals={false} />
              <Tooltip
                formatter={(value) => [`${value} cases`, "Case Volume"]}
              />
              <Line
                type="monotone"
                dataKey="cases"
                name="Case Volume"
                stroke="#82ca9d"
                strokeWidth={2}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Subspeciality Case Distribution */}
      <div className="bg-white rounded-lg shadow p-4 col-span-1 md:col-span-2">
        <div className="flex items-center mb-4">
          <Users className="mr-2 text-indigo-500" />
          <h3 className="text-lg font-semibold">
            Case Distribution by Subspeciality (Last 30 Days)
          </h3>
        </div>

        {dashboardData.loading || !dashboardData.operationalData ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : dashboardData.operationalData.subspecialityData.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-gray-500">
            No subspeciality data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={dashboardData.operationalData.subspecialityData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="subspeciality"
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={11}
              />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="cases" name="Cases Count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );

  const renderFinancialTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Financial Performance */}
      <div className="bg-white rounded-lg shadow p-4 col-span-1 md:col-span-2">
        <div className="flex items-center mb-4">
          <DollarSign className="mr-2 text-green-500" />
          <h3 className="text-lg font-semibold">Financial Performance</h3>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={financialData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="cost" name="Cost" fill="#ff8042" />
            <Bar dataKey="revenue" name="Revenue" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Cost Analysis Stats */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center mb-4">
          <DollarSign className="mr-2 text-blue-500" />
          <h3 className="text-lg font-semibold">Cost Analysis</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Avg. Cost per Case</p>
            <p className="text-2xl font-bold text-blue-600">$142</p>
            <p className="text-xs text-green-500">↓ 5% from last month</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">ROI</p>
            <p className="text-2xl font-bold text-green-600">152%</p>
            <p className="text-xs text-green-500">↑ 3% from last month</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Projected Monthly</p>
            <p className="text-2xl font-bold text-gray-700">$16,450</p>
            <p className="text-xs text-yellow-500">→ Stable</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Payment Status</p>
            <p className="text-2xl font-bold text-green-600">94%</p>
            <p className="text-xs text-gray-500">Invoices Paid</p>
          </div>
        </div>
      </div>

      {/* Expense Projection */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center mb-4">
          <DollarSign className="mr-2 text-purple-500" />
          <h3 className="text-lg font-semibold">
            Quarterly Expense Projection
          </h3>
        </div>
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-gray-700">Q1 2023</p>
            <p className="font-semibold">$48,200</p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-blue-600 h-2.5 rounded-full w-full"></div>
          </div>

          <div className="flex justify-between items-center">
            <p className="text-gray-700">Q2 2023</p>
            <p className="font-semibold">$52,400</p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-blue-600 h-2.5 rounded-full w-full"></div>
          </div>

          <div className="flex justify-between items-center">
            <p className="text-gray-700">Q3 2023 (Projected)</p>
            <p className="font-semibold">$49,800</p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-purple-500 h-2.5 rounded-full w-4/5"></div>
          </div>

          <div className="flex justify-between items-center">
            <p className="text-gray-700">Q4 2023 (Projected)</p>
            <p className="font-semibold">$51,200</p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-purple-500 h-2.5 rounded-full w-3/5"></div>
          </div>
        </div>
      </div>

      {/* Billing Summary Card */}
      <div className="bg-white rounded-lg shadow p-4 col-span-1 md:col-span-2">
        <div className="flex items-center mb-4">
          <DollarSign className="mr-2 text-green-500" />
          <h3 className="text-lg font-semibold">Billing Summary</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Billing Cycle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Paid
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Outstanding
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  March 2023
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  $24,300
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  $24,300
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  $0
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Paid
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  April 2023
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  $26,100
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  $22,185
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  $3,915
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    Partial
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  May 2023
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  $28,400
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  $28,400
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  $0
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Paid
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  June 2023
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  $25,600
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  $0
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  $25,600
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                    Pending
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderQualityTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Radiologist Performance */}
      <div className="bg-white rounded-lg shadow p-4 col-span-1 md:col-span-2">
        <div className="flex items-center mb-4">
          <Award className="mr-2 text-yellow-500" />
          <h3 className="text-lg font-semibold">Radiologist Performance</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Radiologist
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient Satisfaction
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Diagnostic Accuracy
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Turnaround Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Overall Rating
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {radiologistPerformanceData.map((radiologist, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {radiologist.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <span className="mr-2">{radiologist.satisfaction}</span>
                      <div className="w-24 bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-blue-600 h-1.5 rounded-full"
                          style={{ width: `${radiologist.satisfaction * 20}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <span className="mr-2">{radiologist.accuracy}</span>
                      <div className="w-24 bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-green-500 h-1.5 rounded-full"
                          style={{ width: `${radiologist.accuracy * 20}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <span className="mr-2">{radiologist.turnaround}</span>
                      <div className="w-24 bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-purple-500 h-1.5 rounded-full"
                          style={{ width: `${radiologist.turnaround * 20}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <span className="mr-2">
                        {(
                          (radiologist.satisfaction +
                            radiologist.accuracy +
                            radiologist.turnaround) /
                          3
                        ).toFixed(1)}
                      </span>
                      <div className="w-24 bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-yellow-500 h-1.5 rounded-full"
                          style={{
                            width: `${
                              ((radiologist.satisfaction +
                                radiologist.accuracy +
                                radiologist.turnaround) /
                                3) *
                              20
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Incidental Findings */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center mb-4">
          <Clipboard className="mr-2 text-indigo-500" />
          <h3 className="text-lg font-semibold">
            Incidental Findings Tracking
          </h3>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={incidentalFindingsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" name="Total Findings" fill="#8884d8" />
            <Bar dataKey="followedUp" name="Followed Up" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Patient Journey */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center mb-4">
          <Activity className="mr-2 text-blue-500" />
          <h3 className="text-lg font-semibold">Patient Journey Timeline</h3>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={patientTimelineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="stage" />
            <YAxis
              label={{
                value: "Time (hours)",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="avgTime"
              name="Average Time (hours)"
              stroke="#82ca9d"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                {user?.role === "HOSPITAL"
                  ? "Hospital Dashboard"
                  : user?.role === "RADIOLOGIST"
                  ? "Radiologist Dashboard"
                  : user?.role === "ADMIN"
                  ? "Admin Dashboard"
                  : "Dashboard"}
              </h1>
              <span className="ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Live
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                <span className="block">
                  Last updated: April 12, 2023 - 10:35 AM
                </span>
              </div>
              <div className="relative">
                <button
                  className="relative p-1 rounded-full text-gray-600 hover:text-gray-800 focus:outline-none"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <Bell size={20} />
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
                </button>
                {renderNotifications()}
              </div>
              {/* <div className=""> */}
              {/* <h2 className="text-lg text-stone-500 ">
            Welcome
            <span className="text-purple-600 font-bold">
              {user?.name || "Guest"}
            </span>
          </h2> */}
              <div
                className="bg-purple-100 border border-purple-300 p-2 rounded-full text-purple-900 cursor-pointer hover:bg-purple-200 transition-colors"
                onClick={toggleUserInfo}
              >
                <UserIcon strokeWidth={1} />
              </div>
              {/* </div> */}
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-col items-center gap-2">
        {user?.image && (
          <img
            src={user.image}
            alt="User Image"
            className="w-24 h-24 rounded-full border"
          />
        )}
        {/* Only render AdminDashboard if user has ADMIN role */}
        {user?.role === "ADMIN" && <AdminDashboard />}
      </div>

      {/* Render the UserInfo component when isUserInfoOpen is true */}
      {isUserInfoOpen && (
        <UserInfo user={user} onClose={() => setIsUserInfoOpen(false)} />
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Total Active Cases</p>
              <p className="text-2xl font-bold text-gray-900">
                {dashboardData.totalActiveCases}
              </p>
              <p className="text-xs text-green-500">↑ 5% from last week</p>
            </div>
            <FileText className="h-10 w-10 text-blue-500" />
          </div>

          <div className="bg-white rounded-lg shadow p-4 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Avg. Turnaround Time</p>
              <p className="text-2xl font-bold text-gray-900">
                {dashboardData.loading
                  ? "Loading..."
                  : formatTurnaroundTime(
                      dashboardData.averageTurnaroundTime || 0
                    )}
              </p>
              <p className="text-xs text-green-500">↓ 12% from last week</p>
            </div>
            <Clock className="h-10 w-10 text-green-500" />
          </div>

          <div className="bg-white rounded-lg shadow p-4 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Stat/Urgent Cases</p>
              <p className="text-2xl font-bold text-gray-900">
                {dashboardData.urgentCases}
              </p>
              <p className="text-xs text-yellow-500">↔ No change</p>
            </div>
            <AlertTriangle className="h-10 w-10 text-yellow-500" />
          </div>

          <div className="bg-white rounded-lg shadow p-4 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Available Radiologists</p>
              <p className="text-2xl font-bold text-gray-900">coming soon...</p>
              <p className="text-xs text-red-500">↓ 2 from yesterday</p>
            </div>
            <Users className="h-10 w-10 text-purple-500" />
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                className={`${
                  activeTab === "overview"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                onClick={() => setActiveTab("overview")}
              >
                Overview
              </button>
              <button
                className={`${
                  activeTab === "operational"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                onClick={() => setActiveTab("operational")}
              >
                Operational
              </button>
              <button
                className={`${
                  activeTab === "financial"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                onClick={() => setActiveTab("financial")}
              >
                Financial
              </button>
              <button
                className={`${
                  activeTab === "quality"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                onClick={() => setActiveTab("quality")}
              >
                Quality Metrics
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && renderOverviewTab()}
        {activeTab === "operational" && renderOperationalTab()}
        {activeTab === "financial" && renderFinancialTab()}
        {activeTab === "quality" && renderQualityTab()}
      </main>

      {/* Footer */}
      <footer className="bg-white shadow-inner mt-8">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              © 2025 MedKnight. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <button className="text-sm text-gray-500 hover:text-gray-700">
                Help
              </button>
              <button className="text-sm text-gray-500 hover:text-gray-700">
                <Link href={"/privacy-policy"}>Privacy</Link>
              </button>
              <button className="text-sm text-gray-500 hover:text-gray-700">
                <Link href={"/terms-of-service"}>Terms</Link>
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
