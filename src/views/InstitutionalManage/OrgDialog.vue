<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="showDialog"
    width="520px"
    :before-close="handleClose"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="110px">
      <el-form-item label="机构名称" prop="orgName">
        <el-input
          v-model="form.orgName"
          maxlength="20"
          placeholder="请输入机构名称"
        />
      </el-form-item>

      <el-form-item label="管理员账号" prop="adminAccount">
        <el-input v-model="form.adminAccount" placeholder="请输入管理员账号" />
      </el-form-item>

      <el-form-item label="管理员姓名" prop="adminName">
        <el-input v-model="form.adminName" placeholder="请输入管理员姓名" />
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
          :active-value="1"
          :inactive-value="0"
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
import { aesEncrypt } from "@/utils/encryptAES";
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
        orgName: "", // 机构名称
        code: "", // 增加机构代码
        adminAccount: "",
        adminName: "",
        adminPassword: "",
        status: 1, // 默认为启用 1
      },
      rules: {
        orgName: [
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
            validator: (rule, value, callback) => {
              if (this.mode === "create" && !value) {
                callback(new Error("请输入管理员密码"));
              } else {
                callback();
              }
            },
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
      const { orgId, orgName, code, adminAccount, adminName, status } =
        this.rowData;
      this.form = {
        orgId,
        orgName,
        code,
        adminAccount,
        adminName,
        adminPassword: "",
        status,
      };
      console.log(this.form, "编辑机构form");
    },
    handleSubmit() {
      console.log(this.mode);
      console.log(this.rules.adminPassword);
      this.$refs.form.validate(async (valid) => {
        if (!valid) return;

        const payload = { ...this.form };
        payload.adminPassword = aesEncrypt(payload.adminPassword);

        if (this.isEdit && !payload.adminPassword) {
          delete payload.adminPassword;
        }

        const api = this.isEdit ? updateOrg : addOrg;

        try {
          let res = await api(payload);
          console.log(res);
          this.$message.success("操作成功");
          this.$emit("success");
          this.handleClose();
        } catch (error) {
          this.$message.error(error.message);
        }
      });
    },
    handleClose() {
      this.$refs.form && this.$refs.form.resetFields();
      this.$emit("update:visible", false);
    },
  },
};
</script>
