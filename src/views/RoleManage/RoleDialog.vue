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
                @change="(val) => handleActionCheck(val, row)"
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
import { getCurrentOrgMenuTree } from "@/api/role";

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
    visible(val) {
      if (val) {
        if (this.mode === "edit" && this.rowData) {
          console.log(this.rowData);
          this.form = {
            roleId: this.rowData.roleId,
            roleName: this.rowData.roleName,
            roleDesc: this.rowData.roleDesc,
            status: this.rowData.status,
          };
          // 回显权限
          if (this.rowData.CurrentUserPermTree) {
            this.restoreCurrentUserPermTree(this.rowData.menuIds);
          } else {
            this.resetCurrentUserPermTree();
          }
        } else {
          this.form = {
            roleName: "",
            roleDesc: "",
            status: 1,
          };
          this.resetCurrentUserPermTree();
        }
        this.$nextTick(() => {
          this.$refs.form.clearValidate();
        });
      }
    },
  },
  async created() {
    await this.currentOrgMenuTree();
  },
  methods: {
    async currentOrgMenuTree() {
      try {
        // console.log(getMenu);
        const res = await getCurrentOrgMenuTree();
        this.currentUserPermTree = res || [];
      } catch (error) {
        this.$message.error(error.message || "获取用户权限失败");
      }
    },
    handleClose() {
      this.showDialog = false;
    },
    // 菜单全选/取消全选
    handleMenuCheck(val, row) {
      row.actions.forEach((action) => {
        action.checked = val;
      });
    },
    // 操作权限选择
    handleActionCheck(val, row) {
      // 如果选中了任意一个操作，菜单也自动选中
      if (val) {
        row.checked = true;
      } else {
        // 如果所有操作都取消了，菜单是否要取消？
        // 原型图中似乎菜单可以单独选（作为入口权限），所以这里不强制取消菜单
        // 但通常逻辑是：如果所有操作都没选，菜单选了也没啥用，或者菜单选了代表有“查看”权限
        // 这里暂时保留菜单选中状态，除非用户手动取消菜单
        // 如果需求是“只要有一个操作被选中，菜单必须选中”，上面已经满足
        // 如果需求是“如果所有操作都没选中，菜单自动取消”，可以加下面逻辑：
        const hasChecked = row.actions.some((a) => a.checked);
        if (!hasChecked) {
          // row.checked = false; // 暂时注释，允许只有菜单权限
        }
      }
    },
    resetCurrentUserPermTree() {
      this.currentUserPermTree.forEach((item) => {
        item.checked = false;
        item.actions.forEach((action) => {
          action.checked = false;
        });
      });
    },
    restoreCurrentUserPermTree(savedCurrentUserPermTree) {
      // 先重置
      this.resetCurrentUserPermTree();
      // 回填
      if (!Array.isArray(savedCurrentUserPermTree)) return;

      savedCurrentUserPermTree.forEach((savedItem) => {
        const target = this.currentUserPermTree.find(
          (p) => p.key === savedItem.key
        );
        if (target) {
          target.checked = true;
          if (Array.isArray(savedItem.actions)) {
            savedItem.actions.forEach((savedActionVal) => {
              const action = target.actions.find(
                (a) => a.value === savedActionVal
              );
              if (action) {
                action.checked = true;
              }
            });
          }
        }
      });
    },
    handleSubmit() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          this.loading = true;

          // 收集权限数据
          const menuIds = this.currentUserPermTree.flatMap((item) => {
            // 父节点 menuId（暂不使用）
            // if (item.checked) {
            //   ids.push(item.menuId)
            // }

            return item.children
              .filter((child) => child.checked)
              .map((child) => child.menuId);
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
