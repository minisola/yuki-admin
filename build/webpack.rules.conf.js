const extractTextPlugin = require('extract-text-webpack-plugin')
const miniCssExtractPlugin = require('mini-css-extract-plugin')

const rules = [
  {
    test: /\.(css|scss|sass)$/,
    // 区别开发环境和生成环境
    use:
      process.env.NODE_ENV === 'development'
        ? ['style-loader', 'css-loader', 'sass-loader', 'postcss-loader']
        : [
            'style-loader',
            miniCssExtractPlugin.loader,
            'css-loader',
            'sass-loader',
            'postcss-loader',
          ],
  },
  // {
  //   test: /\.(less|css)$/,
  //   // 区别开发环境和生产环境
  //   use:
  //     process.env.NODE_ENV === "development"
  //       ? ["style-loader", "css-loader", "less-loader"]
  //       : [
  //           miniCssExtractPlugin.loader,
  //           "css-loader",
  //           "less-loader",
  //         ],
  // },
  {
    test: /\.js$/,
    use: [
      {
        loader: 'babel-loader',
      },
    ],
    // 不检查node_modules下的js文件
    exclude: /node_modules/,
  },
  {
    test: /\.(png|jpg|gif)$/,
    use: [
      {
        loader: 'url-loader',
        options: {
          limit: 5 * 1024, //小于这个时将会已base64位图片打包处理
          // 图片文件输出的文件夹
          publicPath: 'assets/images/',
          outputPath: 'assets/images/',
          minimize: true,
        },
      },
    ],
  },
  {
    test: /\.html$/,
    // html中的img标签
    use: {
      loader: 'html-loader',
      options: {
        attrs: ['img:src', 'img:data-src', 'audio:src'],
        limit: 5 * 1024, //小于这个时将会已base64位图片打包处理
        publicPath: 'assets/images/',
        outputPath: 'assets/images/',
        minimize: true,
      },
    },
  },
  {
    test: /\.(eot|woff2?|ttf|svg)$/,
    use: [
      {
        loader: 'url-loader',
        options: {
          name: '[name].[ext]',
          limit: 5000, // fonts file size <= 5KB, use 'base64'; else, output svg file
          // publicPath: 'assets/fonts/',
          useRelativePath: true, //使用相对路径
          outputPath: 'assets/fonts/',
        },
      },
    ],
  },
]
module.exports = rules
