import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        urls: {
            image : {
                'path': "/image/save",
                'description': '保存图片',
            },
            logout: {
                'path': "/logout",
                'description': '登陆',
            },
            login: {
                'path': "/login/in",
                'description': '登陆',
            },
            saveItem: {
                'path': '/item/item',
                'description': '保存事项',
            },
            deleteItem: {
                'path': '/item/item',
                'description': '删除事项',
            },
            items: {
                'path': '/item/items',
                'description': '获取事项列表',
            },
            itemToggleVisibleRange: {
                'path': 'item/toggle-visible-range',
                'description': '改变事项的显示作用域',
            },
            parentDir: {
                'path': '/item/parent-dir',
                'description': '获取上级目录',
            },
            rank: {
                'path': '/item/rank',
                'description': '事项排序',
            },
            itemDraft: {
                'path': "/item/item-draft",
                'description': '事项归档',
            },
            getTodoList: {
                'path': "/item/todo-list",
                'description': '待办列表'
            },
            apiTest:{
                'path': "/api/test",
                'description': 'API接口测试'
            },
            todoDoneToday: {
                'path': "/item/todo-done-today",
                'description': '完成事项列表'
            },
            collectionDoneToday: {
                'path': "/item/collection-done-today",
                'description': '今天完成的集合列表'
            },
            getBackupNotes: {
                'path': '/note/item-backupNotes',
                'description': '获取事项下的笔记'
            },
            getNotes: {
                'path': '/note/item-notes',
                'description': '获取事项下的笔记'
            },
            moveNote: {
                'path': '/note/move-note',
                'description': '改变笔记所属的事项',
            },
            setItems: {
                'path':"/note/setItems",
                'description':"设置笔记所述的事项列表",
            },
            saveNote: {
                'path': "/note/note",
                'description': '保存或更新具体一条笔记'
            },
            deleteNote: {
                'path': "/note/note",
                'description': '删除具体一条笔记'
            },
            noteDone: {
                'path': "/note/note-done",
                'description': '归档具体一条笔记'
            },
            noteTodo: {
                'path': "/note/note-todo",
                'description': '将具体一条笔记打回待办'
            },
        },
        events: {
            'saveItem' : 'save-item', // 保存笔记,通知保存笔记
            'itemUpdateLimitAndOffset':'item-update-limit-and-offset',// 暂未有监听
            'shouldGetDescription':'should-get-description',
            'shouldGetTodoList':'should-get-todo-list',
            'shouldGetNotes': 'should-get-notes',
            'itemResetLimitAndOffset': 'item-reset-limit-and-offset',
            'itemsChange': 'items-change',
            'itemDelete': 'item-delete',
        },
        eventBus: new Vue({
            items: [],
        }),
        picture_index: 1,

    },
    mutations: {},
    actions: {
        'should-get-notes': (item) => {
            window.console.log('should-get-notes', item)
        },
        'item-reset-limit-and-offset': (item) => {
            //监听重置分页选项事件
            // 保障 offset 整型,避免弱类型的坑
            item.limit = item.settings.perpage;
            item.offset = item.notes.length
        },
        'items-change': (items) => {
            window.console.log(items)
        },

        // 如果当前的笔记显示的是要删除的item的，则清空相关所有笔记
        'item-delete': (item) => {
            window.console.log('item-delete', 'item', item)
            item.notes = [];
        },
    }
})
