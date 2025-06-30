<template>
  <div class="relative">
    <canvas ref="canvasRef" class="p-4"></canvas>
    <div
      v-if="showLabel"
      class="absolute inset-0 flex items-start justify-start pointer-events-none"
    >
      <span :style="{ color: labelColor }" class="text-xl font-bold">
        {{ value }}%
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import {
  Chart,
  ArcElement,
  Tooltip,
  type ChartOptions,
  type ChartData,
  DoughnutController,
  Legend,
} from "chart.js";

Chart.register(ArcElement, Tooltip, DoughnutController, Legend);

const props = defineProps<{
  value: number;
  greenColor?: string;
  redColor?: string;
  borderWidth?: number;
  borderColor?: string;
  thickness?: number;
  cutout?: string;
  arcCutout?: string;
  arcSpacing?: number;
  hoverOffset?: number;
  hoverBorderWidth?: number;
  hoverBorderColor?: string;
  showTooltip?: boolean;
  showLegend?: boolean;
  animate?: boolean;
  showLabel?: boolean;
  labelColor?: string;
}>();

const {
  value,
  greenColor = "#22c55e",
  redColor = "#ef4444",
  borderWidth = 10,
  borderColor = "#FFFFFF",
  thickness = 20,
  cutout = "75%",
  arcSpacing = 20,
  hoverOffset = 2,
  hoverBorderWidth = 0,
  hoverBorderColor = "#000",
  showTooltip = true,
  showLegend = false,
  animate = true,
  showLabel = true,
  labelColor = "#000",
} = props;

const canvasRef = ref<HTMLCanvasElement | null>(null);
let chart: Chart | null = null;

// Watch value changes
watch(
  () => value,
  () => {
    if (chart) updateChart();
  }
);

onMounted(() => {
  if (canvasRef.value) {
    renderChart();
  }
});

// ✅ Render chart
function renderChart() {
  if (!canvasRef.value) return;
  const ctx = canvasRef.value.getContext("2d");
  if (!ctx) return;

  chart = new Chart(ctx, {
    type: "doughnut",
    data: {
      datasets: [
        {
          // Actual data: first part (value), second part (remainder to 100)
          data: [value, 100 - value],

          // Arc fill colors (or gradient if needed)
          backgroundColor: [greenColor, redColor],

          // Space between arcs (no border if 0)
          borderWidth: borderWidth, // Default: 0 or 10

          // Border color if needed (usually transparent)
          borderColor: borderColor, // e.g. "transparent" or "#fff"

          // Radius for rounding arc ends (nice rounded edges)
          borderRadius: thickness, // 0–50 looks best

          // 180 degrees (half circle), 360 for full, etc.
          circumference: 180, // in degrees

          // Start angle, -90 = bottom center (top = -180 or 90)
          rotation: -90,

          // Arc thickness as ratio or pixel (overrides cutout in options)

          // Arc spacing, if you want a gap between arcs
          spacing: arcSpacing, // e.g. 0–10

          // Hover effects
          hoverOffset: hoverOffset, // e.g. 6 (makes arc pop out on hover)
          hoverBorderWidth: hoverBorderWidth, // e.g. 0–4
          hoverBorderColor: hoverBorderColor, // e.g. "#000"

          // Custom ID for the dataset (if managing multiple)

          // If you want different arc cap styles (usually "butt", "round", "square")
          borderJoinStyle: "miter",

          // You can disable animations for this dataset
          animations: {
            numbers: {
              type: "number",
              duration: 2000,
              easing: "easeOutQuart",
            },
          },
        },
      ],
    },
    options: {
      responsive: true,
      animation: animate,
      cutout,
      plugins: {
        tooltip: { enabled: showTooltip },
        legend: { display: showLegend },
      },
    } as ChartOptions<"doughnut">,
  });
}

// ✅ Update chart data
function updateChart() {
  if (!chart) return;
  chart.data.datasets[0].data = [value, 100 - value];
  chart.update();
}
</script>
