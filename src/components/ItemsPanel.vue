<template>
    <div>
        <div class="panel panel-primary">
            <div class="panel-heading">
                <span class="glyphicon glyphicon-list"></span>事项列表
                <span @click.stop="parentDir">上一级目录</span>
                <div class="pull-right action-buttons">
                    <div class="btn-group pull-right">
                        <button type="button" class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown">
                            <span class="glyphicon glyphicon-cog" style="margin-right: 0px;"></span>
                        </button>
                        <ul class="dropdown-menu slidedown">
                            <li><a href=""><span class="glyphicon glyphicon-pencil"></span>Edit</a></li>
                            <li><a href=""><span class="glyphicon glyphicon-trash"></span>Delete</a></li>
                            <li><a href=""><span class="glyphicon glyphicon-flag"></span>Flag</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="panel-body">
                <ul class="list-group" v-for="(item, index) in items" :key="index">
                    <li class="list-group-item" @click.stop="getDetails(item)" draggable='true'
                        @dragstart="drag(item)"
                        @dragover.prevent @drop="drop(item)">
                        <div class="checkbox">
                            <input type="checkbox" @click.stop="toggleStatus(item,index)" v-model="item.isChecked"
                                   :disabled="item.status == 1"/>
                            <label for="checkbox">
                                <a style="display: inline-block" @click.stop="subDir(item)"
                                   title="事项或目录ID,单击可进入目录"><span>{{item.id}}</span></a>

                                <span v-show="!item.seen" title="事项名称">{{item.name}}</span>
                                <input v-model="item.name" @click.stop="" v-show="item.seen"
                                       @keyup.esc="save(item)"/>
                            </label>
                        </div>
                        <div class="pull-right action-buttons">
                            <a v-bind:title="item.visible_range == constant.visible_range.show_global.code ? '全局可见,单击可改变可见范围' : '仅当前目录下可见,双击可改变可见范围'"
                               v-bind:class="item.visible_range == constant.visible_range.show_global.code ? 'glyphicon glyphicon-globe' : 'glyphicon glyphicon-globe gray'"
                               @dblclick.stop="toggleVisibleRange(item)"></a>
                            <a @click.stop="add()"><span class="glyphicon glyphicon-plus-sign" title="添加新事项"></span></a>
                            <a @click.stop="edit(item)"><span class="glyphicon glyphicon-pencil"
                                                              title="编辑事项"></span></a>
                            <a @click.stop="save(item)"><span class="glyphicon glyphicon-saved" title="保存事项"></span></a>
                            <a @click.stop="" @dblclick.stop="del(index)"><span class="glyphicon glyphicon-trash"
                                                                                title="双击删除事项(请慎重操作)"></span></a>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'ItemsPanel',
        data() {
            return {
                // 项目用到的常量都放到这里
                constant: {
                    settings: {
                        perPage: 10 //设置首次加载个数
                    },
                    visible_range: {
                        show_global: {
                            code: 20,
                            desc: "全局显示"
                        },
                        show_inside_parent: {
                            code: 10,
                            desc: "只在父items下可见"
                        }
                    },
                    status: {
                        enable: {
                            code: 10,
                            desc: "启用"
                        },
                        staging: {
                            code: 20,
                            desc: "暂存"
                        },
                        draft: {
                            code: 30,
                            desc: "归档"
                        }
                    },
                },
                //@nxn 考虑下0和1的区别
                runtimeState: {
                    fid: '',
                    drag_from: {}, // 拖动的item
                    drag_to: {},  // 要拖动到的item
                },
                settings: {
                    perPage: 10
                },
                currentItem: '',
                // 所拥有的items集合
                items: [],
            };
        },
        // 组件初始化的钩子, 不能放到普通的 methods 中去
        created() {
            // 参数fid放到url里边去处理
            //https://router.vuejs.org/guide/essentials/dynamic-matching.html
            //https://stackoverflow.com/questions/48446709/vuejs-how-to-get-access-to-router-parameter-in-this-component
            this.runtimeState.fid = this.$route.params.fid ? this.$route.params.fid : '';
            this.getItems();
            let state = this.$store.state;
            state.eventBus.$off(state.events.saveItem);
            state.eventBus.$on(state.events.saveItem, (item) => {
                window.console.log(state.events.saveItem)
                this.save(item)
            })
        },
        methods: {
            // 新建一个数据model
            newItem() {
                return {
                    id: 0,
                    fid: this.runtimeState.fid,
                    name: " ",// make it not empty, so it can be saved where click save button directly
                    rank: 0,
                    status: this.constant.status.enable.code,
                    visible_range: this.constant.visible_range.show_inside_parent.code,
                    // above are extra property
                    isChecked: 0,
                    seen: true, // make it editable, so you could see the textarea
                    // 设置每个items在请求notes的时候设置的分页参数
                    limit: this.settings.perPage,
                    offset: 0,
                    // items 对应的笔记存放才这里
                    notes: [],
                    description: '',
                }
            },
            // 单击编辑按钮的时候
            edit(item) {
                item.seen = !item.seen;
            },
            save(item) {
                const path = this.$store.state.urls.saveItem
                let params = {
                    id: item.id,
                    name: item.name,
                    description: item.description,
                    fid: item.fid
                };
                this.$http.put(path, params).then((response) => {
                    if (response.body.status !== 1) {
                        //
                    } else {
                        let data = response.body.data;
                        // 针对插入的情况下,取出最后插入的主键  这里有个bug
                        if (parseInt(item.id) === 0) {
                            item.id = data.id
                            if(data.rank){
                                item.rank = data.rank
                            }
                        }
                        item.seen = false;
                        if(item.rank){
                            this.sort();
                        }
                    }
                })
            },
            // 删除 items
            del(index) {
                let item = this.items[index];
                // 这块描述不太准确
                const path = this.$store.state.urls.deleteItem
                let params = {
                    id: this.items[index].id
                }
                this.$http.delete(path, params).then((response) => {
                    if (response.body.status !== 1){
                        // 失败
                    } else {
                        // 通知笔记组件检查当前所属的事项是否被删除,如果被删除,也应该在页面上移除所有的笔记
                        // 后台也是真实删除了笔记的,目前没有删除笔记对应的tag,不影响使用
                        // 所以删除和归档不同,要慎重,与其他按钮单击事件不同,删除必须采用单击事件
                        let state = this.$store.state
                        state.eventBus.$emit(state.events.itemDelete, item)
                        this.items.splice(index, 1);
                    }
                });
            },
            getDetails(item) {
                this.getNotes(item);
                this.getTodoList(item);
                let state = this.$store.state
                state.eventBus.$emit(state.events.shouldGetDescription, item)
            },
            getTodoList(item) {
                let state = this.$store.state
                state.eventBus.$emit(state.events.shouldGetTodoList, item)
            },
            getNotes(item) {
                // 完成 items 和 notes 的相互绑定
                item.offset = 0;
                item.limit = this.settings.perPage;
                // 通知者
                let state = this.$store.state
                state.eventBus.$emit(state.events.shouldGetNotes, item)
            },
            toggleStatus(item, index) {
                const path = this.$store.state.urls.itemDraft
                let params = {
                    id: item.id
                }
                this.$http.put(path, params).then((response) => {
                    if (response.body.status !== 1) {
                        //
                    } else {
                        this.items.splice(index, 1)
                        let state = this.$store.state
                        state.eventBus.$emit(state.events.itemDelete, item)
                    }
                });
            },
            toggleVisibleRange(item) {
                const path = this.$store.state.urls.itemToggleVisibleRange
                let params = {
                    id: item.id
                }
                this.$http.put(path, params).then((response) => {
                    if (response.body.status !== 1) {
                        //
                    } else {
                        let data = response.body.data;
                        item.visible_range = data.visible_range;
                        // 重新调整顺序
                        this.sort();
                    }
                });
            },
            getItems() {
                const path = this.$store.state.urls.items
                const status = this.constant.status.enable.code
                const config = {
                    params: {
                        fid: this.runtimeState.fid,
                        status: [
                            status,
                        ]
                    }
                };
                this.$http.get(path, config).then((response) => {
                    if (response.body.status !== 1) {
                        //
                    } else {
                        let data = response.body.data;
                        if (Array.isArray(data) && data.length === 0) {
                            data = [this.newItem()];
                        } else {
                            data = data.map((one) => {
                                one.seen = false;
                                // 初始化 page 参数
                                one.offset = 0;
                                one.limit = this.settings.perPage;
                                // 全局显示的和启用的都勾选，这样更加美观
                                one.isChecked = this.constant.status.staging.code === parseInt(one.status) ? 1 : 0;
                                return one;
                            });
                            if (data.length > 0) {
                                // 自动请求getNote第一个事项的笔记
                                this.getDetails(data[0])
                            }
                        }
                        this.items = data
                        let state = this.$store.state
                        state.eventBus.$emit(state.events.itemsChange, this.items)
                    }
                });
            },
            // 当点击上一级目录的时候触发
            parentDir() {
                let id = this.runtimeState.fid;
                const path = this.$store.state.urls.parentDir

                let config = {
                    params: {
                        id: id,
                    }
                }
                this.$http.get(path, config).then((response) => {
                    if (response.body.status !== 1) {
                        //
                    } else {
                        let data = response.body.data;
                        // 记录当前item的父ID @nxn 优化
                        this.runtimeState.fid = data.dir;
                        // 更新相应的items列表
                        this.getItems()
                    }
                });
            },
            // 当点即一个items的时候, 进入一个items的子items
            subDir(item) {
                // 记录当前items所在的父目录
                this.runtimeState.fid = item.id;
                // 请求该父目录下的所有itmes
                this.getItems();
            },
            // 单击添加按钮的时候
            add() {
                this.items.unshift(this.newItem());
            },
            drag(item) {
                this.runtimeState.drag_from = item;
            },
            // 确定 rankFrom.rank 将要被修改的值, 并重新排序
            drop(item) {

                let dragFrom = this.runtimeState.drag_from;
                let dragTo = this.runtimeState.drag_to = item;
                let rankVal = 0;
                let toIndex = this.items.indexOf(item);
                // 默认排序是降序的,因此判断是从下往上拖动了
                if (parseFloat(dragFrom.rank) < parseFloat(dragTo.rank)) {
                    toIndex = this.items.indexOf(dragTo);
                    // 最终要将元素移动到 prevIndex 和 toIndex 之间
                    if (toIndex - 1 < 0) {
                        // fix bug about rank error
                        rankVal = parseFloat(dragTo.rank) + 1 / 3;
                    } else {
                        let toPrev = this.items[toIndex - 1];// 移动目标item的前一个item
                        rankVal = (parseFloat(toPrev.rank) + parseFloat(dragTo.rank)) / 2;
                    }
                }
                // 从上往下移动
                else if (parseFloat(dragFrom.rank) > parseFloat(dragTo.rank)) {// 55->8
                    if (toIndex + 1 >= this.items.length) {
                        rankVal = parseFloat(dragTo.rank) - 1 / 3;
                    } else {
                        let toNext = this.items[toIndex + 1];
                        rankVal = (parseFloat(dragTo.rank) + parseFloat(toNext.rank)) / 2;
                    }
                } else {
                    //
                }
                // save rank

                const path = this.$store.state.urls.rank
                let params = {
                    "dragFrom": dragFrom.id,
                    "dragTo": dragTo.id,
                    "rank": rankVal
                }
                this.$http.put(path, params).then((response) => {
                    if (response.body.status !== 1) {
                        //
                    } else {
                        let data = response.body.data;
                        dragFrom.rank = data.rank;
                        this.sort()
                    }
                });
            },
            sort() {
                this.items.sort(function (a, b) {
                    // 返回值大于0 表示需要调整顺序
                    if (parseInt(a.visible_range) > parseInt(b.visible_range)) {
                        return -1;
                    } else if (a.visible_range < b.visible_range) {
                        return 1;
                    } else {
                        // 降序排列
                        if (parseFloat(a.rank) > parseFloat(b.rank)) {
                            return -1;
                        } else if (parseFloat(a.rank) < parseFloat(b.rank)) {
                            return 1;
                        } else {
                            return 0;
                        }
                    }
                });
            },
        },
    }
</script>

<style scoped>

</style>