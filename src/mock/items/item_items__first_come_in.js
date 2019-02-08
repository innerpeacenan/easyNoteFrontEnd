/*
 * 用来测试第一次第一次进入列表页面,此时没有任何数据返回
*/

const Mock = require('mockjs') // 获取mock对象
// const Random = Mock.Random // 获取random对象，随机生成各种数据，具体请翻阅文档


/*
 * 刚进入页面,向后台请求,后台没有一条记录,检测是否会自动新建立一条记录
 */
Mock.mock('/item/items?fid=&status%5B%5D=10', 'get', () => {//第一个参数,req
    return {
        "code": 1,
        "data": [],
        "msg": "success"
    }
});


