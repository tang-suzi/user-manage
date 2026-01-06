<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
import { getMenuTree } from "@/api/user";
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
        console.log(res, "menu");
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
