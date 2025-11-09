import React from "react";
import { _Card, _CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowTrendUp, faArrowTrendDown } from "@fortawesome/free-solid-svg-icons";

export interface KpiItem {
  title: string;
  value: number | string;
  delta?: { value: number; isPositive: boolean };
}

interface KPIGroupProps {
  headerTitle?: string;
  items: KpiItem[];
  timeRange?: "Weekly" | "Monthly" | "Yearly";
  onTimeRangeChange?: (r: "Weekly" | "Monthly" | "Yearly") => void;
  isLoading?: boolean;
}

const KPIGroup: React.FC<KPIGroupProps> = ({ headerTitle = "Analytics", items, timeRange = "Weekly", onTimeRangeChange, isLoading = false }) => {
  const rangeText = timeRange.toLowerCase();
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100">{headerTitle}</h3>
        <div className="hidden sm:flex items-center gap-1 border border-gray-200 dark:border-gray-700 rounded-lg p-1 bg-white dark:bg-gray-800">
          {(["Weekly","Monthly","Yearly"] as const).map(r => (
            <Button
              key={r}
              variant="ghost"
              size="sm"
              onClick={() => onTimeRangeChange?.(r)}
              className={`rounded-lg px-4 ${timeRange===r ? 'bg-indigo-100 text-gray-900 dark:bg-indigo-100 dark:text-gray-900' : 'text-gray-900 dark:text-gray-100'}`}
            >
              {r}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map((k, idx) => (
          <_Card key={idx} className="bg-white border border-gray-100 rounded-2xl dark:bg-gray-900 dark:border-gray-800">
            <_CardContent className="p-5">
              <div className="text-gray-600 md:text-base font-semibold text-sm dark:text-gray-300">{k.title}</div>
              <div className="mt-2">
                {isLoading ? (
                  <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                ) : (
                  <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">{k.value}</div>
                )}
              </div>
              <div className="mt-2 min-h-[1.25rem]">
                {isLoading ? (
                  <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                ) : k.delta ? (
                  <div className={`flex items-center gap-2 text-xs ${k.delta.isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                    <FontAwesomeIcon icon={k.delta.isPositive ? faArrowTrendUp : faArrowTrendDown} />
                    <span>{k.delta.isPositive ? '+' : '-'}{k.delta.value.toFixed(2)}% from previous {rangeText}</span>
                  </div>
                ) : (
                  <div className="text-xs text-gray-400">from previous {rangeText}</div>
                )}
              </div>
            </_CardContent>
          </_Card>
        ))}
      </div>
    </div>
  );
};

export default KPIGroup; 