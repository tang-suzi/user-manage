<template>
  <div class="knowledge-page">
    <!-- 搜索区 -->
    <div class="search-bar">
      <el-input
        v-model="keyword"
        placeholder="搜索异常核型知识库"
        class="search-input"
        clearable
        @keyup.enter.native="handleSearch"
      />
      <el-button
        type="primary"
        @click="handleSearch"
        :disabled="!keyword"
        class="search-btn"
      >
        知识检索
      </el-button>
    </div>

    <!-- 结果区 -->
    <div class="results-area" v-if="list.length">
      <div class="results-header">共 {{ total }} 条结果</div>

      <!-- 表格滚动容器 -->
      <div
        class="table-container"
        ref="tableContainer"
        v-infinite-scroll="handleScroll"
      >
        <el-table
          :data="list"
          style="width: 100%"
          v-loading="loading"
          header-cell-class-name="table-header"
        >
          <el-table-column
            type="index"
            label="条目"
            width="80"
            align="center"
          />

          <el-table-column
            prop="exprssion"
            label="异常核型"
            width="150"
            align="center"
          />

          <el-table-column
            prop="disease"
            label="对应疾病"
            width="150"
            align="center"
          />

          <el-table-column
            prop="associatedGenes"
            label="核心关联基因"
            width="120"
            align="center"
          />

          <el-table-column
            prop="protein"
            label="相关蛋白及功能"
            min-width="200"
            align="left"
            header-align="center"
          />

          <el-table-column
            prop="clinicalFeatures"
            label="临床特征"
            min-width="200"
            align="left"
            header-align="center"
          />

          <el-table-column
            prop="proInter"
            label="预后与干预"
            min-width="200"
            align="left"
            header-align="center"
          />

          <el-table-column
            prop="autoLitAbstract"
            label="相关文献简述"
            min-width="150"
            align="center"
          >
            <template slot-scope="{ row }">
              {{ row.autoLitAbstract || "-" }}
            </template>
          </el-table-column>

          <el-table-column label="参考文献" width="100" align="center">
            <template slot-scope="{ row }">
              <div class="pdf-link" @click="handleDownload(row)">
                <i class="el-icon-document pdf-icon"></i>
                <div>参考文献</div>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <!-- 底部加载提示 -->
        <div class="load-tip">
          <span v-if="isLoadingMore">加载中...</span>
          <span v-else-if="!hasMore">没有更多数据了</span>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div class="empty-state" v-else>
      <div class="no-result-text">未匹配到结果</div>
    </div>
  </div>
</template>

<script>
import { getKnowledgeList, downloadKnowledgePdf } from "@/api/knowledge";

export default {
  name: "KnowledgeBase",
  data() {
    return {
      keyword: "",
      list: [],
      total: 0,
      page: 1,
      pageSize: 10,

      loading: false,
      isLoadingMore: false,
      hasMore: true,
    };
  },
  methods: {
    async handleDownload(row) {
      try {
        const blob = await downloadKnowledgePdf({ id: row.id });
        const pdfBlob = new Blob([blob], { type: "application/pdf" });
        const url = window.URL.createObjectURL(pdfBlob);

        const link = document.createElement("a");
        link.href = url;
        link.download = "培训资料.pdf";
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (e) {
        console.error(e);
      }
    },

    handleSearch() {
      if (!this.keyword) return;

      this.page = 1;
      this.list = [];
      this.hasMore = true;

      this.fetchData();
    },

    async fetchData() {
      if (!this.hasMore) return;

      this.loading = true;
      this.isLoadingMore = this.page > 1;

      try {
        const { records, total } = await getKnowledgeList({
          keyword: this.keyword,
          page: this.page,
          size: this.pageSize,
        });

        const data = records || [];

        this.list = this.page === 1 ? data : this.list.concat(data);

        this.total = total || 0;

        if (data.length < this.pageSize) {
          this.hasMore = false;
        }
      } catch (e) {
        this.$message.error(e.message || "获取知识库列表失败");
      } finally {
        this.loading = false;
        this.isLoadingMore = false;
      }
    },

    handleScroll() {
      this.page++;
      this.fetchData();
    },
  },
};
</script>

<style lang="scss" scoped>
.knowledge-page {
  height: calc(100% - 40px);
  display: flex;
  flex-direction: column;
  padding: 20px;
  background: #fff;
}

.search-bar {
  display: flex;
  justify-content: center;
  margin: 20px 0 30px;

  .search-input {
    width: 600px;

    ::v-deep .el-input__inner {
      height: 40px;
    }
  }

  .search-btn {
    height: 40px;
    padding: 0 30px;
  }
}

.results-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .results-header {
    margin-bottom: 10px;
    color: #606266;
  }
}

.table-container {
  flex: 1;
  overflow-y: auto;
  border: 1px solid #ebeef5;
}

.load-tip {
  text-align: center;
  padding: 10px;
  color: #909399;
}

.empty-state {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;

  .no-result-text {
    color: #909399;
    font-size: 16px;
  }
}

::v-deep .table-header {
  background-color: #f5f7fa;
  font-weight: bold;
}

.pdf-link {
  cursor: pointer;
  color: #606266;
  display: flex;
  flex-direction: column;
  align-items: center;

  .pdf-icon {
    font-size: 22px;
    color: #f56c6c;
  }

  &:hover {
    color: #409eff;
  }
}
</style>
