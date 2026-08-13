const COLOR_RECORDED = "#2a78d6";
const COLOR_CAPACITY = "#eb6834";

const GRID = "#e1e0d9";
const AXIS = "#c3c2b7";
const MUTED = "#898781";

export type ChartBucket = {
  key: string;
  shortLabel: string;
  fullLabel: string;
  recordedHours: number;
  capacityHours: number;
};

// Path for a bar with rounded top corners and a square baseline.
function roundedTopBar(x: number, y: number, w: number, h: number, r: number) {
  const radius = Math.max(0, Math.min(r, h, w / 2));
  const top = y;
  const bottom = y + h;
  return `M${x},${bottom} L${x},${top + radius} Q${x},${top} ${x + radius},${top} L${x + w - radius},${top} Q${x + w},${top} ${x + w},${top + radius} L${x + w},${bottom} Z`;
}

export default function UtilizationBarChart({
  buckets,
}: {
  buckets: ChartBucket[];
}) {
  if (buckets.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-zinc-200 px-4 py-10 text-center text-sm text-zinc-400">
        No utilization data yet.
      </p>
    );
  }

  const width = 720;
  const height = 260;
  const paddingLeft = 36;
  const paddingRight = 12;
  const paddingTop = 16;
  const paddingBottom = 28;
  const plotWidth = width - paddingLeft - paddingRight;
  const plotHeight = height - paddingTop - paddingBottom;

  const maxValue = Math.max(
    1,
    ...buckets.map((b) => Math.max(b.recordedHours, b.capacityHours)),
  );
  const niceMax = Math.max(10, Math.ceil(maxValue / 10) * 10);

  const tickCount = 4;
  const tickValues = Array.from({ length: tickCount + 1 }, (_, i) =>
    Math.round((niceMax / tickCount) * i),
  );

  const yFor = (value: number) =>
    paddingTop + plotHeight - (value / niceMax) * plotHeight;

  const bandWidth = plotWidth / buckets.length;
  const barWidth = Math.min(24, (bandWidth - 10) / 2);
  const gap = 2;

  return (
    <div>
      <div className="flex items-center gap-4 text-xs text-zinc-600">
        <span className="flex items-center gap-1.5">
          <span
            className="inline-block h-2.5 w-2.5 rounded-sm"
            style={{ backgroundColor: COLOR_RECORDED }}
          />
          Recorded
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className="inline-block h-2.5 w-2.5 rounded-sm"
            style={{ backgroundColor: COLOR_CAPACITY }}
          />
          Capacity
        </span>
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="mt-2 w-full"
        role="img"
        aria-label="Recorded vs capacity utilization hours by period"
      >
        {tickValues.map((value) => (
          <g key={value}>
            <line
              x1={paddingLeft}
              x2={width - paddingRight}
              y1={yFor(value)}
              y2={yFor(value)}
              stroke={GRID}
              strokeWidth={1}
            />
            <text
              x={paddingLeft - 6}
              y={yFor(value)}
              textAnchor="end"
              dominantBaseline="middle"
              fontSize={10}
              fill={MUTED}
            >
              {value}
            </text>
          </g>
        ))}

        <line
          x1={paddingLeft}
          x2={paddingLeft}
          y1={paddingTop}
          y2={paddingTop + plotHeight}
          stroke={AXIS}
          strokeWidth={1}
        />
        <line
          x1={paddingLeft}
          x2={width - paddingRight}
          y1={paddingTop + plotHeight}
          y2={paddingTop + plotHeight}
          stroke={AXIS}
          strokeWidth={1}
        />

        {buckets.map((bucket, i) => {
          const bandX = paddingLeft + i * bandWidth;
          const centerX = bandX + bandWidth / 2;
          const recordedX = centerX - barWidth - gap / 2;
          const capacityX = centerX + gap / 2;
          const recordedH = (bucket.recordedHours / niceMax) * plotHeight;
          const capacityH = (bucket.capacityHours / niceMax) * plotHeight;

          return (
            <g key={bucket.key}>
              <path
                d={roundedTopBar(
                  recordedX,
                  paddingTop + plotHeight - recordedH,
                  barWidth,
                  recordedH,
                  4,
                )}
                fill={COLOR_RECORDED}
              >
                <title>{`${bucket.fullLabel}: ${bucket.recordedHours}h recorded`}</title>
              </path>
              <path
                d={roundedTopBar(
                  capacityX,
                  paddingTop + plotHeight - capacityH,
                  barWidth,
                  capacityH,
                  4,
                )}
                fill={COLOR_CAPACITY}
              >
                <title>{`${bucket.fullLabel}: ${bucket.capacityHours}h capacity`}</title>
              </path>
              <text
                x={centerX}
                y={paddingTop + plotHeight + 16}
                textAnchor="middle"
                fontSize={9}
                fill={MUTED}
              >
                {bucket.shortLabel}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
