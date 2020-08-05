const path = require("path");
const webpack = require("webpack");
const glob = require("glob");

require("./env-config");
//消除冗余的css
const purifyCssWebpack = require("purifycss-webpack");
// html模板
const htmlWebpackPlugin = require("html-webpack-plugin");
//静态资源输出
const copyWebpackPlugin = require("copy-webpack-plugin");
const rules = require("./webpack.rules.conf.js");

//全局插件

// 获取html-webpack-plugin参数的方法
var getHtmlConfig = function (name, chunks) {
  return {
    template: `./src/${name}.html`,
    filename: `${name}.html`,
    inject: "head",
    hash: false, //开启hash  ?[hash]
    chunks: chunks,
    stats: { children: false },
    minify:
      process.env.NODE_ENV === "development"
        ? false
        : {
            removeComments: true, //移除HTML中的注释
            collapseWhitespace: false, //折叠空白区域 也就是压缩代码
            removeAttributeQuotes: true, //去除属性引用
          },
  };
};

function getEntry() {
  let entry = {};
  //读取src目录所有page入口
  glob.sync("./src/pages/**/*.js").forEach(function (name) {
    const fileName = name.replace(/\.\/src\/(.+)\.js$/g, "$1");
    var eArr = [];
    eArr.push(name);
    entry[fileName] = eArr;
  });
  return entry;
}

module.exports = {
  entry: getEntry(),
  module: {
    rules: [...rules],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "../src"),
    },
  },
  //将外部变量或者模块加载进来
  // externals: {
  //      'jquery': 'window.jQuery'
  // },
  // 提取公共代码
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          // 抽离第三方插件
          test: /node_modules/, // 指定是node_modules下的第三方包
          chunks: "initial",
          name: "vendor", // 打包后的文件名，任意命名
          // 设置优先级，防止和自定义的公共代码提取时被覆盖，不进行打包
          priority: 10,
        },
        utils: {
          // 抽离自己写的公共代码，common这个名字可以随意起
          chunks: "initial",
          name: "common", // 任意命名
          minSize: 0, // 只要超出0字节就生成一个新包
          minChunks: 2,
        },
      },
    },
  },
  plugins: [
    //静态资源输出
    // new copyWebpackPlugin([{
    //     from: path.resolve(__dirname, "../src/static/"),
    //     to: './static',
    //     ignore: ['.*']
    // }]),
    //静态资源输出
    new copyWebpackPlugin([
      {
        from: path.resolve(__dirname, "../src/assets/"),
        to: "./assets",
        ignore: [".*"],
      },
    ]),
    new copyWebpackPlugin([
      {
        from: path.resolve(__dirname, "../src/libs"),
        to: "./libs",
        ignore: [".*"],
      },
    ]),
    //全局插件引入
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery",
      "window.$": "jquery",
      "layer": path.resolve(__dirname, "../src/libs/layer/layer.js"),
      "window.layer": path.resolve(__dirname, "../src/libs/layer/layer.js"),
      _u: path.resolve(__dirname, "../src/js/common/utils.js"),
      "window._u": path.resolve(__dirname, "../src/js/common/utils.js"),
    }),

    // 消除冗余的css代码
    // new purifyCssWebpack({
    //     paths: glob.sync(path.join(__dirname, "../src/pages/*/*.html"))
    // })
  ],
};

//配置页面
const entryObj = getEntry();
const htmlArray = [];
Object.keys(entryObj).forEach((element) => {
  console.log(element);
  htmlArray.push({
    _html: element,
    title: "",
    chunks: ["vendor", "common", element],
  });
});

//自动生成html模板
htmlArray.forEach((element) => {
  module.exports.plugins.push(
    new htmlWebpackPlugin(getHtmlConfig(element._html, element.chunks))
  );
});
