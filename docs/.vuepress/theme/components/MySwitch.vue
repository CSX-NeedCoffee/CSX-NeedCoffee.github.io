<template>
  <button
    class="switch"
    :class="{ 'switch--active': isActive }"
    @click="toggleSwitch"
    type="button"
    role="switch"
    :aria-checked="isActive"
  >
    <span class="switch__thumb"></span>
  </button>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  // 初始状态（可选）
  modelValue: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue", "onSwitch"]);

const isActive = ref(props.modelValue);

const toggleSwitch = () => {
  isActive.value = !isActive.value;
  emit("update:modelValue", isActive.value); // 支持 v-model
  emit("onSwitch", isActive.value); // 触发自定义事件
};
</script>

<style scoped>
.switch {
  position: relative;
  display: inline-block;
  width: 38px;
  height: 18px;
  border-radius: 12px;
  background-color: rgb(110 110 110 / 50%);
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
  outline: none;
}

.switch--active {
  background-color: #272727;
}

.switch__thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
}

.switch--active .switch__thumb {
  transform: translateX(20px);
}
</style>
