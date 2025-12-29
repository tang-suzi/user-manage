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
        <el-button v-if="currentTab !== 'practice'" size="small"
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
      <!-- Video Tab Content -->
      <template v-if="currentTab === 'video'">
        <!-- Left Player -->
        <div class="player-section">
          <div class="player-container" v-if="!currentVideoUrl">
            <div class="cross-line line-1"></div>
            <div class="cross-line line-2"></div>
            <span class="player-text">视频播放器</span>
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

        <!-- Right List -->
        <div class="list-section">
          <div
            v-for="item in videoList"
            :key="item.id"
            class="video-item"
            @click="playVideo(item)"
          >
            <div class="video-cover">
              <div class="cover-cross line-1"></div>
              <div class="cover-cross line-2"></div>
            </div>
            <div class="video-title">{{ item.title }}</div>
          </div>
        </div>
      </template>

      <!-- Practice Tab Content -->
      <template v-if="currentTab === 'practice'">
        <div class="practice-container">
          <div class="practice-list">
            <div
              v-for="(item, index) in practiceList"
              :key="item.id"
              class="practice-item"
            >
              <div class="question-header">
                <span class="question-index">{{ index + 1 }}. </span>
                <span class="question-content">{{ item.content }}</span>
                <!-- Result Indicator -->
                <i
                  v-if="isSubmitted && item.isCorrect"
                  class="el-icon-check correct-icon"
                ></i>
                <i
                  v-if="isSubmitted && !item.isCorrect"
                  class="el-icon-close wrong-icon"
                ></i>
              </div>

              <div class="karyotype-image">
                <img :src="item.imageUrl" alt="Karyotype" />
              </div>

              <div class="answer-section">
                <el-input
                  v-model="item.userAnswer"
                  placeholder="请输入核型结果"
                  :disabled="isSubmitted"
                  size="small"
                  class="answer-input"
                ></el-input>
                <div
                  v-if="isSubmitted && !item.isCorrect"
                  class="correct-answer"
                >
                  参考答案: {{ item.correctAnswer }}
                </div>
              </div>
            </div>
          </div>

          <div class="practice-footer">
            <el-button type="primary" @click="handleSubmit" v-if="!isSubmitted"
              >提交</el-button
            >
            <el-button type="primary" @click="resetPractice" v-else
              >再次练习</el-button
            >
          </div>
        </div>
      </template>

      <!-- Evaluation Tab Content -->
      <template v-if="currentTab === 'evaluation'">
        <div class="evaluation-container">
          <div class="table-container">
            <el-table
              :data="evaluationList"
              style="width: 100%"
              height="100%"
              v-loading="loading"
              header-cell-class-name="table-header"
            >
              <el-table-column
                type="index"
                label="序号"
                width="80"
                align="center"
              >
              </el-table-column>
              <el-table-column
                prop="centerName"
                label="中心名称"
                align="center"
              >
              </el-table-column>
              <el-table-column prop="startTime" label="开始时间" align="center">
              </el-table-column>
              <el-table-column prop="endTime" label="结束时间" align="center">
              </el-table-column>
              <el-table-column prop="score" label="得分" align="center">
              </el-table-column>
              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    size="small"
                    @click="handleViewDetail(scope.row)"
                    >查看详情</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </div>

          <div class="pagination">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="page"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="limit"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
            >
            </el-pagination>
          </div>

          <!-- Detail Dialog -->
          <el-dialog
            :title="currentDetailRow.centerName + ' - 详情'"
            :visible.sync="detailDialogVisible"
            width="70%"
            append-to-body
          >
            <div class="detail-content" v-loading="detailLoading">
              <div
                v-for="(item, index) in detailList"
                :key="item.id"
                class="practice-item detail-item"
              >
                <div class="question-header">
                  <span class="question-index">{{ index + 1 }}. </span>
                  <span class="question-content">{{ item.content }}</span>
                  <i
                    v-if="item.isCorrect"
                    class="el-icon-check correct-icon"
                  ></i>
                  <i v-else class="el-icon-close wrong-icon"></i>
                  <span
                    class="score-tag"
                    :class="{ 'is-correct': item.isCorrect }"
                  >
                    {{ item.isCorrect ? "得分: " + item.score : "得分: 0" }}
                  </span>
                </div>

                <div class="karyotype-image">
                  <img :src="item.imageUrl" alt="Karyotype" />
                </div>

                <div class="answer-section">
                  <div class="detail-answer-row">
                    <span class="label">提交答案:</span>
                    <span
                      class="value"
                      :class="{ 'error-text': !item.isCorrect }"
                      >{{ item.userAnswer }}</span
                    >
                  </div>
                  <div class="detail-answer-row" v-if="!item.isCorrect">
                    <span class="label">参考答案:</span>
                    <span class="value success-text">{{
                      item.correctAnswer
                    }}</span>
                  </div>
                </div>
              </div>
            </div>
          </el-dialog>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import {
  getTrainingVideoList,
  getPracticeList,
  getEvaluationList,
  getEvaluationDetail,
} from "@/api/training";

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
      practiceList: [],
      isSubmitted: false,
      score: 0,
      // Evaluation Data
      evaluationList: [],
      loading: false,
      page: 1,
      limit: 20,
      total: 0,
      // Evaluation Detail
      detailDialogVisible: false,
      detailLoading: false,
      detailList: [],
      currentDetailRow: {},
      currentVideoUrl: "",
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    handleTabClick(tabValue) {
      this.currentTab = tabValue;
      if (tabValue === "video" && this.videoList.length === 0) {
        this.fetchData();
      } else if (tabValue === "practice") {
        this.fetchPracticeData();
      } else if (tabValue === "evaluation") {
        this.fetchEvaluationData();
      }
    },
    fetchData() {
      getTrainingVideoList().then((res) => {
        this.videoList = res.data.items;
        if (this.videoList.length > 0) {
          this.currentVideoUrl = this.videoList[0].videoUrl;
        }
      });
    },
    playVideo(item) {
      this.currentVideoUrl = item.videoUrl;
    },
    fetchPracticeData() {
      this.isSubmitted = false;
      this.score = 0;
      getPracticeList().then((res) => {
        this.practiceList = res.data.items.map((item) => ({
          ...item,
          userAnswer: "",
          isCorrect: false,
        }));
      });
    },
    handleSubmit() {
      let correctCount = 0;
      this.practiceList.forEach((item) => {
        if (
          item.userAnswer.trim().toLowerCase() ===
          item.correctAnswer.toLowerCase()
        ) {
          item.isCorrect = true;
          correctCount++;
        } else {
          item.isCorrect = false;
        }
      });

      this.score = Math.round((correctCount / this.practiceList.length) * 100);
      this.isSubmitted = true;
    },
    resetPractice() {
      this.fetchPracticeData();
    },
    // Evaluation Methods
    fetchEvaluationData() {
      this.loading = true;
      getEvaluationList({ page: this.page, limit: this.limit })
        .then((res) => {
          this.evaluationList = res.data.items;
          this.total = res.data.total;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    handleSizeChange(val) {
      this.limit = val;
      this.fetchEvaluationData();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.fetchEvaluationData();
    },
    handleViewDetail(row) {
      this.currentDetailRow = row;
      this.detailDialogVisible = true;
      this.detailList = [];
      getEvaluationDetail({ id: row.id }).then((res) => {
        this.detailList = res.data.items;
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

/* Practice Mode Styles */
.practice-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: #fff;
  border: 1px solid #dcdfe6;
  padding: 20px;
  box-sizing: border-box;

  .practice-list {
    flex: 1;
    overflow-y: auto;
    padding-right: 10px;
  }

  .practice-item {
    margin-bottom: 40px;

    .question-header {
      font-size: 16px;
      color: #303133;
      margin-bottom: 15px;
      line-height: 1.5;
      display: flex;
      align-items: center;

      .question-index {
        font-weight: bold;
        margin-right: 5px;
      }

      .correct-icon {
        color: #67c23a;
        font-size: 20px;
        font-weight: bold;
        margin-left: 10px;
      }

      .wrong-icon {
        color: #f56c6c;
        font-size: 20px;
        font-weight: bold;
        margin-left: 10px;
      }
    }

    .karyotype-image {
      margin-bottom: 15px;
      img {
        max-width: 100%;
        height: auto;
        border: 1px solid #e4e7ed;
        display: block;
      }
    }

    .answer-section {
      max-width: 400px;

      .answer-input {
        margin-bottom: 5px;
      }

      .correct-answer {
        font-size: 14px;
        color: #f56c6c;
        margin-top: 5px;
      }
    }
  }

  .practice-footer {
    padding-top: 20px;
    border-top: 1px solid #ebeef5;
    text-align: center;
    flex-shrink: 0;
  }
}

/* Evaluation Mode Styles */
.evaluation-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border: 1px solid #dcdfe6;
  padding: 0;
  box-sizing: border-box;
  overflow: hidden;

  .table-container {
    flex: 1;
    overflow: hidden;
    padding: 20px 20px 0 20px;
  }

  .pagination {
    padding: 20px;
    text-align: center;
    flex-shrink: 0;
  }
}

::v-deep .table-header {
  background-color: #f5f7fa !important;
  color: #606266;
  font-weight: bold;
}

.detail-content {
  max-height: 60vh;
  overflow-y: auto;
  padding: 10px;

  .detail-item {
    margin-bottom: 30px;
    border-bottom: 1px solid #ebeef5;
    padding-bottom: 20px;

    &:last-child {
      border-bottom: none;
    }
  }

  .question-header {
    font-size: 16px;
    color: #303133;
    margin-bottom: 15px;
    line-height: 1.5;
    display: flex;
    align-items: center;

    .question-index {
      font-weight: bold;
      margin-right: 5px;
    }

    .correct-icon {
      color: #67c23a;
      font-size: 20px;
      font-weight: bold;
      margin-left: 10px;
    }

    .wrong-icon {
      color: #f56c6c;
      font-size: 20px;
      font-weight: bold;
      margin-left: 10px;
    }

    .score-tag {
      margin-left: auto;
      padding: 4px 10px;
      border-radius: 4px;
      background-color: #fef0f0;
      color: #f56c6c;
      font-size: 14px;
      font-weight: bold;

      &.is-correct {
        background-color: #f0f9eb;
        color: #67c23a;
      }
    }
  }

  .karyotype-image {
    margin-bottom: 15px;
    img {
      max-width: 100%;
      height: auto;
      border: 1px solid #e4e7ed;
      display: block;
    }
  }

  .answer-section {
    .detail-answer-row {
      margin-bottom: 8px;
      font-size: 14px;

      .label {
        font-weight: bold;
        color: #606266;
        margin-right: 10px;
      }

      .value {
        color: #303133;
      }

      .error-text {
        color: #f56c6c;
      }
      .success-text {
        color: #67c23a;
      }
    }
  }
}
</style>
