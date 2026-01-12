<template>
  <div class="user-page">
    <!-- 查询区 -->
    <el-form :inline="true" :model="query" class="query-form">
      <el-form-item label="操作账号">
        <el-input
          v-model="query.operAccount"
          placeholder="操作账号"
          maxlength="20"
          clearable
        >
        </el-input>
      </el-form-item>
      <el-form-item label="操作时间">
        <el-date-picker
          v-model="query.date"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
          format="yyyy-MM-dd"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="操作菜单">
        <el-select placeholder="操作菜单" v-model="query.operMenu" clearable>
          <el-option label="机构管理" value="机构管理" />
          <el-option label="角色管理" value="角色管理" />
          <el-option label="用户管理" value="用户管理" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button type="default" @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <div class="table-container">
      <el-table :data="list" v-loading="loading" class="table" height="100%">
        <el-table-column prop="logId" label="日志ID" width="120" />
        <el-table-column prop="operAccount" label="操作账号" width="120" />
        <el-table-column
          prop="operName"
          label="操作人姓名"
          show-overflow-tooltip
        />
        <el-table-column prop="operMenu" label="操作菜单" width="120" />
        <el-table-column prop="operType" label="操作类型" width="120" />
        <el-table-column prop="operTime" label="操作时间" width="160" />
        <el-table-column prop="operResult" label="操作结果" width="160" />
        <el-table-column label="操作描述" width="160">
          <template slot-scope="scope">
            <div class="oper-content" :title="scope.row.operContent">
              <div>
                {{ scope.row.operContent.slice(0, 5) + "..." }}
              </div>
            </div>
            <!-- <el-tooltip
              class="item"
              effect="dark"
              :content="scope.row.operContent"
              placement="top-start"
            >
              <div>
                {{ scope.row.operContent.slice(0, 5) + "..." }}
              </div>
            </el-tooltip> -->
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <el-pagination
      class="pagination"
      style="text-align: center"
      layout="total, prev, pager, next, sizes, jumper"
      :total="total"
      :page-size="query.pageSize"
      :current-page="query.pageNum"
      :page-sizes="[10, 20, 50, 100]"
      @size-change="handleSizeChange"
      @current-change="handlePageChange"
    />
  </div>
</template>

<script>
import { getLogList } from "@/api/log";
import dayjs from "dayjs";

// import { getLogList } from "@/api/log";

export default {
  name: "LogManage",
  components: {},
  data() {
    return {
      loading: false,
      list: [],
      total: 0,
      query: {
        operAccount: "",
        operMenu: "",
        date: [],
        pageNum: 1,
        pageSize: 20,
      },
      pickerOptions: {
        disabledDate: (time) => {
          return time.getTime() > Date.now();
        },
      },
    };
  },
  created() {
    this.fetchList();
  },
  methods: {
    /** 重置查询条件 */
    handleReset() {
      this.query = {
        operAccount: "",
        operMenu: "",
        date: [],
        pageNum: 1,
        pageSize: 20,
      };
      this.fetchList();
    },
    /** 获取日志列表 */
    async fetchList() {
      this.loading = true;
      const params = {
        operAccount: this.query.operAccount,
        operMenu: this.query.operMenu,
        operTimeStart: this.query.date[0]
          ? dayjs(this.query.date[0]).format("YYYY-MM-DD")
          : null,
        operTimeEnd: this.query.date[1]
          ? dayjs(this.query.date[1]).format("YYYY-MM-DD")
          : null,
        pageNum: this.query.pageNum,
        pageSize: this.query.pageSize,
      };
      console.log(params);
      try {
        let { records, total } = await getLogList(params);
        console.log(records, total);
        this.list = records;
        this.total = total;
      } catch (error) {
        this.$message.error(error.message);
      } finally {
        this.loading = false;
      }
    },

    /** 查询 */
    handleSearch() {
      this.query.pageNum = 1;
      this.fetchList();
    },

    /** 分页 size 改变 */
    handleSizeChange(size) {
      this.query.pageSize = size;
      this.fetchList();
    },

    /** 分页 page 改变 */
    handlePageChange(page) {
      this.query.pageNum = page;
      this.fetchList();
    },
  },
};
</script>

<style lang="scss" scoped>
.user-page {
  padding: 20px;
  background-color: #fff;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.query-form {
  display: flex;
  justify-content: space-between;
  flex-shrink: 0;
  margin-bottom: 20px;
}
.table-container {
  flex: 1;
  overflow: hidden;
}
.pagination {
  margin-top: 20px;
  text-align: center;
  flex-shrink: 0;
}
</style>
