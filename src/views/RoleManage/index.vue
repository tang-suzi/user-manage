<template>
  <div class="role-page">
    <!-- 查询区 -->
    <el-form :inline="true" :model="query" class="query-form">
      <el-form-item>
        <el-input
          v-model="query.keyword"
          placeholder="请输入角色名称 / 创建人"
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
        <el-button type="primary" @click="handleCreate"> 新建角色 </el-button>
      </el-form-item>
    </el-form>

    <!-- 表格 -->
    <el-table
      :data="list"
      border
      v-loading="loading"
      @selection-change="handleSelectionChange"
    >
      <!-- 多选 -->
      <el-table-column type="selection" width="50" />

      <el-table-column prop="id" label="角色ID" width="180" />

      <el-table-column prop="name" label="角色名称" show-overflow-tooltip />

      <el-table-column
        prop="description"
        label="角色描述"
        show-overflow-tooltip
      />

      <el-table-column prop="creator" label="创建人姓名" width="120" />

      <el-table-column prop="status" label="启用状态" width="100">
        <template slot-scope="{ row }">
          <el-tag :type="row.status === 'enabled' ? 'success' : 'info'">
            {{ row.status === "enabled" ? "启用" : "禁用" }}
          </el-tag>
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
            style="color: red"
            @click="handleDelete(row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

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
    <role-dialog
      :visible.sync="dialogVisible"
      :mode="dialogMode"
      :rowData="currentRow"
      @success="fetchList"
    />
  </div>
</template>
<script>
import RoleDialog from "./RoleDialog";
import { getRoleList, deleteRole } from "@/api/role";

export default {
  name: "RoleManage",
  components: {
    RoleDialog,
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
    /** 获取角色列表 */
    fetchList() {
      this.loading = true;
      const params = {
        keyword: this.query.keyword,
        page: this.query.pageNum,
        limit: this.query.pageSize,
      };
      getRoleList(params)
        .then((res) => {
          this.list = res.data.items;
          this.total = res.data.total;
          console.log(this.list);
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

    /** 新建角色 */
    handleCreate() {
      this.dialogMode = "create";
      this.currentRow = {};
      this.dialogVisible = true;
    },

    /** 编辑角色 */
    handleEdit(row) {
      this.dialogMode = "edit";
      this.currentRow = { ...row };
      this.dialogVisible = true;
    },

    /** 删除角色 */
    handleDelete(row) {
      this.$confirm("删除后不可恢复，是否继续？", "警告", {
        type: "warning",
      }).then(() => {
        deleteRole({ id: row.id }).then(() => {
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
<style scoped>
.query-form {
  display: flex;
  justify-content: space-between;
  .el-input {
    width: 400px;
  }
}
.pagination {
  margin-top: 20px;
  text-align: center;
}
</style>
