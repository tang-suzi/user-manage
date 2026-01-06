<template>
  <div class="training-page">
    <!-- Top Bar -->
    <div class="top-bar">
      <div class="tabs">
        <div
          v-for="tab in tabs"
          :key="tab.value"
          class="tab-item"
          :class="{ active: currentTab === tab.value }"
          @click="handleTabClick(tab.value)"
        >
          {{ tab.label }}
        </div>
      </div>
      <div class="actions">
        <div
          v-if="currentTab === 'practice' && isSubmitted"
          class="score-display"
        >
          分数: {{ score }}
        </div>
        <el-button
          v-if="currentTab !== 'practice'"
          size="small"
          @click="handleTabClick('practice')"
          >开始练习</el-button
        >
        <el-button v-if="currentTab !== 'practice'" size="small"
          >开始考试</el-button
        >
      </div>
    </div>

    <!-- Main Content -->
    <div
      class="content-area"
      :class="{
        'practice-mode':
          currentTab === 'practice' || currentTab === 'evaluation',
      }"
    >
      <training-video v-if="currentTab === 'video'" />

      <online-practice
        v-if="currentTab === 'practice'"
        @update:score="handleScoreUpdate"
        @update:isSubmitted="handleStatusUpdate"
      />

      <quality-evaluation v-if="currentTab === 'evaluation'" />
    </div>
  </div>
</template>

<script>
import TrainingVideo from "./components/TrainingVideo";
import OnlinePractice from "./components/OnlinePractice";
import QualityEvaluation from "./components/QualityEvaluation";

export default {
  name: "TrainingCenter",
  components: {
    TrainingVideo,
    OnlinePractice,
    QualityEvaluation,
  },
  data() {
    return {
      currentTab: "video",
      tabs: [
        { label: "培训视频", value: "video" },
        { label: "在线练习", value: "practice" },
        { label: "多中心质量评价", value: "evaluation" },
      ],
      isSubmitted: false,
      score: 0,
    };
  },
  created() {
    this.currentTab = localStorage.getItem("currentTab") || "video";
  },
  methods: {
    handleTabClick(tabValue) {
      this.currentTab = tabValue;
      localStorage.setItem("currentTab", tabValue);
      if (tabValue !== "practice") {
        this.isSubmitted = false;
        this.score = 0;
      }
    },
    handleScoreUpdate(val) {
      this.score = val;
    },
    handleStatusUpdate(val) {
      this.isSubmitted = val;
    },
  },
};
</script>

<style lang="scss" scoped>
.training-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px;
  box-sizing: border-box;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-shrink: 0;

  .tabs {
    display: flex;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    overflow: hidden;

    .tab-item {
      padding: 10px 20px;
      cursor: pointer;
      background-color: #fff;
      border-right: 1px solid #dcdfe6;
      font-size: 14px;
      color: #606266;

      &:last-child {
        border-right: none;
      }

      &.active {
        background-color: #e6e6e6;
        color: #303133;
        font-weight: 500;
      }

      &:hover:not(.active) {
        color: #409eff;
      }
    }
  }

  .actions {
    display: flex;
    align-items: center;
    gap: 15px;

    .score-display {
      font-size: 24px;
      font-weight: bold;
      color: #303133;
    }
  }
}

.content-area {
  flex: 1;
  display: flex;
  overflow: hidden;
  border: 1px solid #dcdfe6;
  padding: 10px;
  gap: 10px;

  &.practice-mode {
    border: none;
    padding: 0;
  }
}
</style>
