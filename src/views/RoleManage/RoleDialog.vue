<template>
  <el-dialog
    :title="mode === 'create' ? '新建角色' : '编辑角色'"
    :visible.sync="showDialog"
    width="720px"
    :before-close="handleClose"
  >
    <!-- 基本信息 -->
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="角色名称" prop="name">
        <el-input
          v-model="form.name"
          maxlength="20"
          show-word-limit
          placeholder="请输入角色名称"
        />
      </el-form-item>

      <el-form-item label="角色描述">
        <el-input
          v-model="form.description"
          maxlength="20"
          show-word-limit
          placeholder="请输入角色描述"
        />
      </el-form-item>

      <el-form-item label="启用状态">
        <el-switch
          v-model="form.status"
          :active-value="1"
          :inactive-value="0"
        />
      </el-form-item>
      <el-form-item label="权限设置">
        <el-table :data="permissionList" border>
          <el-table-column prop="moduleName" label="功能模块" width="160" />
          <el-table-column label="查看">
            <template slot-scope="{ row }">
              <el-checkbox v-model="row.view" />
            </template>
          </el-table-column>
          <el-table-column label="新增">
            <template slot-scope="{ row }">
              <el-checkbox v-model="row.create" />
            </template>
          </el-table-column>
          <el-table-column label="编辑">
            <template slot-scope="{ row }">
              <el-checkbox v-model="row.edit" />
            </template>
          </el-table-column>
          <el-table-column label="删除">
            <template slot-scope="{ row }">
              <el-checkbox v-model="row.delete" />
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>

    <!-- footer -->
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
          moduleName: "用户管理",
          view: false,
          create: false,
          edit: false,
          delete: false,
        },
        {
          moduleName: "角色管理",
          view: false,
          create: false,
          edit: false,
          delete: false,
        },
        {
          moduleName: "机构管理",
          view: false,
          create: false,
          edit: false,
          delete: false,
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
        } else {
          this.form = {
            name: "",
            description: "",
            status: 1,
          };
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
    handleSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true;
          const api = this.mode === "create" ? addRole : updateRole;
          api(this.form)
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
