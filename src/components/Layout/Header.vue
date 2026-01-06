<template>
  <el-header class="header">
    <div class="header-left">
      <!-- 面包屑或其他左侧内容，暂时留空或放标题 -->
      <span class="page-title"></span>
    </div>
    <div class="header-right">
      <el-dropdown trigger="click" @command="handleCommand">
        <div class="user-info">
          <span class="user-name">{{ username }}</span>
          <i class="el-icon-caret-bottom"></i>
        </div>
        <!-- 下拉菜单 -->
        <!-- 添加退出登录事件 -->
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </el-header>
</template>

<script>
export default {
  name: "HeaderComponent",
  data() {
    return {
      username: "",
    };
  },
  mounted() {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    this.username = userInfo?.username || "用户";
    console.log(userInfo);
  },
  methods: {
    handleCommand(command) {
      console.log(command);
      if (command === "logout") {
        console.log("退出登录");
        localStorage.removeItem("token");
        localStorage.removeItem("userInfo");
        this.$router.push("/login");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.header {
  background-color: #fff;
  border-bottom: 1px solid #dcdfe6;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 60px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .header-left {
    display: flex;
    align-items: center;
    .page-title {
      font-size: 18px;
      font-weight: bold;
      color: #303133;
    }
  }

  .header-right {
    .user-info {
      display: flex;
      align-items: center;
      cursor: pointer;
      .user-name {
        margin-left: 8px;
        margin-right: 4px;
        font-size: 14px;
        color: #606266;
      }
    }
  }
}
</style>
