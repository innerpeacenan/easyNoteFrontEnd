const Mock = require('mockjs') // 获取mock对象
const Random = Mock.Random // 获取random对象，随机生成各种数据


const saveSuccess = (req) => {
    let params = JSON.parse(req.body)
    return {
        code: 1,
        "data": {
            params
        },
        "msg": "success"
    }
}

Mock.mock('/note/note', 'post', saveSuccess)

