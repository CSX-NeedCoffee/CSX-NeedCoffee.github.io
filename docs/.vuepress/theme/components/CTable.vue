<template>
  <div class="merge-table-container">
    <table class="merge-table">
      <thead>
        <tr>
          <th
            v-for="(col, colIndex) in columns"
            :key="colIndex"
            :rowspan="col.rowspan || 1"
            :colspan="col.colspan || 1"
            :style="{ width: col.width || 'auto' }"
          >
            {{ col.title }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, rowIndex) in processedData" :key="rowIndex">
          <td
            v-for="(cell, cellIndex) in row.cells"
            :key="cellIndex"
            :rowspan="cell.rowspan"
            :colspan="cell.colspan"
            :class="{ 'merged-cell': cell.isMerged }"
            :style="{ width: cell.width || 'auto' }"
          >
            <div class="cell-content">
              {{ cell.value }}
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  columns: {
    type: Array,
    required: true,
    default: () => [],
    validator: (cols) => cols.every((col) => "key" in col && "title" in col),
  },
  data: {
    type: Array,
    required: true,
    default: () => [],
  },
  mergeConfig: {
    type: Object,
    default: () => ({}),
    validator: (config) => {
      return Object.values(config).every((items) =>
        items.every(
          (item) => "row" in item && "rowspan" in item && "colspan" in item
        )
      );
    },
  },
  backgroundImage: {
    type: String,
    default: "",
  },
  backgroundOpacity: {
    type: Number,
    default: 0.1,
    validator: (value) => value >= 0 && value <= 1,
  },
});

const hasBackground = computed(() => !!props.backgroundImage);

// 预处理数据，计算合并信息
const processedData = computed(() => {
  const result = [];
  const mergedCells = new Set();

  props.data.forEach((row, rowIndex) => {
    const processedRow = { original: row, cells: [] };

    props.columns.forEach((col, colIndex) => {
      const cellKey = `${rowIndex}-${colIndex}`;

      // 跳过已合并的单元格
      if (mergedCells.has(cellKey)) return;

      // 查找当前列的合并配置
      const colKey = col.key;
      const mergeInfo = props.mergeConfig[colKey]?.find(
        (item) => item.row === rowIndex
      );

      if (mergeInfo) {
        // 标记合并范围内的所有单元格
        for (let r = 0; r < mergeInfo.rowspan; r++) {
          for (let c = 0; c < mergeInfo.colspan; c++) {
            if (r === 0 && c === 0) continue; // 跳过起始单元格
            mergedCells.add(`${rowIndex + r}-${colIndex + c}`);
          }
        }

        processedRow.cells.push({
          value: row[colKey],
          rowspan: mergeInfo.rowspan,
          colspan: mergeInfo.colspan,
          isMerged: true,
          width: col.width,
        });
      } else {
        processedRow.cells.push({
          value: row[colKey],
          rowspan: 1,
          colspan: 1,
          isMerged: false,
          width: col.width,
        });
      }
    });

    result.push(processedRow);
  });

  return result;
});
</script>

<style scoped>
.vp-doc table {
  display: table;
  margin: 10px 0;
}

.merge-table-container {
  width: 100%;
  overflow-x: auto;
  position: relative;
}

/* 背景图片样式 */
.merge-table-container::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: v-bind(
    'props.backgroundImage ? `url(${props.backgroundImage})` : "none"'
  );
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  opacity: v-bind("props.backgroundOpacity");
  pointer-events: none;
  z-index: 0;
}

.merge-table {
  width: 100%;
  border-collapse: collapse;
  position: relative;
  z-index: 1;
  background-color: transparent;
  table-layout: fixed;
}

/* 亮色模式样式 */
:root[data-theme="light"] .merge-table th,
:root[data-theme="light"] .merge-table td {
  border: 1px solid #e0e0e0;
  color: #333;
}

:root[data-theme="light"] .merge-table th {
  background-color: #f5f7fa;
  font-weight: 600;
}

/* 暗黑模式样式 */
:root[data-theme="dark"] .merge-table th,
:root[data-theme="dark"] .merge-table td {
  border: 1px solid #444;
  color: #e0e0e0;
}

:root[data-theme="dark"] .merge-table th {
  background-color: #2a2e35;
  font-weight: 600;
}

/* 通用样式 */
.merge-table th,
.merge-table td {
  padding: 12px 16px;
  text-align: left;
  box-sizing: border-box;
}

.cell-content {
  position: relative;
  z-index: 2;
}

/* 有背景图时的单元格样式 */
.has-bg {
  background-color: rgba(255, 255, 255, 0.7);
}

:root[data-theme="dark"] .has-bg {
  background-color: rgba(0, 0, 0, 0.5);
}
</style>

<!-- 

以上图片内容为一个文字表格，请帮我将其转为我自定义vue组件的格式，如：
<c-table 
  :columns="[
    { title: 'ID', key: 'id' },
    { title: '姓名', key: 'name' },
    { title: '年龄', key: 'age' },
    { title: '地址', key: 'address' },
    { title: '部门', key: 'department' }
  ]" 
  :data="[
    { id: 1, name: '张三', age: 28, address: '北京市海淀区', department: '研发部' },
    { id: 2, name: '李四', age: 32, address: '北京市海淀区', department: '研发部' },
    { id: 3, name: '王五', age: 25, address: '上海市浦东新区', department: '市场部' },
    { id: 4, name: '赵六', age: 30, address: '上海市浦东新区', department: '市场部' },
    { id: 5, name: '钱七', age: 35, address: '广州市天河区', department: '销售部' }
  ]" 
/>

-->
