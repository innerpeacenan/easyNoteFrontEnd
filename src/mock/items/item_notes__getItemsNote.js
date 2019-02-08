const Mock = require('mockjs') // 获取mock对象
const Random = Mock.Random // 获取random对象，随机生成各种数据

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

const notes = (req) => {
    let params = getJsonFromUrl(req)
    let itemId = params['item_id']
    let count = 0;
    if (itemId === '1') {
        count = 50
    } else {
        count = 100
    }
    let noteList = []
    for (let i = 1; i <= count; i++) {
        let dateTime = Random.date() + ' ' + Random.time()
        let url = `http://10.26.15.54:10498/admin/order/changeID`;
        let header2 = '## 测试标题能够正常显示'
        let header3 = '### 测试标题能够正常显示'
        let codeBlock_javascript = '```javascript\n' +
            `eventBus.on('NEW_MESSAGE', () => {
  if(!chatHasFocus) {
    unreadCounter++;
  }
});` + '\n```';
        let codeBlock_php = '```php\n' +
            `/**
 * @return \\PDO
 */
public static function getMasterDb()
{
    if (is_null(self::$db)) {
        self::$db = self::getDb();
    }
    return self::$db;
}
` + '\n```';

        let contentFragments = [
            header2,
            codeBlock_javascript,
            codeBlock_php,
            header3,
            header3,
            url
        ];

        let shuffle = (a) => {
            for (let i = a.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [a[i], a[j]] = [a[j], a[i]];
            }
            return a;
        }
        contentFragments = shuffle(contentFragments)
        let content = contentFragments.join('\n')

        let note = {
            "id": i,
            "item_id": "1",
            "content": content,
            "c_time": dateTime,
            "status": "1",
            "pictures": []
        }
        noteList.push(note)
    }
    return {
        "code": 1,
        "data": noteList,
        "msg": "success"
    };
}

Mock.mock('/note/item-notes?item_id=1&offset=0&limit=10', 'get', notes);
Mock.mock('/note/item-notes?item_id=2&offset=0&limit=10', 'get', notes);
