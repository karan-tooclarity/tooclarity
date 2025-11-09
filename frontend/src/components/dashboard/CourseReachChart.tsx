import React, { useEffect, useMemo, useRef, useState } from "react";
import { _Card, _CardContent } from "../ui/card";
import { motion} from "framer-motion";

interface CourseReachChartProps {
  // Optional: leads data for dual line chart (analytics mode)
  leadsValues?: number[];
  // Optional: chart title override
  title?: string;
  // Optional: show legend (for analytics mode)
  showLegend?: boolean;
  onDataPointClick?: (point: { index: number; value: number; timeRange: string }) => void;
  // Optional: external filters
  timeRange?: string;
  _course?: string;
  // Optional real-time stream endpoint (SSE). If not provided, we will poll /api/course-reach
  sseUrl?: string;
  pollMs?: number;
  // New: direct backend-provided series to render
  values?: number[];
  yTicksOverride?: number[];
  // New: optional async callback to fetch yearly data when year changes
  onRequestYearData?: (year: number) => Promise<number[]>;
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const niceMax = (maxVal: number): number => {
  if (!isFinite(maxVal) || maxVal <= 0) return 10;
  const exp = Math.floor(Math.log10(maxVal));
  const base = Math.pow(10, exp);
  const mant = maxVal / base;
  let niceMant = 1;
  if (mant <= 1) niceMant = 1;
  else if (mant <= 2) niceMant = 2;
  else if (mant <= 5) niceMant = 5;
  else niceMant = 10;
  return niceMant * base;
};

const CourseReachChart: React.FC<CourseReachChartProps> = ({ onDataPointClick, timeRange, _course, sseUrl, pollMs = 5000, values, leadsValues, title, showLegend = false, yTicksOverride, onRequestYearData }) => {
  const [selectedTimeRange, _setSelectedTimeRange] = useState(timeRange || "Weekly");
  const [chartData, setChartData] = useState<number[]>([15000, 12000, 18000, 14000, 16000, 13000, 17000, 19000, 15000, 18000, 16000, 20000]);
  const [leadsData, setLeadsData] = useState<number[]>([300, 200, 400, 300, 300, 200, 400, 500, 300, 400, 300, 600]);
  const [_isLoading, setIsLoading] = useState(false);
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());

  // If values are provided from backend, use them
  useEffect(() => {
    if (Array.isArray(leadsValues) && leadsValues.length > 0) {
      setLeadsData(leadsValues);
    }
  }, [leadsValues]);
  useEffect(() => {
    try {
    if (Array.isArray(values) && values.length > 0) {
      setChartData(values);
      }
    } catch (err) {
      console.error('CourseReachChart: applying values failed', err);
    }
  }, [values]);

  // Load data for a given year if callback provided
  useEffect(() => {
    let mounted = true;
    const run = async () => {
      if (!onRequestYearData) return;
      try {
        setIsLoading(true);
        const next = await onRequestYearData(currentYear);
        if (mounted && Array.isArray(next) && next.length === 12) setChartData(next);
      } catch (err) { console.error('CourseReachChart: onRequestYearData failed', err); }
      finally { setIsLoading(false); }
    };
    run();
    return () => { mounted = false; };
  }, [currentYear, onRequestYearData]);

  // container width for responsive layout
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(1000);

  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        const w = containerRef.current.clientWidth;
        if (w && Math.abs(w - containerWidth) > 2) setContainerWidth(w);
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [containerWidth]);

  // --- Real-time updates --- only if no direct values are provided
  useEffect(() => {
    if (typeof values !== 'undefined') {
      return; // skip polling/SSE when direct values provided
    }
    let abortController: AbortController | null = null;
    let es: EventSource | null = null;

    if (sseUrl) {
      es = new EventSource(sseUrl);
      es.onmessage = (ev) => {
        try {
          const payload = JSON.parse(ev.data);
          if (Array.isArray(payload?.values)) {
            setChartData(payload.values as number[]);
          }
        } catch (err) {
          console.error('CourseReachChart: SSE parse/update failed', err);
        }
      };
      es.onerror = () => {
        es?.close();
      };
      return () => es?.close();
    }

    const poll = async () => {
      abortController?.abort();
      abortController = new AbortController();
      try {
        const res = await fetch("/api/course-reach", { signal: abortController.signal });
        if (res.ok) {
          const json = await res.json();
          if (Array.isArray(json?.values)) {
            setChartData(json.values as number[]);
          }
        } else {
          // Fallback: gentle drift to simulate live updates
          setChartData(prev => prev.map((v, i) => Math.max(1, v + Math.round(Math.sin(Date.now()/60000 + i) * 50))));
        }
      } catch {
        // Network error: do nothing, keep old values
      }
    };

    const id = setInterval(poll, pollMs);
    poll();
    return () => {
      clearInterval(id);
      abortController?.abort();
    };
  }, [sseUrl, pollMs, values]);

  // --- Smooth path helpers (Catmull-Rom -> Bezier) ---
  type Point = { x: number; y: number };

  const leftPad = 70;
  const rightPad = 30;
  const topPad = 40;
  const bottomPad = 60;

  const { pathD, leadsPathD, points, width, maxY, yTicks, useEqualSpacing } = useMemo(() => {
    const width = Math.max(700, containerWidth); // ensure enough width
    const height = 400;

    const innerW = width - leftPad - rightPad;
    const innerH = height - topPad - bottomPad;

    const valuesArr = chartData.slice();
    const leadsArr = leadsData.slice();

    let maxY = 0;
    let yTicks: number[] = [];
    const useEqualSpacing = !!(yTicksOverride && yTicksOverride.length >= 2);
    if (useEqualSpacing) {
      yTicks = yTicksOverride as number[];
      maxY = yTicks[yTicks.length - 1];
    } else {
      const dataMax = Math.max(10, ...valuesArr, ...(showLegend ? leadsArr : [0]));
      // Dynamic behavior: if above 250k, extend ticks in 50k steps until covering dataMax
      if (dataMax >= 250000) {
        const top = Math.ceil(dataMax / 50000) * 50000; // next 50k multiple
        yTicks = [];
        for (let v = 0; v <= top; v += 50000) yTicks.push(v);
        if (yTicks[yTicks.length - 1] !== top) yTicks.push(top);
        maxY = yTicks[yTicks.length - 1];
      } else {
      maxY = niceMax(dataMax);
      const steps = 5;
      const stepVal = maxY / steps;
      yTicks = Array.from({ length: steps + 1 }, (_, i) => Math.round(i * stepVal));
    }
    }

    const minY = 0;   // 0k bottom
    const stepX = innerW / (valuesArr.length - 1);
    const toY = (v: number) => topPad + innerH - ((v) - minY) / (maxY - minY) * innerH;

    const pts: Point[] = valuesArr.map((v, i) => ({ x: leftPad + i * stepX, y: toY(v) }));
    const leadsPts: Point[] = leadsArr.map((v, i) => ({ x: leftPad + i * stepX, y: toY(v) }));

    const toSmoothPath = (ptsIn: Point[]): string => {
      if (ptsIn.length < 2) return "";
      const d: string[] = [];
      d.push(`M ${ptsIn[0].x} ${ptsIn[0].y}`);
      for (let i = 0; i < ptsIn.length - 1; i++) {
        const p0 = ptsIn[i - 1] ?? ptsIn[i];
        const p1 = ptsIn[i];
        const p2 = ptsIn[i + 1];
        const p3 = ptsIn[i + 2] ?? p2;
        const smoothing = 0.2;
        const cp1x = p1.x + (p2.x - p0.x) * smoothing;
        const cp1y = p1.y + (p2.y - p0.y) * smoothing;
        const cp2x = p2.x - (p3.x - p1.x) * smoothing;
        const cp2y = p2.y - (p3.y - p1.y) * smoothing;
        d.push(`C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`);
      }
      return d.join(" ");
    };

    return { 
      pathD: toSmoothPath(pts), 
      leadsPathD: toSmoothPath(leadsPts),
      points: pts, 
      leadsPoints: leadsPts,
      width,
      maxY,
      yTicks,
      useEqualSpacing,
    };
  }, [chartData, leadsData, containerWidth, showLegend, yTicksOverride]);

  const currentYearMax = new Date().getFullYear();
  	const _showInfoToast = (message: string) => { import("react-toastify").then(m => m.toast.info(message)); };

  const formatTick = (t: number) => {
    if (yTicksOverride && yTicksOverride.length >= 2) {
      return `${Math.round(t / 1000)}k`;
    }
    return t >= 1000 ? `${Math.round(t/1000)}k` : t.toLocaleString();
  };

  // Attempt to move to a target year: allow only if <= currentYearMax. For past years, require data.
  const trySetYear = async (targetYear: number) => {
    	// clear any queued info; toasts are ephemeral so nothing to clear
    if (targetYear > currentYearMax) {
      setCurrentYear(currentYearMax);
      return;
    }
    if (targetYear === currentYear) return;

    // If going backward and we have a data loader, probe before switching
    if (targetYear < currentYear) {
      if (onRequestYearData) {
        try {
          const next = await onRequestYearData(targetYear);
          const sum = Array.isArray(next) ? next.reduce((s, v) => s + (v || 0), 0) : 0;
          if (Array.isArray(next) && next.length === 12 && sum > 0) {
            setChartData(next);
            setCurrentYear(targetYear);
            return;
          }
          		  // No data for that year; keep current and show toast
		  _showInfoToast(`No data for ${targetYear}`);
		  return;
        		} catch {
		  _showInfoToast(`No data for ${targetYear}`);
		  return;
		}
      } else {
        		// No loader to verify past years; block navigation and show toast
		_showInfoToast("No previous years data available");
		return;
      }
    }

    // Forward navigation is clamped to current year
    setCurrentYear(targetYear);
  };

  const handleWheelYear = async (e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) > 40 || Math.abs(e.deltaY) > 60) {
      if (e.deltaY > 0 || e.deltaX > 0) {
        await trySetYear(currentYear - 1);
      } else {
        await trySetYear(currentYearMax);
      }
    }
  };

  // Touch swipe for year navigation
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = async (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStart.current.x;
    const dy = t.clientY - touchStart.current.y;
    touchStart.current = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0) await trySetYear(currentYear - 1); // previous year
      else await trySetYear(currentYearMax);        // next clamped to current
    }
  };

  // Determine if current year has any data
  const hasAnyData = useMemo(() => {
    const sumA = (chartData || []).reduce((s, v) => s + (v || 0), 0);
    const sumB = (leadsData || []).reduce((s, v) => s + (v || 0), 0);
    return (sumA + sumB) > 0;
  }, [chartData, leadsData]);

  return (
    <motion.div className="w-full" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <_Card className="m-5 border-none bg-gray-50 shadow-sm rounded-2xl border border-gray-100 dark:bg-gray-900 dark:border-gray-800">
        <_CardContent className="p-5">
          {/* Header */}
          <div className="flex items-center justify-between mb-3 w-full">
            <div className="text-[22px] font-semibold text-gray-900 dark:text-gray-100">{title || "Program Reach Over Time"}</div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <button className="px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => trySetYear(currentYear - 1)} aria-label="Previous Year">⟨</button>
                <span className="text-sm font-medium" aria-live="polite">{currentYear}</span>
                <button className="px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => trySetYear(currentYearMax)} aria-label="Next Year">⟩</button>
              </div>
              {showLegend && (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-300">Views</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-300">Leads</span>
                  </div>
                </div>
              )}
            </div>
          </div>


          {!hasAnyData && (
            <div className="w-full py-6 text-center text-sm text-gray-500 dark:text-gray-400">No data for the current year</div>
          )}

          {/* Chart container */}
          <div
            ref={containerRef}
            className="w-full rounded-2xl bg-white border border-gray-100 overflow-hidden dark:bg-gray-800 dark:border-gray-700"
            onWheel={handleWheelYear}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <svg viewBox={`0 0 ${width} 400`} className="w-full h-[25rem]">
              {/* background gradient fill under the curve */}
              <defs>
                <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity="0.50" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0.10" />
                </linearGradient>
                <pattern id="hgrid" width={width} height="60" patternUnits="userSpaceOnUse">
                  <path d={`M 0 0 L ${width} 0`} stroke="#e5e7eb" strokeWidth="1" />
                </pattern>
              </defs>

              {/* grid lines - dynamic based on Y-axis ticks */}
              {yTicks.map((t, i) => {
                const totalSteps = yTicks.length - 1;
                const y = useEqualSpacing
                  ? topPad + (1 - i / totalSteps) * 300
                  : topPad + (300 - (t / maxY) * 300);
                return (
                  <line key={`grid-${t}-${i}`} x1={leftPad} y1={y} x2={width - rightPad} y2={y} stroke="#e5e7eb" strokeWidth="1" />
                );
              })}

              {/* y-axis labels */}
              {yTicks.map((t, i) => {
                const totalSteps = yTicks.length - 1;
                const y = useEqualSpacing
                  ? topPad + (1 - i / totalSteps) * 300
                  : topPad + (300 - (t / maxY) * 300);
                return (
                  <text key={`label-${t}-${i}`} x={20} y={y + 4} fontSize="17" fill="#6b7280" className="dark:fill-gray-400">{formatTick(t)}</text>
                );
              })}

              {/* months along bottom */}
              {MONTHS.map((m, i) => {
                const x = leftPad + i * ((width - leftPad - rightPad) / (MONTHS.length - 1));
                return (
                  <text key={`${m}-${currentYear}`} x={x} y={370} fontSize="22" textAnchor="middle" fill="#6b7280" className="dark:fill-gray-400">{m}</text>
                );
              })}

              {/* floating water/boat effect */}
              <motion.g>
                {/* area fill under the curve */}
                <motion.path
                  d={`${pathD} L ${width - rightPad} 340 L ${leftPad} 340 Z`}
                  fill="url(#areaFill)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                />

                {/* main line (Views) */}
                <motion.path
                  d={pathD}
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth={6}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 3.5 }}
                  filter="url(#shadow)"
                />

                {/* leads line (green, dashed) - only show in analytics mode */}
                {showLegend && leadsPathD && (
                  <motion.path
                    d={leadsPathD}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth={3}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeDasharray="10 10"
                    initial={{ strokeDashoffset: 1000 }}
                    animate={{ strokeDashoffset: 0 }}
                    transition={{ duration: 1.6, delay: 0.4 }}
                  />
                )}

                {/* points for main line */}
                {points.map((p, index) => (
                  <motion.circle
                    key={`${index}-${currentYear}`}
                    cx={p.x}
                    cy={p.y}
                    r={5}
                    fill="#2563eb"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.8 + index * 0.03 }}
                    onClick={() => onDataPointClick?.({ index, value: chartData[index], timeRange: selectedTimeRange })}
                  />
                ))}
              </motion.g>
            </svg>
        </div>
      </_CardContent>
    </_Card>
  </motion.div>
  );
};

export default CourseReachChart;
