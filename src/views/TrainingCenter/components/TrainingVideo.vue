<template>
  <div class="video-content">
    <div class="player-section">
      <div class="player-container" v-if="!currentVideoUrl">
        <span class="player-text">请在右侧选择视频进行播放</span>
      </div>
      <div class="player-container" v-else>
        <video
          :src="currentVideoUrl"
          controls
          autoplay
          style="width: 100%; height: 100%; object-fit: contain"
        ></video>
      </div>
    </div>

    <div class="list-section" v-infinite-scroll="handleScroll">
      <div
        v-for="item in videoList"
        :key="item.id"
        class="video-item"
        @click="playVideo(item)"
      >
        <div class="video-cover">
          <img
            :src="item.coverUrl"
            style="width: 100%; height: 100%; object-fit: contain"
            alt=""
          />
        </div>
        <div class="video-title">{{ item.title }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { getTrainingVideoList } from "@/api/training";

export default {
  name: "TrainingVideo",
  data() {
    return {
      page: 1,
      size: 10,
      videoList: [],
      currentVideoUrl: "",
      hasMore: true,
      loading: false,
      isLoadingMore: false,
      total: 0,
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    handleScroll() {
      this.page++;
      this.fetchData();
    },
    async fetchData() {
      if (!this.hasMore) return;

      this.loading = true;
      this.isLoadingMore = this.page > 1;
      try {
        const { total, records } = await getTrainingVideoList({
          page: this.page,
          size: this.size,
        });
        this.videoList = records;
        this.total = total || 0;
        this.hasMore = records.length >= this.size;
      } catch (error) {
        this.$message.error(error.message);
      } finally {
        this.loading = false;
        this.isLoadingMore = false;
      }
    },
    playVideo(item) {
      this.currentVideoUrl = item.playUrl;
    },
  },
};
</script>

<style lang="scss" scoped>
.video-content {
  display: flex;
  height: 100%;
  width: 100%;
  gap: 10px;
  overflow: hidden;
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

    // .cross-line {
    //   position: absolute;
    //   background-color: #dcdfe6;
    // }

    // .line-1 {
    //   width: 142%; // sqrt(2) approx
    //   height: 1px;
    //   transform: rotate(32deg); // Adjust based on aspect ratio
    // }
    // .line-2 {
    //   width: 142%;
    //   height: 1px;
    //   transform: rotate(-32deg);
    // }

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
    }

    .video-title {
      font-size: 14px;
      color: #606266;
      text-align: center;
    }
  }
}
</style>
