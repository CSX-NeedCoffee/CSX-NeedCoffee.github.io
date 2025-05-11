<template>
  <article class="article-card" @click="navigateToArticle">
    <div class="card-header">
      <h3 class="article-title">{{ title }}</h3>
      <time v-if="date" class="article-date">{{ formatDate(date) }}</time>
    </div>

    <p v-if="description" class="article-desc">{{ description }}</p>

    <div v-if="tags?.length" class="tag-container">
      <span v-for="tag in tags" :key="tag" class="tag">{{ tag }}</span>
    </div>
  </article>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";

const props = defineProps({
  id: {
    type: [String, Number],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  date: {
    type: [String, Date],
    default: "",
  },
  tags: {
    type: Array,
    default: () => [],
  },
  routeName: {
    type: String,
    default: "article-detail", // 对应你的路由名称
  },
});

const router = useRouter();

const formatDate = (dateString) => {
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const navigateToArticle = () => {
  router.push({
    name: props.routeName,
    params: { id: props.id },
  });
};
</script>

<style scoped lang="scss">
.article-card {
  position: relative;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 1rem;

  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.8rem;

    .article-title {
      margin: 0;
      font-size: 1.2rem;
      font-weight: 600;
      color: #333;
    }
    .article-date {
      font-size: 0.85rem;
    }
  }
  .article-desc {
    margin: 0.5rem 0 1rem;
    color: #666;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .tag-container {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;

    .tag {
      background: #f0f0f0;
      color: #555;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
    }
  }
}
</style>
