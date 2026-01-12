<template>
  <div class="role-page">
    <!-- 查询区 -->
    <el-form :inline="true" :model="query" class="query-form">
      <el-form-item>
        <el-input
          v-model="query.keyWord"
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
        <el-button
          type="primary"
          @click="handleCreate"
          v-if="permission.includes('role:add')"
        >
          新建角色
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 表格 -->
    <div class="table-container">
      <el-table
        :data="list"
        border
        v-loading="loading"
        @selection-change="handleSelectionChange"
        height="100%"
      >
        <!-- 多选 -->
        <el-table-column type="selection" width="50" />

        <el-table-column prop="roleId" label="角色ID" width="180" />

        <el-table-column
          prop="roleName"
          label="角色名称"
          show-overflow-tooltip
        />

        <el-table-column
          prop="roleDesc"
          label="角色描述"
          show-overflow-tooltip
        />

        <el-table-column prop="createBy" label="创建人姓名" width="120" />

        <el-table-column prop="status" label="启用状态" width="100">
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

        <el-table-column label="操作" width="160" fixed="right">
          <template slot-scope="{ row }">
            <el-button
              type="text"
              size="small"
              @click="handleEdit(row)"
              v-if="permission.includes('role:edit')"
            >
              编辑
            </el-button>

            <el-button
              type="text"
              size="small"
              style="color: red"
              @click="handleDelete(row)"
              v-if="permission.includes('role:remove')"
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
    <role-dialog
      v-if="dialogVisible"
      :visible.sync="dialogVisible"
      :mode="dialogMode"
      :rowData="currentRow"
      :userPermTree="currentUserPermTree"
      @success="fetchList"
    />
  </div>
</template>
<script>
import dayjs from "dayjs";
import RoleDialog from "./RoleDialog";
import { getRoleList, deleteRole, getCurrentOrgMenuTree } from "@/api/role";

export default {
  name: "RoleManage",
  components: {
    RoleDialog,
  },
  data() {
    return {
      dayjs,
      loading: false,
      list: [],
      total: 0,
      selectedRows: [],
      query: {
        roleName: "",
        roleId: "",
        keyWord: "",
        pageNum: 1,
        pageSize: 20,
      },
      dialogVisible: false,
      dialogMode: "create",
      currentRow: {},
      currentUserPermTree: [],
      permission: [],
    };
  },
  async created() {
    await this.fetchList();
    await this.currentOrgMenuTree();
    this.permission = JSON.parse(localStorage.getItem("userInfo")).permissions;
  },
  methods: {
    /** 获取角色列表 */
    async fetchList() {
      this.loading = true;
      const params = {
        // roleName: "",
        // roleId: "",
        keyWord: this.query.keyWord || "",
        pageNum: this.query.pageNum,
        pageSize: this.query.pageSize,
      };
      try {
        let { records, total } = await getRoleList(params);
        this.list = records;
        this.total = total;
      } catch (error) {
        this.$message.error(error.message);
      } finally {
        this.loading = false;
      }
    },
    async currentOrgMenuTree() {
      try {
        const data = await getCurrentOrgMenuTree();
        const queue = [...data];
        while (queue.length > 0) {
          const current = queue.shift();
          current.checked = false;
          if (Array.isArray(current.children)) {
            queue.push(...current.children);
          }
        }
        this.currentUserPermTree = data || [];
      } catch (error) {
        this.$message.error(error.message || "获取用户权限失败");
      }
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
    async handleEdit(row) {
      this.dialogMode = "edit";
      this.currentRow = { ...row };
      this.dialogVisible = true;
    },

    /** 删除角色 */
    handleDelete(row) {
      this.$confirm("删除后不可恢复，是否继续？", "警告", {
        type: "warning",
      })
        .then(async () => {
          try {
            await deleteRole({ roleId: row.roleId });
            this.$message.success("删除成功");
            this.fetchList();
          } catch (error) {
            this.$message.error(error.message);
          }
        })
        .catch(() => {
          this.$message.info("删除操作已取消");
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
.role-page {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
}
.query-form {
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;
  .el-input {
    width: 400px;
  }
}
.pagination {
  flex-shrink: 0;
  margin-top: 20px;
  text-align: center;
}
.table-container {
  flex: 1;
  overflow: hidden;
}
</style>
