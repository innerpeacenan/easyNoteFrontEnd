<template>
    <div class="panel-heading">
        <div>
            <ul>
                <li v-for="(note,index) in notes" :key="index" :id="'note_' + note.id">
                    <span class="hidden-xs" title="创建时间">{{note.c_time}}</span>
                    <span>
                    <select title="选择其他目录,则自动将笔记移动到其他目录下了" class="items" v-model="note.item_id"
                            @change="mv(note,index)">
                        <template v-if="note.item_id == item.id">
                            <option
                                    v-for="(item, optIndex) in items" :key="optIndex"
                                    :value="item.id" selected>{{item.name}}</option>
                            </template>
                            <template v-else>
                            <option
                                    v-for="(item, optIndex) in items" :key="optIndex"
                                    :value="item.id">{{item.name}}</option>
                        </template>
                    </select>
                    </span>
                    <div class="pull-right action-buttons">
                <span @click.stop="todo(note, index)">
                    <input type="checkbox" title="标记完成" v-model="note.isChecked"/>
                </span>
                        <span @click.stop="add()">
                    <a class="glyphicon glyphicon-plus-sign" title="添加笔记">
                    </a>
                </span>
                        &nbsp;
                        <span @click.stop="edit(note, $event)">
                    <a class="glyphicon glyphicon-edit" title="编辑笔记">
                    </a>
                </span>
                        &nbsp;
                        <span @click.stop="save(note)">
                    <a class="glyphicon glyphicon-saved" title="保存笔记">
                    </a>
                </span>
                        &nbsp;&nbsp;
                        <span @click.stop="" @dblclick="del(index)">
                    <a class="glyphicon glyphicon-trash" title="双击删除笔记"></a>
                </span>
                    </div>
                    <div>
                <textarea class="col-xs-12" v-if="note.seen" v-model="note.modifiedContent"
                          @keydown.ctrl.83.prevent="save(note, 1)"
                          @keyup.esc="save(note)"
                          @keyup.enter="h($event)" @focus="h($event, note)" @paste="image($event, note)"
                          v-focus>
                </textarea>

                        <table class="table"
                               v-if="note.seen  && undefined !== note.pictures && note.pictures.length > 0">
                            <thead>
                            </thead>
                            <tbody>
                            <tr v-for="(url,index) in note.pictures" :key="index">
                                <td><img :src="url"></td>
                            </tr>
                            </tbody>
                        </table>
                        <div class="textarea" v-if="!note.seen" @dblclick.stop="edit(note)" v-html="note.md"
                             v-highlightjs>
                        </div>
                    </div>
                </li>
            </ul>
            <div class="text-center more" @click.stop="more()" v-show="showMore">更多</div>
        </div>
    </div>
</template>

<script>
    import marked from 'marked'
    import hljs from 'highlight.js'
    import 'highlight.js/styles/github.css';

    export default {
        name: "BackupNotesPanel",
        directives: {
            focus: {
                inserted: function (el) {
                    el.focus()
                }
            },
            highlightjs: {
                inserted: function (el) {
                    let blocks = el.querySelectorAll('pre code');
                    Array.prototype.forEach.call(blocks, hljs.highlightBlock);
                },
                update: function (el, binding, vnode, oldVnode) {
                    if (vnode.data.domProps.innerHTML !== oldVnode.data.domProps.innerHTML) {
                        let blocks = el.querySelectorAll('pre code');
                        Array.prototype.forEach.call(blocks, hljs.highlightBlock);
                    }
                }
            },
        },
        data() {
            return {
                settings: {
                    // 单位是像素
                    textarea_default_height: 50
                },
                constant: {
                    status: {
                        enable: {
                            code: 10,
                            // 后端的默认状态
                            desc: "有效且已保存"
                        },
                        disable: {
                            code: 20,
                            desc: "未保存"
                        }
                    }
                },
                notes: [],

                /**
                 * 在对象被创建的时候就复制了
                 * 记录当前的item
                 */
                item: {},
                /**
                 * 记录当前的items,页面下拉选择框需要用到,
                 * Items实例对象列表
                 */
                items: []
            }
        },
        created() {
            // 避免造成重复绑定,比如登出后又重新登陆
            let state = this.$store.state;
            // 移除之前绑定的所有事件,值绑定这一个
            state.eventBus.$off(state.events.shouldGetNotes);
            state.eventBus.$on(state.events.shouldGetNotes, (item) => {
                window.console.log(state.events.shouldGetNotes)
                this.doGetNotes(item)
            })

            state.eventBus.$off(state.events.itemsChange);
            state.eventBus.$on(state.events.itemsChange, (items) => {
                window.console.log(state.events.itemsChange, items)
                this.items = items
            });

            // 如果当前的笔记显示的是要删除的item的，则清空相关所有笔记
            state.eventBus.$off(state.events.itemDelete);
            state.eventBus.$on(state.events.itemDelete, (item) => {
                window.console.log(state.events.itemDelete, 'item', item, 'this.item', this.item)
                if (item === this.item) {
                    this.notes = [];
                }
            });
        },
        computed: {
            // a computed getter
            showMore() {
                // 当 limit 参数被设置未0的时候. 表征没有新的内容可以其请求了
                if (this.item) {
                    return this.item.limit
                } else {
                    // 页面刚加载进来的时候,不显示
                    return 0
                }
            }
        },
        methods: {
            now() {
                let todayTime = new Date();
                let month = todayTime.getMonth() + 1;
                let day = todayTime.getDate();
                let year = todayTime.getFullYear();
                let hours = todayTime.getHours();
                let minutes = todayTime.getMinutes();
                let seconds = todayTime.getSeconds();
                return year + '-' + month + "-" + day + "-" + hours + ":" + minutes + ":" + seconds;
            },
            newNote() {
                let itemId = typeof this.item === 'undefined' ? 0 : this.item.id;
                return {
                    id: 0,
                    item_id: itemId,
                    content: "",
                    c_time: this.now(),
                    seen: false,
                    modifiedContent: "",
                    pictures: [],
                };
            },
            // 处理实际获取笔记的工作
            doGetNotes(item, type) {
                if (typeof item === "undefined") {// text
                    window.console.log('item is undefined', item)
                    return;
                }
                let path = this.$store.state.urls.getBackupNotes
                
                let config = {
                    params: {
                        item_id: item.id,
                        offset: item.offset,
                        limit: item.limit
                    }
                }
                this.$http.get(path, config).then((response) => {
                    if (response.body.status !== 1) {
                        //
                    } else {
                        let data = response.body.data;
                        if (Array.isArray(data) && data.length < item.limit) {
                            // 标志着再没有更多的笔记需要加载了
                            item.limit = 0
                        }
                        if (data.length === 0) {
                            if (!item.id) {
                                return false;
                            }
                            // 设置是否为追加模式,如果是发展为模式,返回控列表,否则返回新的一条记录
                            // 主要处理第一次加载的时候的问题
                            data = 'append' === type ? [] : [this.newNote()]
                        } else {
                            data = data.map((note) => {
                                note.md = marked(note.content);
                                note.seen = false;
                                return note;
                            });

                        }
                        item.notes = 'append' === type ? item.notes.concat(data) : data
                        item.offset = item.notes.length
                    }
                }).then(() => {// 回调后置处理
                    this.item = item;
                    this.notes = item.notes;
                });
            },
            add() {
                if ((typeof this.item == 'undefined') || (!this.item.id)) {
                    return false;
                }
                let note = this.newNote();
                // 在列表头部加一条数据
                this.notes.unshift(note);
                return true;
            },
            image($event, note) {
                // Edge 支持 event.clipboardData属性
                if ($event.clipboardData || $event.originalEvent) {
                    //not for ie11  某些chrome版本使用的是event.originalEvent
                    let clipboardData = ($event.clipboardData || $event.originalEvent.clipboardData);
                    if (clipboardData.items) {
                        // for chrome
                        let items = clipboardData.items,
                            len = items.length,
                            blob = null;
                        //在items里找粘贴的image,据上面分析,需要循环
                        for (let i = 0; i < len; i++) {
                            if (items[i].type.indexOf("image") !== -1) {
                                //getAsFile() 此方法只是living standard firefox ie11 并不支持
                                blob = items[i].getAsFile();
                            }
                        }
                        if (blob) {
                            let text = $event.target;
                            let path = this.$store.state.urls.image
                            
                            let params = new FormData();
                            params.append('img', blob);
                            this.$http.post(path, params,{
                                headers: { 'Content-Type': 'multipart/form-data' }
                            }).then((response) => {
                                if (response.body.status !== 1) {
                                    //
                                } else {
                                    let data = response.body.data;
                                    note.modifiedContent = $event.target.value = text.value.substr(0, text.selectionStart + 1) + "![]("
                                        + data.url + ")" + text.value.substr(text.selectionStart);
                                    note.pictures = [data.url];
                                }
                            });
                        }
                    }
                }
            },
            /**
             * auto-height 在编辑的时候,自动调整 textarea 高度
             * @param $event
             */
            h($event) {
                /**
                 * 这种方案 50px 扩充一次高度
                 */
                let target = $event.target;
                // height string such as: 50px,need to get substring '50' from '50px'
                let heightString = target.style.height;
                let height = heightString.substring(0, heightString.length - 2);
                if (height < target.scrollHeight) {
                    target.style.height = $event.target.scrollHeight + this.settings.textarea_default_height + 'px';
                }
            },
            edit(note) {
                note.modifiedContent = note.content
                note.seen = true
            },
            save(note, onlySave) {
                if (!note.item_id) {
                    return
                }
                // 将原来的及时更新改为非及时，以提高性能
                note.content = note.modifiedContent;
                let path = this.$store.state.urls.saveNote
                
                let params = {
                    id: note.id,
                    item_id: note.item_id,
                    content: note.content,
                }
                this.$http.post(path, params).then((response) => {
                    if (response.body.status !== 1) {
                        //
                    } else {
                        let data = response.body.data;
                        if (0 == note.id) {
                            note.id = data.id
                        }
                        // 如果为提交的时候,渲染markdown,否则不渲染对应的markdown
                        note.md = marked(note.content)
                    }
                    if (!onlySave) {
                        // 不管有没有实际更新数据,都自动保存数据
                        note.seen = false
                    }
                    this.item.offset = this.notes.length
                });
            },
            /**
             * delete 是 javascript 的//保留字
             * 删除笔记
             */
            del(index) {
                let path = this.$store.state.urls.deleteNote
                
                let config = {
                    body: {
                        id: this.notes[index].id
                    }
                }
                this.$http.delete(path, config).then((response) => {
                    if (response.body.status !== 1) {
                        //
                    } else {
                        // let data = response.body.data;
                        this.notes.splice(index, 1)
                        // 每次重新设置请求的起点,保证所请求的数据能够连接起来
                        this.item.offset = this.notes.length
                    }
                });
            },
            mv(note, index) {
                let path = this.$store.state.urls.moveNote
                
                let params = {
                    id: note.id,
                    itemId: note.item_id
                }
                this.$http.put(path, params).then((response) => {
                    if (response.body.status !== 1) {
                        //
                    } else {
                        // let data = response.body.data;
                        this.notes.splice(index, 1);
                        this.item.offset = this.notes.length
                    }
                });
            },
            //获取更多数据
            more() {
                if (!this.item) {
                    return;
                }
                let state = this.$store.state
                state.eventBus.$emit(state.events.itemUpdateLimitAndOffset, this.item)
                this.doGetNotes(this.item, 'append')
            },
            todo(note, index) {
                let path = this.$store.state.urls.noteTodo
                
                let params = {
                    note_id: note.id,
                }
                this.$http.put(path, params).then((response) => {
                    if (response.body.status !== 1) {
                        //
                    } else {
                        // let data = response.body.data;
                        this.notes.splice(index, 1);
                        // 目前移除掉完成的
                        this.item.offset = this.notes.length;
                    }
                });
            },
        },
    }
</script>

<style scoped>
</style>