const path = require('path');
const webpack = require("webpack");
const merge = require("webpack-merge");
const webpackConfigBase = require('./webpack.base.conf');
const webpackConfigDev = {
	mode: 'development', // 通过 mode 声明开发环境
	output: {
		path: path.resolve(__dirname, '../dist'),
        filename: '[name].[hash].js',
        publicPath: '/'
	},
	devtool: 'cheap-module-eval-source-map',
	
	devServer: {
		contentBase: path.join(__dirname, "../dist"),
		publicPath:'/',
		index: '/pages/index.html',
		host: "127.0.0.1",
		port: "8090",
		overlay: true, // 浏览器页面上显示错误
		// open: true, // 开启浏览器
		// stats: "errors-only", //stats: "errors-only"表示只打印错误：
		//服务器代理配置项
        proxy: {
            '/api': {
                target: 'http://it.cata-log.cn:9016',
                secure: true,
				changeOrigin: true,
				pathRewrite: {'^/api' : ''}
            }
        }
    },
}
module.exports = merge(webpackConfigBase, webpackConfigDev);