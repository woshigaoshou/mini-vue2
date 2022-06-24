import babel from 'rollup-plugin-babel';

export default {
  input: './src/index.js',  // 打包入口文件
  output: {
    file: './dist/vue.js',  // 导出路径
    name: 'Vue',            // 全局挂载Vue
    format: 'umd',          // umd格式
    sourcemap: true,        // 源码调试
  },
  plugins: [
    babel({
      exclude: 'node_modules/**'
    })
  ]
}
