<template>
  <div class="evaluation-container">
    <div class="table-container">
      <el-table
        :data="qualityList"
        style="width: 100%"
        height="100%"
        v-loading="loading"
        header-cell-class-name="table-header"
      >
        <el-table-column type="index" label="序号" width="80" align="center">
        </el-table-column>
        <el-table-column prop="score" label="考试得分" align="center">
        </el-table-column>
        <el-table-column prop="startTime" label="开始时间" align="center">
        </el-table-column>
        <el-table-column prop="endTime" label="结束时间" align="center">
        </el-table-column>
        <el-table-column prop="usedTime" label="答题用时" align="center">
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

    <!-- Detail Dialog (Removed) -->
  </div>
</template>

<script>
import { getQualityList } from "@/api/training";

export default {
  name: "QualityEvaluation",
  data() {
    return {
      qualityList: [],
      loading: false,
      page: 1,
      limit: 20,
      total: 0,
    };
  },
  created() {
    this.fetchQualityData();
  },
  methods: {
    async fetchQualityData() {
      this.loading = true;
      try {
        console.log(123);
        const { records, total } = await getQualityList({
          page: this.page,
          size: this.limit,
        });
        console.log(records, total);
        this.qualityList = records;
        this.total = total;
      } catch (error) {
        this.$message.error(error.message || "获取质量评估数据失败");
      } finally {
        this.loading = false;
      }
    },
    handleSizeChange(val) {
      this.limit = val;
      this.fetchQualityData();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.fetchQualityData();
    },
    handleViewDetail(row) {
      this.$router.push({
        path: "/training/quality-evaluation/detail",
        query: {
          qualityId: row.qualityId,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
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
