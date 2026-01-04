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
import { login } from "@/api/login";

export default {
  name: "LoginPage",
  data() {
    return {
      loginForm: {
        account: "",
        password: "",
      },
      loginRules: {
        account: [{ required: true, message: "请输入账号", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
      loading: false,
    };
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          let res = login(this.loginForm);
          console.log(res);
          // login(this.loginForm)
          //   .then((response) => {
          //     this.loading = false;
          //     // Assuming response contains token or success indication
          //     // You might want to store token here, e.g., in Vuex or localStorage
          //     // console.log('Login success', response);

          //     this.$message.success("登录成功");
          //     this.$router.push("/");
          //   })
          //   .catch((error) => {
          //     this.loading = false;
          //     console.error(error);
          //     // Error handling is usually done in request interceptor, but we can add specific handling here
          //   });
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
