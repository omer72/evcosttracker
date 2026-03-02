import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { useLanguage } from "@/i18n/LanguageContext";

interface DailyData {
  day: string;
  total: number;
}

export default function YearlyChart() {
  const [monthlyData, setMonthlyData] = useState<DailyData[]>([]);
  const { t, language } = useLanguage();

  useEffect(() => {
    fetchMonthlyData();
  }, []);

  const fetchMonthlyData = async () => {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) return;

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const { data, error } = await supabase
      .from("charging_history")
      .select("date, total_amount")
      .eq("user_id", session.session.user.id)
      .gte("date", startOfMonth.toISOString())
      .lte("date", endOfMonth.toISOString());

    if (error) {
      console.error("Error fetching monthly data:", error);
      return;
    }

    const dailyTotals = data.reduce((acc: { [key: string]: number }, curr) => {
      const day = new Date(curr.date).getDate().toString();
      acc[day] = (acc[day] || 0) + Number(curr.total_amount);
      return acc;
    }, {});

    const daysInMonth = endOfMonth.getDate();
    const formattedData = Array.from({ length: daysInMonth }, (_, i) => {
      const day = (i + 1).toString();
      return {
        day,
        total: Number((dailyTotals[day] || 0).toFixed(2)),
      };
    });

    setMonthlyData(formattedData);
  };

  const chartConfig = {
    total: {
      theme: {
        light: "#9b87f5",
        dark: "#9b87f5",
      },
    },
  };

  const currentMonth = new Date().toLocaleString(language === "he" ? "he-IL" : "en-US", { month: 'long' });

  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <h3 className="font-semibold mb-4">{currentMonth} {t("overview")}</h3>
      <div className="h-[300px]">
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="total"
                fill="var(--color-total)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
}
