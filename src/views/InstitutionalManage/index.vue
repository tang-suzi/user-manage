<template>
  <div class="org-page">
    <!-- 查询区 -->
    <el-form :inline="true" :model="query" class="query-form">
      <el-form-item>
        <el-input
          v-model="query.keyWord"
          placeholder="请输入机构名称、管理员账号、管理员姓名"
          maxlength="20"
          style="width: 380px"
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
        <el-button
          type="primary"
          @click="handleCreate"
          v-if="permission.includes('org:add')"
        >
          新建机构
        </el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <div class="table-container">
      <el-table
        :data="list"
        v-loading="loading"
        @selection-change="handleSelectionChange"
        height="100%"
      >
        <!-- <el-table-column type="selection" width="55"> </el-table-column> -->
        <el-table-column prop="orgId" label="机构ID" width="180" />

        <el-table-column
          prop="orgName"
          label="机构名称"
          show-overflow-tooltip
        />

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

        <el-table-column prop="createTime" label="创建时间" width="160">
          <template slot-scope="{ row }">
            {{
              row.createTime
                ? dayjs(row.createTime).format("YYYY-MM-DD HH:mm:ss")
                : "--"
            }}
          </template>
        </el-table-column>

        <el-table-column label="操作" width="200" fixed="right">
          <template slot-scope="{ row }">
            <el-button
              type="text"
              size="small"
              @click="handleEdit(row)"
              v-if="permission.includes('org:edit')"
            >
              编辑
            </el-button>

            <!-- <el-button type="text" size="small">
              {{ row.status === 1 ? "禁用" : "启用" }}
            </el-button> -->

            <el-button
              type="text"
              size="small"
              style="color: red"
              @click="handleDelete(row)"
              v-if="permission.includes('org:remove')"
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
      v-if="dialogVisible"
      :visible.sync="dialogVisible"
      :mode="dialogMode"
      :row-data="currentRow"
      @success="fetchList"
    />
  </div>
</template>
<script>
import dayjs from "dayjs";
import OrgDialog from "./OrgDialog.vue";
import { getOrgList, deleteOrg } from "@/api/org";

export default {
  name: "InstitutionalManage",
  components: { OrgDialog },
  data() {
    return {
      dayjs,
      loading: false,
      list: [],
      total: 0,
      query: {
        orgName: "",
        adminAccount: "",
        adminName: "",
        keyWord: "",
        pageNum: 1,
        pageSize: 20,
      },
      dialogVisible: false,
      dialogMode: "create",
      currentRow: {},
      permission: [],
    };
  },
  created() {
    this.fetchList();
    this.permission = JSON.parse(localStorage.getItem("userInfo")).permissions;
  },
  methods: {
    handleSelectionChange(val) {
      console.log(val);
    },
    async fetchList() {
      this.loading = true;
      const params = {
        keyWord: this.query.keyWord,
      };
      try {
        const { total, records } = await getOrgList(params);
        this.list = records;
        this.total = total;
      } catch (error) {
        this.$message.error(error.message || "获取机构列表失败");
      } finally {
        this.loading = false;
      }
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
      console.log(this.currentRow, "编辑机构");
    },
    handleDelete(row) {
      console.log(row, "删除机构");
      this.$confirm("删除后数据不可恢复，是否继续？", "警告", {
        type: "warning",
      })
        .then(async () => {
          try {
            await deleteOrg({ orgId: row.orgId });
            this.$message.success("删除成功");
            this.fetchList();
          } catch (error) {
            this.$message.error(error.message || "删除机构失败");
          }
        })
        .catch(() => {
          this.$message.info("删除操作已取消");
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
.org-page {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.query-form {
  display: flex;
  justify-content: space-between;
  flex-shrink: 0;
  .el-input {
    width: 400px;
  }
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
