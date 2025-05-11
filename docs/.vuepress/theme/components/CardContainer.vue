<template>
  <div class="card-container" :style="cardStyle">
    <!-- 标题区域（可通过插槽或props自定义） -->
    <div v-if="title || $slots.title" class="card-header">
      <slot name="title">
        <h3 class="card-title">{{ title }}</h3>
      </slot>
    </div>

    <!-- 内容区域（默认插槽） -->
    <div class="card-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  width: {
    type: [String, Number],
    default: "100%",
  },
  padding: {
    type: String,
    default: "1rem",
  },
});

// 计算卡片样式
const cardStyle = computed(() => ({
  width: typeof props.width === "number" ? `${props.width}px` : props.width,
  padding: props.padding,
}));
</script>

<style scoped>
.card-container {
  transition: all 0.3s ease;

  background: rgba(255, 255, 255, 0.38);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.card-container:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.card-header {
  padding-bottom: 0.75rem;
  margin-bottom: 0.75rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.card-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
}

.card-content {
  padding: 10px 20px;
  color: #666;
  line-height: 1.6;
}
</style>
