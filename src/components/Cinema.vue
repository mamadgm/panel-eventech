<script setup lang="ts">

// Props definition with your preferred syntax
const props = withDefaults(
  defineProps<{
    height: Number;
    currentHelp?: number; // Optional number
    Selected?: string;    // Optional string
    squareSize?: number; // Define squareSize here
    cinema: number[][];   // 2D array of numbers
    allowchange?: number; // Optional flag for allowing changes
  }>(), {
  currentHelp: 0,
  squareSize: 15,
  allowchange: 0,
  cinema: () => [
    [1, 1, 1],
    [0, 0, 1],
    [2, -1, 1],
  ], // Wrap the default value in a function
}
)
// Emit definition with TypeScript support
// Emit definition
const emit = defineEmits<{
  (event: 'cellClicked', payload: { rowIndex: number; colIndex: number; cellValue: number }): void;
}>();

// Function to get cell class based on the value of the cell
const getCellClass = (cell: number): string => {
  const baseclass = " m-[0.5px] rounded-md text-center font-bold text-2xl display-none ";

  switch (cell) {
    case 1:
      return "bg-green-500 text-green-500 " + baseclass;
    case -1:
      return "bg-gray-600 text-gray-600" + baseclass;
    case 2:
      return "bg-yellow-500 text-yellow-500" + baseclass;
    case 11:
      return "bg-green-500 text-white" + baseclass;
    case 12:
      return "bg-yellow-500 text-white" + baseclass;
    default:
      return "";  // Blank or unclicked
  }
};
const get_hidden = (cell: number): string => {
  const baseclass = "text-[0px] ";

  switch (cell) {

    case 11:
      return "text-[16px]";
    case 12:
      return "text-[16px]";
    default:
      return baseclass;  // Blank or unclicked
  }
};

// Handle click to toggle between chair (1) and road (2)
const handleClick = (rowIndex: number, colIndex: number): void => {
  if (props.allowchange === 1) {
    const cellValue = props.cinema[rowIndex][colIndex];
    // Emit event with cell details
    emit("cellClicked", { rowIndex, colIndex, cellValue });
  }
};
</script>



<template>
  <div class="flex flex-col items-center bg-gray-900 rounded-lg p-4" :style="{ height: `${height}px` }">
    <div class="" :style="{
      width: `${cinema[0].length * squareSize}px`,
      height: `${cinema.length * squareSize}px`
    }">
      <div v-for="(row, rowIndex) in cinema" :key="rowIndex" class="flex">
        <div v-for="(cell, colIndex) in row" :key="colIndex" :class="getCellClass(cell)"
          :style="{ width: `${squareSize}px`, height: `${squareSize}px` }" @click="handleClick(rowIndex, colIndex)">

          <div :class="get_hidden(cell)">✔️</div>
        </div>
      </div>
    </div>
  </div>
</template>