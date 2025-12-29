<template>
  <div class="org-page">
    <!-- 查询区 -->
    <el-form :inline="true" :model="query" class="query-form">
      <el-form-item>
        <el-input
          v-model="query.orgName"
          placeholder="请输入机构名称"
          maxlength="20"
          clearable
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="handleSearch"
          ></el-button>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleCreate"> 新建机构 </el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table
      :data="list"
      v-loading="loading"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column prop="id" label="机构ID" width="180" />

      <el-table-column prop="name" label="机构名称" show-overflow-tooltip />

      <el-table-column
        prop="adminAccount"
        label="管理员账号"
        show-overflow-tooltip
      />

      <el-table-column prop="adminName" label="管理员姓名" />

      <el-table-column prop="status" label="启动状态" width="100">
        <template slot-scope="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'info'">
            {{ row.status === 1 ? "启用" : "禁用" }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="createTime" label="创建时间" width="160" />

      <el-table-column label="操作" width="200" fixed="right">
        <template slot-scope="{ row }">
          <el-button type="text" size="small" @click="handleEdit(row)">
            编辑
          </el-button>

          <el-button type="text" size="small">
            {{ row.status === 1 ? "禁用" : "启用" }}
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
      layout="total, prev, pager, next, sizes, jumper"
      :total="total"
      :page-size="query.pageSize"
      :current-page="query.pageNum"
      :page-sizes="[10, 20, 50, 100]"
      @size-change="handleSizeChange"
      @current-change="handlePageChange"
    />

    <!-- 弹窗 -->
    <org-dialog
      :visible.sync="dialogVisible"
      :mode="dialogMode"
      :row-data="currentRow"
      @success="fetchList"
    />
  </div>
</template>
<script>
import OrgDialog from "./OrgDialog.vue";
import { getOrgList, deleteOrg } from "@/api/org";

export default {
  name: "InstitutionalManage",
  components: { OrgDialog },
  data() {
    return {
      loading: false,
      list: [],
      total: 0,
      query: {
        orgName: "",
        adminAccount: "",
        adminName: "",
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
    handleSelectionChange(val) {
      console.log(val);
    },
    fetchList() {
      this.loading = true;
      const params = {
        name: this.query.orgName,
        page: this.query.pageNum,
        limit: this.query.pageSize,
      };
      getOrgList(params)
        .then((res) => {
          this.list = res.data.items;
          this.total = res.data.total;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    handleSearch() {
      this.query.pageNum = 1;
      this.fetchList();
    },
    handleReset() {
      this.query = {
        orgName: "",
        adminAccount: "",
        adminName: "",
        pageNum: 1,
        pageSize: 20,
      };
      this.fetchList();
    },
    handleCreate() {
      this.dialogMode = "create";
      this.currentRow = {};
      this.dialogVisible = true;
    },
    handleEdit(row) {
      this.dialogMode = "edit";
      this.currentRow = { ...row };
      this.dialogVisible = true;
    },
    handleDelete(row) {
      this.$confirm("删除后数据不可恢复，是否继续？", "警告", {
        type: "warning",
      }).then(() => {
        deleteOrg({ id: row.id }).then(() => {
          this.$message.success("删除成功");
          this.fetchList();
        });
      });
    },
    handleSizeChange(size) {
      this.query.pageSize = size;
      this.fetchList();
    },
    handlePageChange(page) {
      this.query.pageNum = page;
      this.fetchList();
    },
  },
};
</script>
<style lang="scss" scoped>
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
