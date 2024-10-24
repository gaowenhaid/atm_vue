const SERVER_URL = 'http://127.0.0.1:8080' // 后端服务地址
const getProxy = (path, isPrivateAgent = false, target, ws = true) => {
    return {
        target: (isPrivateAgent === false || isPrivateAgent === undefined) ? SERVER_URL : target,
        ws,
        pathRewrite: {
            [`^/${path}`]: (isPrivateAgent === false || isPrivateAgent === undefined) ? `/${path}` : ''
        }
    }
}
module.exports = {
    lintOnSave: false,
    devServer: {
        disableHostCheck: true,
        port: process.env.port || 9528,
        open: true,
        overlay: {
            warnings: false,
            errors: true
        },
        proxy: {
            '/fa-pro-boao': getProxy('fa-pro-boao', false, 'http://111.62.12.5:18580'),
            //     '/print': {
            //         target: 'http://127.0.0.1:54321',
            //         changOrigin: true,
            //         ws: true,
            //         pathRewrite: {
            //             '^/print': '/print'
            //         }
            //     },
        }
    }
}