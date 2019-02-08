<template>
    <div class="panel-heading">
        <div class="collection" v-for="(collection,ck) in collections" :key="ck"
             :id="'collections_' + collection.id">
            <ul>
                <li class="collection_header">
                <span>
                    <input type="checkbox" title="选中表示今天任务完成"
                           @click.stop.prevent="collectionDoneToday(collection,ck)"/>
                </span>
                    <span>共{{collection.total_count}}天,已打卡{{collection.check_in_count}}天,坚持率{{(collection.check_in_count / collection.total_count * 100).toFixed(2)}}%</span>
                </li>
                <li v-for="(todo,tk) in collection.todo" :key="tk" :id="'todos_' + collection.id">
                    <div class="action-buttons">
                <span>
                    <input type="checkbox" title="选中表示今天任务完成" @click.stop.prevent="todoDoneToday(collection,todo,tk)"/>
                </span>
                        <span>{{todo.description}}</span>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    export default {
        name: "TodoListsPanel",
        data: function () {
            return {
                collections: [],
                // 记录当前的item
                item: {},
                // 记录当前的items,页面下拉选择框需要用到
                items: []
            }
        },
        created () {
            // 避免造成重复绑定,比如登出后又重新登陆
            let state = this.$store.state;
            // 移除之前绑定的所有事件,值绑定这一个
            state.eventBus.$off(state.events.shouldGetTodoList);
            state.eventBus.$on(state.events.shouldGetTodoList, (item) => {
                window.console.log(state.events.shouldGetTodoList)
                this.getList(item)
            })
        },
        methods: {
            getList(item) {
                if (item !== this.item) {
                    this.collections = [];
                }
                let path = this.$store.state.urls.getTodoList

                let config = {
                    params: {
                        item_id: item.id,
                    }
                }
                this.$http.get(path, config).then((response) => {
                    let data = response.body.data;
                    if (data.length === 0) {
                        return false;
                    }
                    this.collections = data
                    this.item = item
                })
            },
            todoDoneToday(collection, todo, tk) {
                let path = this.$store.state.urls.todoDoneToday
                let params = {
                    todo_id: todo.id,
                }

                this.$http.post(path, params).then((response) => {
                    if (response.body.status === 1) {
                        collection.todo.splice(tk, 1);
                    }
                });
            },
            collectionDoneToday(collection, ck) {
                // 通过 click.stop.prevent 阻止默认被勾选的行为
                let path = this.$store.state.urls.collectionDoneToday

                let params = {
                    collection_id: collection.id,
                }
                this.$http.post(path, params).then((response) => {
                    if (response.body.status === 1) {
                        this.collections.splice(ck, 1);
                    }
                });
            },
        }
    }
</script>

<style scoped>
    .collection {
        text-decoration: none;
        margin-top: 5px;
        margin-bottom: 5px;
        margin-left: 5px;
        padding-left: 15px;
        padding-top: 5px;
        padding-right: 5px;
        padding-bottom: 5px;
        /*display: list-item;*/
        border: 1px solid #ccc;
        border-radius: 4px;
        background-color: rgba(255, 255, 255, 1);
    }

    .collection_header {
        margin-bottom: 10px;
        border-bottom: 3px solid #ccc;
    }
</style>