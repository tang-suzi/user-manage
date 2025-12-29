<template>
  <el-aside width="200px" class="aside">
    <div class="logo-container"></div>
    <el-menu
      router
      background-color="#253362"
      text-color="#fff"
      :collapse="false"
      active-text-color="#ffd04b"
      class="menu"
    >
      <el-menu-item
        v-for="route in routes"
        :key="route.path"
        :index="route.path"
      >
        {{ route.meta.title }}
      </el-menu-item>
    </el-menu>
  </el-aside>
</template>
<script>
import routes from "@/router";
export default {
  name: "AsideComponent",
  data() {
    return {};
  },
  computed: {
    routes() {
      return routes.options.routes[0].children;
    },
  },
};
</script>
<style lang="scss" scoped>
.aside {
  background-color: #253362;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.logo-container {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #2b3c72; /* Slightly lighter or same as menu */
  color: #fff;
  font-weight: bold;
  font-size: 18px;
  .logo {
    width: 30px;
    height: 30px;
    margin-right: 10px;
  }
}
.menu {
  border-right: none;
  flex: 1;
  overflow-y: auto;
}
</style>
