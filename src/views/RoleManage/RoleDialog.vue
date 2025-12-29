<template>
  <el-dialog
    :title="mode === 'create' ? '新建角色' : '编辑角色'"
    :visible.sync="showDialog"
    width="800px"
    :before-close="handleClose"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="角色名称" prop="name">
        <el-input
          v-model="form.name"
          maxlength="20"
          show-word-limit
          placeholder="请输入角色名称，最多20字"
        />
      </el-form-item>

      <el-form-item label="角色描述">
        <el-input
          v-model="form.description"
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
      <el-table :data="permissionList" border style="margin-top: 10px">
        <el-table-column label="菜单权限" width="180">
          <template slot-scope="{ row }">
            <el-checkbox
              v-model="row.checked"
              @change="(val) => handleMenuCheck(val, row)"
            >
              {{ row.name }}
            </el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="操作权限">
          <template slot-scope="{ row }">
            <div class="action-checkbox-group">
              <el-checkbox
                v-for="action in row.actions"
                :key="action.value"
                v-model="action.checked"
                @change="(val) => handleActionCheck(val, row)"
              >
                {{ action.label }}
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
        name: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
      },
      permissionList: [
        {
          name: "样本预览",
          key: "sample_preview",
          checked: false,
          actions: [
            { label: "分析", value: "analyze", checked: false },
            { label: "导出", value: "export", checked: false },
            { label: "上传", value: "upload", checked: false },
            { label: "修改病例", value: "modify_case", checked: false },
            { label: "咨询", value: "consult", checked: false },
          ],
        },
        {
          name: "专家咨询",
          key: "expert_consult",
          checked: false,
          actions: [
            { label: "咨询", value: "consult", checked: false },
            { label: "编辑", value: "edit", checked: false },
            { label: "删除", value: "delete", checked: false },
            { label: "撤回", value: "recall", checked: false },
            { label: "再次咨询", value: "re_consult", checked: false },
            { label: "拒绝原因", value: "reject_reason", checked: false },
          ],
        },
        {
          name: "专家复核",
          key: "expert_review",
          checked: false,
          actions: [
            { label: "复核", value: "review", checked: false },
            { label: "拒绝", value: "reject", checked: false },
          ],
        },
        {
          name: "专家确认",
          key: "expert_confirm",
          checked: false,
          actions: [{ label: "确认", value: "confirm", checked: false }],
        },
        {
          name: "机构管理",
          key: "org_manage",
          checked: false,
          actions: [
            { label: "新建机构", value: "create", checked: false },
            { label: "编辑", value: "edit", checked: false },
            { label: "删除", value: "delete", checked: false },
          ],
        },
        {
          name: "角色管理",
          key: "role_manage",
          checked: false,
          actions: [
            { label: "新建角色", value: "create", checked: false },
            { label: "编辑", value: "edit", checked: false },
            { label: "删除", value: "delete", checked: false },
            { label: "日志管理", value: "log_manage", checked: false },
          ],
        },
        {
          name: "用户管理",
          key: "user_manage",
          checked: false,
          actions: [
            { label: "新建用户", value: "create", checked: false },
            { label: "编辑", value: "edit", checked: false },
            { label: "删除", value: "delete", checked: false },
          ],
        },
      ],
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
          this.form = {
            id: this.rowData.id,
            name: this.rowData.name,
            description: this.rowData.description,
            status: this.rowData.status,
          };
          // 回显权限
          if (this.rowData.permissions) {
            this.restorePermissions(this.rowData.permissions);
          } else {
            this.resetPermissions();
          }
        } else {
          this.form = {
            name: "",
            description: "",
            status: 1,
          };
          this.resetPermissions();
        }
        this.$nextTick(() => {
          this.$refs.form.clearValidate();
        });
      }
    },
  },
  methods: {
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
    resetPermissions() {
      this.permissionList.forEach((item) => {
        item.checked = false;
        item.actions.forEach((action) => {
          action.checked = false;
        });
      });
    },
    restorePermissions(savedPermissions) {
      // 先重置
      this.resetPermissions();
      // 回填
      if (!Array.isArray(savedPermissions)) return;

      savedPermissions.forEach((savedItem) => {
        const target = this.permissionList.find((p) => p.key === savedItem.key);
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
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true;

          // 收集权限数据
          const permissions = this.permissionList
            .filter((item) => item.checked)
            .map((item) => ({
              key: item.key,
              name: item.name,
              actions: item.actions
                .filter((a) => a.checked)
                .map((a) => a.value),
            }));

          const payload = {
            ...this.form,
            permissions,
          };

          const api = this.mode === "create" ? addRole : updateRole;
          api(payload)
            .then(() => {
              this.$message.success(
                this.mode === "create" ? "创建成功" : "编辑成功"
              );
              this.$emit("success");
              this.handleClose();
            })
            .finally(() => {
              this.loading = false;
            });
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
