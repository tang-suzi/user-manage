<template>
  <div class="practice-container">
    <div class="practice-header">
      <el-button type="primary" @click="reRandomQuality">重新抽题</el-button>
    </div>
    <div class="practice-list">
      <div
        v-for="(item, index) in practiceList"
        :key="item.id"
        class="practice-item"
      >
        <div class="question-header">
          <span class="question-index">{{ index + 1 }}. </span>
          <span class="question-content">{{ item.questionContent }}</span>
        </div>

        <div class="karyotype-image">
          <div
            v-for="img in item.questionImg"
            style="display: inline-block"
            :key="img"
          >
            <el-image
              style="width: 100px; height: 100px; margin-left: 10px"
              :src="img"
              :preview-src-list="item.questionImg"
            >
            </el-image>
          </div>
        </div>

        <div class="answer-section">
          <el-input
            type="textarea"
            v-model="item.answer"
            placeholder="请输入核型结果"
            :disabled="isSubmitted"
            size="small"
            class="answer-input"
          />
        </div>
      </div>
    </div>

    <div class="practice-footer">
      <el-button type="primary" @click="handleSubmit">提交</el-button>
    </div>
  </div>
</template>

<script>
import {
  getRandomQuality,
  judgeQuality,
  getReRandomQuality,
} from "@/api/training";

export default {
  name: "OnlinePractice",
  data() {
    return {
      paperId: "",
      practiceList: [],
      isSubmitted: false,
      score: 0,
    };
  },
  created() {
    this.fetchRandomQualityData();
  },
  methods: {
    // 重新抽题
    async reRandomQuality() {
      // e.校验是否有未提交数据，含未提交数据提示：“本次答题将不被记录，是否重新抽题？”【确认】【继续答题】
      if (!this.isSubmitted) {
        this.$confirm("本次答题将不被记录，是否重新抽题？", "确认重新抽题", {
          confirmButtonText: "确认",
          cancelButtonText: "继续答题",
          type: "warning",
        })
          .then(async () => {
            try {
              const params = {
                paperId: this.paperId,
              };
              let { trainRandomQuestionInfoList, paperId } =
                await getReRandomQuality(params);
              this.paperId = paperId;
              this.practiceList = trainRandomQuestionInfoList;
            } catch (error) {
              console.error("重新抽题失败:", error);
            }
          })
          .catch(() => {
            return;
          });
      } else {
        this.fetchRandomQualityData();
      }
    },
    async fetchRandomQualityData() {
      this.isSubmitted = false;
      this.score = 0;
      this.$emit("update:score", 0);
      this.$emit("update:isSubmitted", false);
      try {
        // const { trainRandomQuestionInfoList, paperId, startTime } = await getPracticeList();
        const { trainRandomQuestionInfoList, paperId } =
          await getRandomQuality();
        this.paperId = paperId;
        this.practiceList = trainRandomQuestionInfoList;
      } catch (error) {
        console.error("获取练习题失败:", error);
      }
    },
    async handleSubmit() {
      const params = {
        paperId: this.paperId,
        trainRandomQuestionInfoList: this.practiceList,
      };
      // 校验是否有未填写数据
      if (this.practiceList.some((item) => !item.answer)) {
        this.$message({
          message: "请填写所有问题答案",
          type: "warning",
        });
        return;
      }
      this.$confirm("确认提交吗？", "确认提交", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          try {
            await judgeQuality(params);
            this.$message({
              message: "提交成功",
              type: "success",
            });
            this.isSubmitted = true;
          } catch (error) {
            console.error("提交失败:", error);
          }
        })
        .catch(() => {
          return;
        });
    },
    resetPractice() {
      this.fetchPracticeData();
    },
  },
};
</script>

<style lang="scss" scoped>
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

  .practice-header {
    text-align: right;
  }

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
</style>
