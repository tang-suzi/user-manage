<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
import { getMenuTree } from "@/api/user";
import cloneDeep from "lodash/cloneDeep";
import { resetRouter } from "@/router";

export default {
  name: "KnowledgeBase",
  data() {
    return {};
  },
  async created() {
    await this.getMenu();
  },
  methods: {
    async getMenu() {
      try {
        const res = await getMenuTree();
        const menus = cloneDeep(this.$router.options.routes);
        menus[0].children.map((menu) => {
          res.forEach((child) => {
            if (`/${menu.meta.key}` === child.path) {
              menu.meta.hidden = true;
            }
          });
        });
        // 将路由替换为新的menus,并刷新路由
        this.$router.options.routes = menus;
        resetRouter();
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style lang="scss">
body {
  margin: 0;
  padding: 0;
}
#app {
  height: 100vh;
  width: 100vw;
}
</style>
