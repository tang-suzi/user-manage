const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  // configureWebpack: {
  //   resolve: {
  //     alias: {
  //       "@": require("path").resolve(__dirname, "src"),
  //     },
  //   },
  // },
  devServer: {
    historyApiFallback: true,
    proxy: {
      "/train": {
        target: "https://120.26.23.6",
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          "^/train": "",
        },
      },
      "/search": {
        target: "https://120.26.23.6",
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          "^/search": "",
        },
      },
    },
  },
});
