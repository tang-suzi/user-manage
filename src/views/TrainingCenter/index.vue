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
          @click="currentTab = tab.value"
        >
          {{ tab.label }}
        </div>
      </div>
      <div class="actions">
        <el-button size="small">开始练习</el-button>
        <el-button size="small">开始考试</el-button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="content-area">
      <!-- Left Player -->
      <div class="player-section">
        <div class="player-container">
          <div class="cross-line line-1"></div>
          <div class="cross-line line-2"></div>
          <span class="player-text">视频播放器</span>
        </div>
      </div>

      <!-- Right List -->
      <div class="list-section">
        <div v-for="item in videoList" :key="item.id" class="video-item">
          <div class="video-cover">
            <div class="cover-cross line-1"></div>
            <div class="cover-cross line-2"></div>
          </div>
          <div class="video-title">{{ item.title }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getTrainingVideoList } from "@/api/training";

export default {
  name: "TrainingCenter",
  data() {
    return {
      currentTab: "video",
      tabs: [
        { label: "培训视频", value: "video" },
        { label: "在线练习", value: "practice" },
        { label: "多中心质量评价", value: "evaluation" },
      ],
      videoList: [],
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      getTrainingVideoList().then((res) => {
        this.videoList = res.data.items;
      });
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
}

.content-area {
  flex: 1;
  display: flex;
  overflow: hidden;
  border: 1px solid #dcdfe6;
  padding: 10px;
  gap: 10px;
}

.player-section {
  flex: 1;
  background-color: #f5f7fa;
  border: 1px solid #e4e7ed;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;

  .player-container {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;

    .cross-line {
      position: absolute;
      background-color: #dcdfe6;
    }

    .line-1 {
      width: 142%; // sqrt(2) approx
      height: 1px;
      transform: rotate(32deg); // Adjust based on aspect ratio
    }
    .line-2 {
      width: 142%;
      height: 1px;
      transform: rotate(-32deg);
    }

    .player-text {
      z-index: 1;
      font-size: 18px;
      color: #909399;
      background: #f5f7fa;
      padding: 0 10px;
    }
  }
}

.list-section {
  width: 300px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding-right: 5px; // space for scrollbar

  .video-item {
    cursor: pointer;

    .video-cover {
      width: 100%;
      height: 160px;
      background-color: #e4e7ed;
      border: 1px solid #dcdfe6;
      position: relative;
      overflow: hidden;
      margin-bottom: 8px;

      .cover-cross {
        position: absolute;
        background-color: #c0c4cc;
        top: 50%;
        left: 50%;
        width: 150%;
        height: 1px;
      }
      .line-1 {
        transform: translate(-50%, -50%) rotate(25deg);
      }
      .line-2 {
        transform: translate(-50%, -50%) rotate(-25deg);
      }
    }

    .video-title {
      font-size: 14px;
      color: #606266;
      text-align: center;
    }
  }
}
</style>
