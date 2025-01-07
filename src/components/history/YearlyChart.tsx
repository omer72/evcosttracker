import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";

interface YearlyData {
  month: string;
  total: number;
}

export default function YearlyChart() {
  const [yearlyData, setYearlyData] = useState<YearlyData[]>([]);

  useEffect(() => {
    fetchYearlyData();
  }, []);

  const fetchYearlyData = async () => {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) return;

    const { data, error } = await supabase
      .from("charging_history")
      .select("date, total_amount")
      .eq("user_id", session.session.user.id)
      .gte("date", new Date(new Date().getFullYear(), 0, 1).toISOString())
      .lte("date", new Date(new Date().getFullYear(), 11, 31).toISOString());

    if (error) {
      console.error("Error fetching yearly data:", error);
      return;
    }

    const monthlyTotals = data.reduce((acc: { [key: string]: number }, curr) => {
      const month = new Date(curr.date).toLocaleString("default", { month: "short" });
      acc[month] = (acc[month] || 0) + Number(curr.total_amount);
      return acc;
    }, {});

    const formattedData = Object.entries(monthlyTotals).map(([month, total]) => ({
      month,
      total: Number(total.toFixed(2)),
    }));

    setYearlyData(formattedData);
  };

  const chartConfig = {
    total: {
      theme: {
        light: "#9b87f5",
        dark: "#9b87f5",
      },
    },
  };

  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <h3 className="font-semibold mb-4">Yearly Overview</h3>
      <div className="h-[300px]">
        <ChartContainer config={chartConfig}>
          <BarChart data={yearlyData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Bar
              dataKey="total"
              fill="var(--color-total)"
              radius={[4, 4, 0, 0]}
            />
            <ChartTooltip>
              <ChartTooltipContent />
            </ChartTooltip>
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  );
}