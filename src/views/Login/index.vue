<template>
  <div class="login-container">
    <el-card class="login-card">
      <div slot="header" class="clearfix">
        <span>平台登录</span>
      </div>
      <el-form
        :model="loginForm"
        :rules="loginRules"
        ref="loginForm"
        label-width="0px"
      >
        <el-form-item prop="account">
          <el-input
            v-model="loginForm.account"
            placeholder="账号"
            prefix-icon="el-icon-user"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            v-model="loginForm.password"
            placeholder="密码"
            prefix-icon="el-icon-lock"
            @keyup.enter.native="handleLogin"
          ></el-input>
        </el-form-item>
        <el-form-item prop="orgId">
          <el-select
            v-model="loginForm.orgId"
            placeholder="请选择机构"
            filterable
            style="width: 100%"
          >
            <el-option
              v-for="item in orgList"
              :key="item.orgId"
              :label="item.orgName"
              :value="item.orgId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            style="width: 100%"
            :loading="loading"
            @click="handleLogin"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { aesEncrypt } from "@/utils/encryptAES";
import { login, getAllEnableOrg } from "@/api/login";

export default {
  name: "LoginPage",
  data() {
    return {
      loginForm: {
        account: "",
        password: "",
        orgId: null,
      },
      loginRules: {
        account: [{ required: true, message: "请输入账号", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
      orgList: [],
      loading: false,
    };
  },
  created() {
    this.fetchOrgList();
  },
  methods: {
    async fetchOrgList() {
      try {
        let data = await getAllEnableOrg();
        this.orgList = data || [];
      } catch (error) {
        this.$message.error(error.message || "获取机构失败");
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(async (valid) => {
        if (valid) {
          this.loading = true;
          try {
            this.loginForm.password = aesEncrypt(this.loginForm.password);
            let { accessToken, userInfo, tokenType } = await login({
              ...this.loginForm,
              orgId: 0,
            });
            localStorage.setItem("token", `${tokenType} ${accessToken}`);
            localStorage.setItem("userInfo", JSON.stringify(userInfo));
            this.$message.success("登录成功");
            this.$router.push("/");
          } catch (error) {
            this.$message.error(error.message);
          } finally {
            this.loading = false;
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f2f5;
  background-image: url("https://gw.alipayobjects.com/zos/rmsportal/TVYTbAXWheQpRcWDaDMu.svg"); /* Optional background */
  background-repeat: no-repeat;
  background-position: center 110px;
  background-size: 100%;
}

.login-card {
  width: 400px;
}
</style>
