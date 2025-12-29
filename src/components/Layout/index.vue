<template>
  <el-container class="page-container">
    <!-- <el-aside width="200px">Aside</el-aside> -->
    <Aside />
    <el-container class="container">
      <Header class="header" />
      <Main class="main" />
      <!-- <el-footer>Footer</el-footer> -->
    </el-container>
  </el-container>
</template>
<script>
import Aside from "./Aside.vue";
import Header from "./Header.vue";
import Main from "./Main.vue";

export default {
  name: "LayoutComponent",
  components: {
    Aside,
    Header,
    Main,
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {},
};
</script>
<style lang="scss" scoped>
.page-container {
  height: 100vh;
  .container {
    display: flex;
    flex-direction: column;
    .header {
      height: 60px;
    }
    .main {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
  }
}
</style>
