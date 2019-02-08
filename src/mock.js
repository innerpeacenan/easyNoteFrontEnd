const Mock = require('mockjs') // 获取mock对象
const Random = Mock.Random // 获取random对象，随机生成各种数据，具体请翻阅文档


function getJsonFromUrl (req) {
    if ('GET' === req.type) {
        let url = req.url;
        let query = url.substr(1);
        let question = url.indexOf("?");
        query = url.substr(question + 1);
        let hash = query.indexOf("#");
        if (hash > -1) query = query.substr(0, hash);
        let result = {};
        query.split("&").forEach(function (part) {
            if (!part) return;
            part = part.split("+").join(" "); // replace every + with space, regexp-free version
            let eq = part.indexOf("=");
            let key = eq > -1 ? part.substr(0, eq) : part;
            let val = eq > -1 ? decodeURIComponent(part.substr(eq + 1)) : "";
            let from = key.indexOf("[");
            if (from == -1) result[decodeURIComponent(key)] = val;
            else {
                let to = key.indexOf("]", from);
                let index = decodeURIComponent(key.substring(from + 1, to));
                key = decodeURIComponent(key.substring(0, from));
                if (!result[key]) result[key] = [];
                if (!index) result[key].push(val);
                else result[key][index] = val;
            }
        });
        return result;
    } else {
        return JSON.parse(req.body);
    }

}


require('./mock/items/item_items__first_come_in')
// require('./mock/items/item_items__rank')
require('./mock/items/item_item__save')
require('./mock/items/item_notes__getItemsNote')
