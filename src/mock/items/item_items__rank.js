const Mock = require('mockjs') // 获取mock对象
const Random = Mock.Random // 获取random对象，随机生成各种数据


/**
 * 用来测试排序是否正确
 * @nxn 新版本目前还不支持排序
  */

const items = () => {//req
    let itemsList = [] // 用于存放文章数据的数组
    for (let i = 1; i <= 10; i++) {
        let dateTime = Random.date() + ' ' + Random.time()
        let rank = Random.float(1, 200)

        let post = {
            "id": i,
            "fid": "66",
            "user_id": "1",
            "name": "item:" + rank,
            "rank": rank,
            "c_time": dateTime,
            "u_time": dateTime,
            "status": "10",
            "visible_range": "" + (10 * Random.int(1,2))
        };
        itemsList.push(post)
    }

    return {
        code: 1,
        msg: "success",
        data: itemsList
    }
}

// 请求不能带domin
Mock.mock('/item/items?fid=&status%5B%5D=10', 'get', items);