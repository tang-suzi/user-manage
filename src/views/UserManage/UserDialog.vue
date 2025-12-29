<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="showDialog"
    width="520px"
    :before-close="handleClose"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <!-- 账号 -->
      <el-form-item label="账号" prop="account">
        <el-input
          v-model="form.account"
          :disabled="isEdit"
          placeholder="请输入3-20位字母、数字"
          maxlength="20"
        />
      </el-form-item>

      <!-- 用户名 -->
      <el-form-item label="用户名" prop="username">
        <el-input
          v-model="form.username"
          placeholder="请输入3-20位字母、数字"
          maxlength="20"
        />
      </el-form-item>

      <!-- 登录密码 -->
      <el-form-item label="登录密码" prop="password">
        <el-input
          v-model="form.password"
          type="password"
          placeholder="请输入6-12位字母、数字、密码"
          show-password
        />
      </el-form-item>

      <!-- 角色 -->
      <el-form-item label="角色" prop="roles">
        <el-select
          v-model="form.roles"
          multiple
          placeholder="请选择角色"
          style="width: 100%"
        >
          <el-option
            v-for="item in roleOptions"
            :key="item.roleId"
            :label="item.roleName"
            :value="item.roleId"
          />
        </el-select>
      </el-form-item>

      <!-- 启用状态 -->
      <el-form-item label="启用状态">
        <el-switch
          v-model="form.status"
          active-value="enabled"
          inactive-value="disabled"
        />
      </el-form-item>
    </el-form>

    <span slot="footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit"> 确定 </el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "UserDialog",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    mode: {
      type: String,
      default: "create", // create | edit
    },
    rowData: {
      type: Object,
      default: () => ({}),
    },
    roleOptions: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      form: {
        account: "",
        username: "",
        password: "",
        roles: [],
        status: "enabled",
      },
      rules: {
        account: [
          { required: true, message: "请输入账号", trigger: "blur" },
          {
            pattern: /^[A-Za-z0-9]{3,20}$/,
            message: "账号需为3-20位字母或数字",
            trigger: "blur",
          },
        ],
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            pattern: /^[A-Za-z0-9]{3,20}$/,
            message: "用户名需为3-20位字母或数字",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: function () {
              return this.mode === "create";
            },
            message: "请输入登录密码",
            trigger: "blur",
          },
          {
            pattern: /^[A-Za-z0-9]{6,12}$/,
            message: "密码需为6-12位字母或数字",
            trigger: "blur",
          },
        ],
        roles: [{ required: true, message: "请选择角色", trigger: "change" }],
      },
    };
  },
  computed: {
    isEdit() {
      return this.mode === "edit";
    },
    dialogTitle() {
      return this.isEdit ? "编辑用户" : "新增用户";
    },
    showDialog() {
      return this.visible;
    },
  },
  watch: {
    visible(val) {
      if (val && this.isEdit) {
        this.fillForm();
      }
    },
  },
  methods: {
    fillForm() {
      const { account, username, roles, status } = this.rowData;
      this.form = {
        account,
        username,
        password: "",
        roles: roles || [],
        status,
      };
    },
    handleSubmit() {
      this.$refs.form.validate((valid) => {
        if (!valid) return;

        const payload = { ...this.form };

        if (this.isEdit && !payload.password) {
          delete payload.password;
        }

        const api = this.isEdit ? this.$api.updateUser : this.$api.createUser;

        api(payload).then(() => {
          this.$message.success("操作成功");
          this.$emit("success");
          this.handleClose();
        });
      });
    },
    handleClose() {
      this.$refs.form && this.$refs.form.resetFields();
      this.$emit("update:visible", false);
    },
  },
};
</script>
