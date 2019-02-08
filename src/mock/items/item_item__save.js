const Mock = require('mockjs') // 获取mock对象
const Random = Mock.Random // 获取random对象，随机生成各种数据


/**
 * 单击新建立的事项右侧的保存按钮,向后台发起请求,保存记录
 */
Mock.mock('/item/item', 'put', () => {//第一个参数,req
        let maxItemId = localStorage.getItem('maxItemId')
        if(!maxItemId){
            maxItemId = 1;
        }else{
            maxItemId = parseInt(maxItemId) + 1;
            localStorage.setItem('maxItemId', maxItemId)
        }
        return {
        "code": 1,
        "data": {
            "id": maxItemId,
        },
        "msg": "success"
    }
});

