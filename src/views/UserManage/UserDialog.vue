<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="showDialog"
    width="520px"
    :before-close="handleClose"
    destroy-on-close
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <!-- 账号 -->
      <el-form-item label="账号" prop="account">
        <el-input
          v-if="!isEdit"
          v-model="form.account"
          :disabled="isEdit"
          placeholder="请输入3-20位字母、数字"
          maxlength="20"
        />
        <div v-else>{{ form.account }}</div>
        <div v-if="form.account && form.account.length > 20" class="error-tip">
          字数超限
        </div>
      </el-form-item>

      <!-- 用户名 -->
      <el-form-item label="用户名" prop="name">
        <el-input
          v-model="form.userName"
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
      <el-form-item label="角色" prop="roleId">
        <el-select
          v-model="form.roleIds"
          placeholder="请选择角色"
          style="width: 100%"
          multiple
        >
          <el-option
            v-for="item in roleOptions"
            :key="item.roleId"
            :label="item.roleName"
            :value="item.roleId"
          />
          <!-- <el-option
            v-for="item in roleOptions"
            :key="item.roleId"
            :label="item.roleName"
            :value="item.roleId"
          /> -->
        </el-select>
      </el-form-item>

      <!-- 启用状态 -->
      <el-form-item label="启用状态">
        <el-switch
          v-model="form.status"
          :active-value="1"
          :inactive-value="0"
        />
      </el-form-item>
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
import { aesEncrypt } from "@/utils/encryptAES";
import {
  addUser,
  updateUser,
  getRoleListByOrg,
  getUserDetail,
} from "@/api/user";

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
  },
  data() {
    return {
      loading: false,
      form: {
        account: "",
        userName: "",
        password: "",
        roleIds: "",
        status: 1,
      },
      roleOptions: [],
      rules: {
        account: [
          { required: true, message: "请输入账号", trigger: "blur" },
          {
            pattern: /^[A-Za-z0-9]{3,20}$/,
            message: "账号需为3-20位字母或数字",
            trigger: "blur",
          },
        ],
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            pattern: /^[A-Za-z0-9\u4e00-\u9fa5]{2,20}$/,
            message: "用户名需为2-20位字符",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "请输入登录密码",
            trigger: "blur",
          },
          {
            pattern: /^[A-Za-z0-9]{6,12}$/,
            message: "密码需为6-12位字母或数字",
            trigger: "blur",
          },
        ],
        isSysAdmin: [
          { required: true, message: "请选择角色", trigger: "change" },
        ],
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
        if (this.isEdit) {
          this.form = { ...this.rowData };
          // 编辑模式下密码不必填（或是分开处理）
          // 这里简单处理，编辑模式下密码校验去掉
          this.rules.password[0].required = false;
        } else {
          this.form = {
            account: "",
            name: "",
            password: "",
            roleId: "",
            status: 1,
          };
          this.rules.password[0].required = true;
        }
        this.$nextTick(() => {
          this.$refs.form.clearValidate();
        });
      }
    },
  },
  mounted() {
    this.getRoleOptions();
    this.userDetail();
  },
  destroyed() {
    this.form = {
      account: "",
      userName: "",
      password: "",
      roleIds: "",
      status: 1,
    };
  },
  methods: {
    async userDetail() {
      const userId = this.rowData.userId;
      try {
        const res = await getUserDetail({ userId });
        this.form = { ...res };
      } catch (error) {
        this.$message.error(error.message || "获取用户详情失败");
        return {};
      }
    },
    async getRoleOptions() {
      try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        console.log(userInfo);
        const res = await getRoleListByOrg({ orgId: userInfo.orgId });
        this.roleOptions = res || [];
      } catch (error) {
        this.$message.error(error.message || "获取角色列表失败");
      }
    },
    handleClose() {
      this.showDialog = false;
    },
    handleSubmit() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          this.loading = true;
          // 密码加密
          this.form.password = aesEncrypt(this.form.password);
          const api = this.isEdit ? updateUser : addUser;
          try {
            const res = await api(this.form);
            console.log(res);
            this.$message.success(this.isEdit ? "编辑成功" : "创建成功");
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
.error-tip {
  color: #f56c6c;
  font-size: 12px;
  line-height: 1;
  padding-top: 4px;
  position: absolute;
  top: 100%;
  left: 0;
}
</style>
