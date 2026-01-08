<template>
  <el-dialog
    :title="mode === 'create' ? '新建角色' : '编辑角色'"
    :visible.sync="showDialog"
    width="800px"
    :before-close="handleClose"
    destroy-on-close
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="角色名称" prop="name">
        <el-input
          v-model="form.roleName"
          maxlength="20"
          show-word-limit
          placeholder="请输入角色名称，最多20字"
        />
      </el-form-item>

      <el-form-item label="角色描述">
        <el-input
          v-model="form.roleDesc"
          maxlength="20"
          show-word-limit
          placeholder="请输入角色描述，最多20字"
        />
      </el-form-item>

      <el-form-item label="启用状态">
        <el-switch
          v-model="form.status"
          :active-value="1"
          :inactive-value="0"
        />
      </el-form-item>

      <div class="permission-label">
        <span style="color: #f56c6c; margin-right: 4px">*</span>权限设置：
      </div>
      <el-table :data="currentUserPermTree" border style="margin-top: 10px">
        <el-table-column label="菜单权限" width="180">
          <template slot-scope="{ row }">
            <el-checkbox
              v-model="row.checked"
              @change="(val) => handleMenuCheck(val, row)"
            >
              {{ row.menuName }}
            </el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="操作权限">
          <template slot-scope="{ row }">
            <div class="action-checkbox-group">
              <el-checkbox
                v-for="action in row.children"
                :key="action.menuId"
                v-model="action.checked"
                @change="(val) => handleActionCheck(val, row, action.menuId)"
              >
                {{ action.menuName }}
              </el-checkbox>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-form>

    <span slot="footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" :loading="loading" @click="handleSubmit">
        确定
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import { addRole, updateRole } from "@/api/role";
import { getRoleDetail } from "@/api/role";
import cloneDeep from "lodash/cloneDeep";

export default {
  name: "RoleDialog",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    mode: {
      type: String,
      default: "create",
    },
    rowData: {
      type: Object,
      default: () => ({}),
    },
    userPermTree: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      loading: false,
      form: {
        name: "",
        description: "",
        status: 1,
      },
      rules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
        ],
      },
      currentUserPermTree: [],
    };
  },
  computed: {
    showDialog: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit("update:visible", val);
      },
    },
  },
  watch: {
    visible: {
      handler(val) {
        if (val && this.mode === "edit") {
          if (this.rowData) {
            this.getDetail();
          } else {
            this.form = {
              roleName: "",
              roleDesc: "",
              status: 1,
            };
            this.resetCurrentUserPermTree();
          }
        }
        this.$nextTick(() => {
          this.$refs.form.clearValidate();
        });
      },
      immediate: true,
    },
    userPermTree: {
      handler(val) {
        this.currentUserPermTree = cloneDeep(val);
      },
      immediate: true,
    },
  },
  methods: {
    async getDetail() {
      try {
        const data = await getRoleDetail({ roleId: this.rowData.roleId });
        if (data) {
          this.form = {
            roleId: data.roleId,
            roleName: data.roleName,
            roleDesc: data.roleDesc,
            status: data.status,
          };
          // 回显权限
          if (data.menuIds) {
            this.restoreCurrentUserPermTree(data.menuIds);
          } else {
            this.resetCurrentUserPermTree();
          }
        }
      } catch (error) {
        this.$message.error(error.message || "获取角色详情失败");
      }
    },
    handleClose() {
      this.showDialog = false;
    },
    // 菜单全选/取消全选
    handleMenuCheck(val, row) {
      row.checked = val;
      if (val) {
        row.children.forEach((child) => {
          child.checked = true;
        });
      } else {
        row.children.forEach((child) => {
          child.checked = false;
        });
      }
    },
    // 操作权限选择
    handleActionCheck(val, row, menuId) {
      row.children.forEach((action) => {
        if (action.menuId === menuId) {
          action.checked = val;
        }
      });
      console.log(val, row, menuId);
      const hasChecked = row.children.some((child) => child.checked);
      if (hasChecked) {
        row.checked = true;
      } else {
        row.checked = false;
      }
    },
    resetCurrentUserPermTree() {
      const queue = [...this.currentUserPermTree];
      while (queue.length > 0) {
        const current = queue.shift();
        current.checked = false;
        if (Array.isArray(current.children)) {
          queue.push(...current.children);
        }
      }
    },
    restoreCurrentUserPermTree(menuIds = []) {
      // 先重置
      this.resetCurrentUserPermTree();
      // 回填
      if (!Array.isArray(menuIds)) return;
      menuIds.forEach((menu) => {
        const queue = [...this.currentUserPermTree];
        while (queue.length > 0) {
          const current = queue.shift();
          if (current.menuId === menu) {
            current.checked = true;
            // 递归设置父节点 checked
            let parent = current.parent;
            while (parent) {
              parent.checked = true;
              parent = parent.parent;
            }
            break;
          }
          if (Array.isArray(current.children)) {
            queue.push(...current.children);
          }
        }
      });
    },
    handleSubmit() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          this.loading = true;

          // 收集权限数据
          const menuIds = [];

          this.currentUserPermTree.forEach((menu) => {
            if (menu.checked) {
              menuIds.push(menu.menuId);
            }
            menu.children.forEach((child) => {
              if (child.checked) {
                menuIds.push(child.menuId);
              }
            });
          });

          const payload = {
            ...this.form,
            menuIds,
          };
          const api = this.mode === "create" ? addRole : updateRole;
          try {
            const res = await api(payload);
            console.log(res);
            this.$message.success(
              this.mode === "create" ? "创建成功" : "编辑成功"
            );
            this.$emit("success");
            this.handleClose();
          } catch (error) {
            this.$message.error(error.message || "操作失败");
          } finally {
            this.loading = false;
          }
        }
      });
    },
  },
};
</script>

<style scoped>
.permission-label {
  font-size: 14px;
  color: #606266;
  margin-bottom: 10px;
  padding-left: 12px; /* 对齐 label */
}
.action-checkbox-group {
  display: flex;
  flex-wrap: wrap;
}
.action-checkbox-group .el-checkbox {
  margin-right: 20px;
  margin-left: 0;
}
</style>
