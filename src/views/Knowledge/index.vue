<template>
  <div class="knowledge-page">
    <!-- Search Bar -->
    <div class="search-bar">
      <el-input
        v-model="keyword"
        placeholder="搜索异常核型与知识库"
        class="search-input"
        clearable
        @keyup.enter.native="handleSearch"
      ></el-input>
      <el-button
        type="primary"
        @click="handleSearch"
        :disabled="!keyword"
        class="search-btn"
        >知识检索</el-button
      >
    </div>

    <!-- Results Area -->
    <div class="results-area" v-if="hasSearched">
      <div class="results-header">共 {{ total }} 条结果</div>

      <div class="table-container">
        <el-table
          :data="list"
          style="width: 100%"
          height="100%"
          v-loading="loading"
          header-cell-class-name="table-header"
        >
          <el-table-column type="index" label="条目" width="80" align="center">
          </el-table-column>
          <el-table-column
            prop="karyotype"
            label="异常核型"
            width="150"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="disease"
            label="对应疾病"
            width="150"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="gene"
            label="核心关联基因"
            width="120"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="sourceFunction"
            label="相关蛋白及其功能"
            min-width="200"
            align="left"
            header-align="center"
          >
          </el-table-column>
          <el-table-column
            prop="clinicalFeatures"
            label="临床特征"
            min-width="200"
            align="left"
            header-align="center"
          >
          </el-table-column>
          <el-table-column
            prop="prognosis"
            label="预后与干预"
            min-width="200"
            align="left"
            header-align="center"
          >
          </el-table-column>
          <el-table-column label="相关文献预览" min-width="150" align="center">
            <template slot-scope="scope">
              <div>{{ scope.row.literature }}</div>
            </template>
          </el-table-column>
          <el-table-column label="参考文献" width="100" align="center">
            <template slot-scope="scope">
              <a
                :href="scope.row.referenceFile"
                target="_blank"
                class="pdf-link"
              >
                <i class="el-icon-document pdf-icon"></i>
                <div>参考文献</div>
              </a>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- Pagination -->
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
    </div>

    <!-- Empty State / Initial State -->
    <div class="empty-state" v-else-if="searchedButNoResult">
      <div class="no-result-text">未匹配到结果</div>
    </div>
  </div>
</template>

<script>
import { getKnowledgeList } from "@/api/knowledge";

export default {
  name: "KnowledgeBase",
  data() {
    return {
      keyword: "",
      list: [],
      total: 0,
      page: 1,
      limit: 20,
      loading: false,
      hasSearched: false,
      searchedButNoResult: false,
    };
  },
  methods: {
    handleSearch() {
      if (!this.keyword) return;
      this.page = 1;
      this.fetchData();
    },
    fetchData() {
      this.loading = true;
      getKnowledgeList({
        keyword: this.keyword,
        page: this.page,
        limit: this.limit,
      })
        .then((res) => {
          this.list = res.data.items;
          this.total = res.data.total;
          this.loading = false;
          this.hasSearched = true;
          this.searchedButNoResult = this.total === 0;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    handleSizeChange(val) {
      this.limit = val;
      if (this.hasSearched) {
        this.fetchData();
      }
    },
    handleCurrentChange(val) {
      this.page = val;
      if (this.hasSearched) {
        this.fetchData();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.knowledge-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px;
  box-sizing: border-box;
  background-color: #fff;
}

.search-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
  margin-top: 20px;

  .search-input {
    width: 600px;
    margin-right: 0;

    ::v-deep .el-input__inner {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      height: 40px;
      line-height: 40px;
    }
  }

  .search-btn {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
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
    margin-bottom: 15px;
    color: #606266;
    font-size: 14px;
  }

  .table-container {
    flex: 1;
    overflow: hidden;
    border: 1px solid #ebeef5;
  }

  .pagination {
    padding: 20px 0;
    text-align: right;
    flex-shrink: 0;
  }
}

.empty-state {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;

  .no-result-text {
    font-size: 16px;
    color: #909399;
  }
}

::v-deep .table-header {
  background-color: #f5f7fa !important;
  color: #606266;
  font-weight: bold;
}

.pdf-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: #606266;
  cursor: pointer;

  .pdf-icon {
    font-size: 24px;
    color: #f56c6c;
    margin-bottom: 5px;
  }

  &:hover {
    color: #409eff;
  }
}
</style>
