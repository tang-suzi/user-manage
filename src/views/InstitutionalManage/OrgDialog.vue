<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="showDialog"
    width="520px"
    :before-close="handleClose"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="110px">
      <el-form-item label="机构名称" prop="name">
        <el-input v-model="form.name" maxlength="20" />
      </el-form-item>

      <el-form-item label="管理员账号" prop="adminAccount">
        <el-input v-model="form.adminAccount" :disabled="isEdit" />
      </el-form-item>

      <el-form-item label="管理员姓名" prop="adminName">
        <el-input v-model="form.adminName" />
      </el-form-item>

      <el-form-item label="管理员密码" prop="adminPassword">
        <el-input
          v-model="form.adminPassword"
          type="password"
          :placeholder="isEdit ? '不修改请留空' : '请输入密码'"
        />
      </el-form-item>

      <el-form-item label="启用状态" prop="status">
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
import { addOrg, updateOrg } from "@/api/org";

export default {
  name: "OrgDialog",
  props: {
    visible: {
      Boolean,
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
      form: {
        name: "",
        code: "", // 增加机构代码
        adminAccount: "",
        adminName: "",
        adminPassword: "",
        status: 1, // 默认为启用 1
      },
      rules: {
        name: [
          {
            required: true,
            message: "请输入机构名称",
            trigger: "blur",
          },
        ],
        code: [
          {
            required: true,
            message: "请输入机构代码",
            trigger: "blur",
          },
        ],
        adminAccount: [
          { required: true, message: "请输入管理员账号", trigger: "blur" },
        ],
        adminName: [
          { required: true, message: "请输入管理员姓名", trigger: "blur" },
        ],
        adminPassword: [
          {
            required: function () {
              return this.mode === "create";
            },
            message: "请输入管理员密码",
            trigger: "blur",
          },
        ],
      },
    };
  },
  computed: {
    isEdit() {
      return this.mode === "edit";
    },
    dialogTitle() {
      return this.isEdit ? "编辑机构" : "新建机构";
    },
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
      if (val && this.isEdit) {
        this.fillForm();
      }
    },
  },
  methods: {
    fillForm() {
      const { id, name, code, adminAccount, adminName, status } = this.rowData;
      this.form = {
        id,
        name,
        code,
        adminAccount,
        adminName,
        adminPassword: "",
        status,
      };
    },
    handleSubmit() {
      this.$refs.form.validate((valid) => {
        if (!valid) return;

        const payload = { ...this.form };

        if (this.isEdit && !payload.adminPassword) {
          delete payload.adminPassword;
        }

        const api = this.isEdit ? updateOrg : addOrg;

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
