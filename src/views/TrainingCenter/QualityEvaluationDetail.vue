<template>
  <div class="evaluation-detail">
    <!-- Top Bar with Back Button (optional, though design shows it at bottom) -->
    <div class="bottom-actions">
      <el-button
        type="primary"
        size="small"
        @click="handleExam"
        class="action-btn"
        >开始考试</el-button
      >
      <el-button
        type="primary"
        size="small"
        @click="handleBack"
        class="action-btn"
        >返回</el-button
      >
    </div>
    <!-- Content Area -->
    <div class="content-wrapper" v-loading="loading">
      <!-- Score Display -->
      <div class="score-header">
        <div class="score-text">分数: {{ score }}</div>
      </div>

      <!-- Questions List -->
      <div class="questions-list">
        <div
          v-for="item in detailList"
          :key="item.questionId"
          class="question-item"
        >
          <!-- Status Icon -->
          <div class="status-icon">
            <i v-if="item.isRight" class="el-icon-check correct"></i>
            <i v-else class="el-icon-close wrong"></i>
          </div>

          <!-- Question Content -->
          <div class="question-content">
            <div class="question-text">
              <span class="index">{{ item.questionId }}. </span>
              {{ item.questionContent }}
            </div>

            <!-- Image -->
            <div class="karyotype-image">
              <div
                v-for="img in item.questionImg"
                :key="img"
                class="image-container"
              >
                <img :src="img" alt="Karyotype" />
              </div>
            </div>

            <!-- Answer Section -->
            <div class="answer-section">
              <div class="input-wrapper">
                <el-input
                  v-model="item.answer"
                  type="textarea"
                  disabled
                  size="small"
                  class="answer-input"
                ></el-input>
                <!-- Wrong Answer Marker (Image style) -->
                <!-- <div v-if="!item.isCorrect" class="wrong-mark">
                  <span class="correct-answer">{{ item.questionContent }}</span>
                </div> -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getQualityDetail } from "@/api/training";

export default {
  name: "QualityEvaluationDetail",
  data() {
    return {
      loading: false,
      score: 0, // Default or fetched
      detailList: [],
      paperId: "",
      qualityId: "",
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      this.loading = true;
      const id = this.$route.query.qualityId;
      try {
        const { paperId, qualityId, score, trainRandomQuestionInfoList } =
          await getQualityDetail({ qualityId: id });
        this.detailList = trainRandomQuestionInfoList;
        this.paperId = paperId;
        this.qualityId = qualityId;
        this.score = Math.round((score / this.detailList.length) * 100);
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    handleExam() {
      this.$router.push({
        path: "/TrainingCenter/QualityEvaluationExam",
        query: {
          paperId: this.paperId,
          qualityId: this.qualityId,
        },
      });
    },
    handleBack() {
      this.$router.go(-1);
    },
  },
};
</script>

<style lang="scss" scoped>
.evaluation-detail {
  height: 100%;
  background-color: #fff;
  overflow-y: auto;
  padding: 20px;
  box-sizing: border-box;
  position: relative;

  .content-wrapper {
    max-width: 1200px;
    margin: 0 auto;
    position: relative;
    padding-bottom: 60px;
  }

  .score-header {
    position: absolute;
    top: 0;
    right: 0;
    text-align: right;
    z-index: 10;

    .score-text {
      font-size: 32px;
      font-weight: normal;
      color: #303133;
    }
  }

  .questions-list {
    margin-top: 40px;
  }

  .question-item {
    margin-bottom: 40px;
    position: relative;
    padding-left: 30px;

    .status-icon {
      position: absolute;
      left: -10px;
      top: 0;
      font-size: 40px;
      font-weight: bold;

      .correct {
        color: #67c23a;
      }

      .wrong {
        color: #f56c6c;
      }
    }

    .question-content {
      .question-text {
        font-size: 16px;
        color: #303133;
        margin-bottom: 15px;
        line-height: 1.5;
        font-weight: 500;
        padding-right: 150px; // Avoid overlapping with score
      }

      .karyotype-image {
        margin-bottom: 15px;
        width: 100%;
        overflow: auto;
        .image-container {
          margin-right: 10px;
          display: inline-block;
        }
        img {
          width: 200px;
          height: auto;
          display: inline-block;
          // border: 1px solid #ebeef5;
        }
      }

      .answer-section {
        .input-wrapper {
          // display: flex;
          // align-items: center;
          // gap: 10px;
          width: 100%;
          position: relative;

          .answer-input {
            width: 500px;
            margin-right: 10px;
          }

          .wrong-mark {
            display: inline-block;
            border: 1px solid #f56c6c;
            padding: 2px 8px;
            border-radius: 4px;
            background-color: #fff;
            width: calc(100% - 550px);

            .correct-answer {
              color: #f56c6c;
              font-size: 14px;
              font-weight: bold;
            }
          }
        }
      }
    }
  }

  .bottom-actions {
    display: flex;
    justify-content: flex-end;
    gap: 20px;
    margin-top: 40px;
    padding-top: 20px;
    border-top: 1px solid #ebeef5;

    .action-btn {
      width: 100px;
    }
  }
}
</style>
