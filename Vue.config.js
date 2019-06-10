//参考: https://blog.csdn.net/sunny_desmond/article/details/80916706
module.exports = {
    // 基本路径
    baseUrl: '/web/',
    outputDir: '../public/web/',
    lintOnSave: true,
    // 生产环境是否生成 sourceMap 文件
    // productionSourceMap: true,
    // 服务器端口号
    devServer: {
        disableHostCheck: true,
        https: false,
        inline: true,
        hot: true,
        host: '0.0.0.0',
        port: 86,
        proxy: {
            '/': {
                ws: false, // proxy websockets
                target: 'http://60.205.214.153:86',
                changeOrigin: true,
                secure: false,
            },
        }
    },
}


