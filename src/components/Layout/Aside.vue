<template>
  <el-aside width="200px">
    <el-menu
      router
      background-color="#253362"
      text-color="#fff"
      :collapse="false"
      active-text-color="#ffd04b"
      style="height: 100vh"
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
  //   mounted() {
  //     console.log(routes.options.routes[0].children);
  //   },
};
</script>
