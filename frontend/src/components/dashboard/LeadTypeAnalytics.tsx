import React from "react"
import { _Card, _CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"

export interface LeadTypeData {
  callBackRequests: number
  demoRequests: number
  courseComparisons: number
}

interface LeadTypeAnalyticsProps {
  title?: string
  data: LeadTypeData
}

const ProgressBar: React.FC<{ label: string; value: number; total: number; color: string }> = ({
  label,
  value,
  total,
  color,
}) => {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0
  return (
    <div className="space-y-2 mr-10">
      <div className="flex items-center justify-between text-gray-800 dark:text-gray-400">
        <span className="font-medium">{label}</span>
        <span className="font-semibold text-gray-800 dark:text-gray-400">
          {value} {/* or `${pct}% (${value})` if you want both */}
        </span>
      </div>
      <div className="h-3 rounded-full bg-indigo-50 overflow-hidden">
        <div className="h-3 rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  )
}

// Helper: convert polar to cartesian within a circle
function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const angleRad = (angleDeg - 90) * (Math.PI / 180)
  return {
    x: cx + r * Math.cos(angleRad),
    y: cy + r * Math.sin(angleRad),
  }
}

// Helper: describe an arc path for a donut segment (outer and inner radii)
function _describeDonutArc(
  cx: number,
  cy: number,
  outerR: number,
  innerR: number,
  startAngle: number,
  endAngle: number,
) {
  const largeArc = endAngle - startAngle <= 180 ? 0 : 1

  const p1 = polarToCartesian(cx, cy, outerR, endAngle)
  const p2 = polarToCartesian(cx, cy, outerR, startAngle)
  const p3 = polarToCartesian(cx, cy, innerR, startAngle)
  const p4 = polarToCartesian(cx, cy, innerR, endAngle)

  return [
    `M ${p1.x} ${p1.y}`,
    `A ${outerR} ${outerR} 0 ${largeArc} 0 ${p2.x} ${p2.y}`,
    `L ${p3.x} ${p3.y}`,
    `A ${innerR} ${innerR} 0 ${largeArc} 1 ${p4.x} ${p4.y}`,
    "Z",
  ].join(" ")
}

type HalfDonutProps = {
  values: number[]
  colors: string[]
  centerText: string
  subText: string
}

const HalfDonut: React.FC<HalfDonutProps> = ({ values, colors, centerText, subText }) => {
  const width = 300
  const height = 130
  const cx = width / 2
  const cy = height - 18
  const outerRadius = 100
  const innerRadius = 70

  const total = values.reduce((acc, val) => acc + val, 0) || 1

  let currentAngle = 0
  const segments = values.map((value, index) => {
    const percentage = (value / total) * 100
    const segmentAngle = (value / total) * 180 // Half circle is 180 degrees

    const startAngle = currentAngle
    const endAngle = currentAngle + segmentAngle
    currentAngle += segmentAngle

    // Convert angles to radians and calculate coordinates
    const startRad = (startAngle * Math.PI) / 180
    const endRad = (endAngle * Math.PI) / 180
    const midAngle = (startAngle + endAngle) / 2
    const midRad = (midAngle * Math.PI) / 180

    const x1 = cx + outerRadius * Math.cos(Math.PI - startRad)
    const y1 = cy - outerRadius * Math.sin(Math.PI - startRad)
    const x2 = cx + outerRadius * Math.cos(Math.PI - endRad)
    const y2 = cy - outerRadius * Math.sin(Math.PI - endRad)

    const x3 = cx + innerRadius * Math.cos(Math.PI - endRad)
    const y3 = cy - innerRadius * Math.sin(Math.PI - endRad)
    const x4 = cx + innerRadius * Math.cos(Math.PI - startRad)
    const y4 = cy - innerRadius * Math.sin(Math.PI - startRad)

    const largeArcFlag = segmentAngle > 90 ? 0 : 0

    const pathData = [
      `M ${x1} ${y1}`,
      `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      `L ${x3} ${y3}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4}`,
      "Z",
    ].join(" ")

    // Tooltip anchor position just outside outer radius
    const labelR = outerRadius + 14
    const midX = cx + labelR * Math.cos(Math.PI - midRad)
    const midY = cy - labelR * Math.sin(Math.PI - midRad)

    return {
      pathData,
      color: colors[index],
      percentage: Math.round(percentage),
      midX,
      midY,
    }
  })

  const [hoverIdx, setHoverIdx] = React.useState<number | null>(null)

  return (
    <div className="dark:text-gray-100 flex flex-col items-center w-full">
      <div className="relative w-full max-w-sm ">
        <svg width="100%" height="70%" viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">

          {/* Colored segments */}
          {segments.map((segment, index) => (
            <path
              key={index}
              d={segment.pathData}
              fill={segment.color}
              stroke={segment.color}
              strokeWidth="20"
              strokeLinecap="round"
              strokeLinejoin="round"
              onMouseEnter={() => setHoverIdx(index)}
              onMouseLeave={() => setHoverIdx(null)}
            />
          ))}

          <text
            x={cx}
            y={cy - 15}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-2xl sm:text-3xl md:text-4xl font-bold "
            fill="#1E40AF"
          >
            {centerText}
          </text>

          <text
            x={cx}
            y={cy + 10}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-xs sm:text-sm"
            fill="#374151"
          >
            {subText}
          </text>
        </svg>

        {hoverIdx !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: [1, 1.08, 1] }}
            transition={{ duration: 0.35, ease: "easeInOut", repeat: Infinity, repeatDelay: 1.2 }}
            className="absolute -translate-y-1/2 -translate-x-1/2 pointer-events-none"
            style={{ left: `${segments[hoverIdx].midX}px`, top: `${segments[hoverIdx].midY}px` }}
          >
            <div
              className="relative px-3.5 py-2 rounded-2xl text-white text-sm md:text-lg shadow-2xl backdrop-blur-md"
              style={{
                background: `linear-gradient(135deg, ${segments[hoverIdx].color}F0 0%, ${segments[hoverIdx].color}B3 100%)`,
                boxShadow: `0 12px 30px ${segments[hoverIdx].color}40`,
                border: "1px solid rgba(255,255,255,0.35)"
              }}
            >
              <span className="font-semibold tracking-wide">{segments[hoverIdx].percentage}%</span>
              <div
                className="absolute left-1/2 -translate-x-1/2 -bottom-1.5 w-2.5 h-2.5 rotate-45"
                style={{
                  background: `linear-gradient(135deg, ${segments[hoverIdx].color}F0 0%, ${segments[hoverIdx].color}B3 100%)`,
                  borderRight: "1px solid rgba(255,255,255,0.35)",
                  borderBottom: "1px solid rgba(255,255,255,0.35)"
                }}
              />
            </div>
          </motion.div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-6 mt-4 w-full ">
        <LegendItem color={colors[0]} label="Call Back Requests"  />
        <LegendItem color={colors[1]} label="Demo Requests" />
        <LegendItem color={colors[2]} label="Program Comparisons" />
      </div>
    </div>
  )
}

const LegendItem: React.FC<{ color: string; label: string }> = ({ color, label }) => (
  <div className="flex items-center space-x-2">
    <span className="w-3 h-3 sm:w-4 sm:h-4 rounded-full flex-shrink-0" style={{ backgroundColor: color }}></span>
    <span className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">{label}</span>
  </div>
)

const LeadTypeAnalytics: React.FC<LeadTypeAnalyticsProps> = ({ title = "Lead Type Analysis", data }) => {
  const total = Math.max(1, data.callBackRequests + data.demoRequests + data.courseComparisons)

  const maxValue = Math.max(data.callBackRequests, data.demoRequests, data.courseComparisons)
  const percent = Math.round((maxValue / total) * 100)

  const colors = ["#0222D7", "#4964FD", "#9AA9FE"] // Dark blue, medium blue, light lavender

  return (
    <_Card className="m-5 bg-gray-50 border border-gray-100 rounded-2xl dark:bg-gray-900 dark:border-gray-800 w-full">
      <_CardContent className="p-3 md:p-4">
        <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">{title}</h3>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 dark:text-gray-100">
          <div className="bg-white dark:bg-gray-900 dark:text-gray-100  rounded-xl p-3 sm:p-4 md:p-6 order-2 xl:order-1">
            <div className="space-y-4 sm:space-y-6 dark:text-gray-100">
              <ProgressBar label="Call Back Requests" value={data.callBackRequests} total={total} color={colors[0]} />
              <ProgressBar label="Demo Requests" value={data.demoRequests} total={total} color={colors[1]} />
              <ProgressBar label="Program Comparisons" value={data.courseComparisons} total={total} color={colors[2]} />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl p-3 sm:p-4 md:p-6 flex items-center justify-center order-1 xl:order-2">
            <HalfDonut
              values={[data.callBackRequests, data.demoRequests, data.courseComparisons]}
              colors={colors}
              centerText={`${percent}%`}
              subText={`${total} total`}
            />
          </div>
        </div>
      </_CardContent>
    </_Card>
  )
}

export default LeadTypeAnalytics
