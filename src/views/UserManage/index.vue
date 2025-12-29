<template>
  <div class="user-page">
    <!-- 查询区 -->
    <el-form :inline="true" :model="query" class="query-form">
      <el-form-item>
        <el-input
          v-model="query.keyword"
          placeholder="搜索账号、用户姓名"
          maxlength="20"
          clearable
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="handleSearch"
          />
        </el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="default" @click="handleCreate"> 新建用户 </el-button>
      </el-form-item>
    </el-form>

    <!-- 表格 -->
    <div class="table-container">
      <el-table
        :data="list"
        v-loading="loading"
        @selection-change="handleSelectionChange"
        class="table"
        height="100%"
      >
        <!-- 多选 -->
        <el-table-column type="selection" width="50" />

        <el-table-column prop="account" label="账号" width="120" />

        <el-table-column prop="name" label="用户姓名" width="120" />

        <el-table-column prop="orgName" label="机构" show-overflow-tooltip />

        <el-table-column prop="roleName" label="角色" width="120" />

        <el-table-column prop="creator" label="创建人姓名" width="120" />

        <el-table-column prop="status" label="启动状态" width="100">
          <template slot-scope="{ row }">
            {{ row.status === 1 ? "启动" : "禁用" }}
          </template>
        </el-table-column>

        <el-table-column prop="createTime" label="创建时间" width="160" />

        <el-table-column label="操作" width="160" fixed="right">
          <template slot-scope="{ row }">
            <el-button type="text" size="small" @click="handleEdit(row)">
              编辑
            </el-button>

            <el-button
              type="text"
              size="small"
              style="color: #409eff"
              @click="handleDelete(row)"
            >
              删除
            </el-button>
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

    <!-- 新建/编辑用户 Dialog -->
    <user-dialog
      :visible.sync="dialogVisible"
      :mode="dialogMode"
      :row-data="currentRow"
      @success="fetchList"
    />
  </div>
</template>

<script>
import UserDialog from "./UserDialog";
import { getUserList, deleteUser } from "@/api/user";

export default {
  name: "UserManage",
  components: {
    UserDialog,
  },
  data() {
    return {
      loading: false,
      list: [],
      total: 0,
      selectedRows: [],
      query: {
        keyword: "",
        pageNum: 1,
        pageSize: 20,
      },
      dialogVisible: false,
      dialogMode: "create",
      currentRow: {},
    };
  },
  created() {
    this.fetchList();
  },
  methods: {
    /** 获取用户列表 */
    fetchList() {
      this.loading = true;
      getUserList({
        keyword: this.query.keyword,
        page: this.query.pageNum,
        limit: this.query.pageSize,
      })
        .then((res) => {
          this.list = res.data.items;
          this.total = res.data.total;
        })
        .finally(() => {
          this.loading = false;
        });
    },

    /** 查询 */
    handleSearch() {
      this.query.pageNum = 1;
      this.fetchList();
    },

    /** 新建用户 */
    handleCreate() {
      this.dialogMode = "create";
      this.currentRow = {};
      this.dialogVisible = true;
    },

    /** 编辑用户 */
    handleEdit(row) {
      this.dialogMode = "edit";
      this.currentRow = row;
      this.dialogVisible = true;
    },

    /** 删除用户 */
    handleDelete(row) {
      this.$confirm("用户删除后不可恢复，确认删除？", "删除用户", {
        type: "warning",
        confirmButtonText: "删除",
        cancelButtonText: "取消",
      }).then(() => {
        deleteUser({ id: row.id }).then(() => {
          this.$message.success("删除成功");
          this.fetchList();
        });
      });
    },

    /** 多选 */
    handleSelectionChange(rows) {
      this.selectedRows = rows;
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
