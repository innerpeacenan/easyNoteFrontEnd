<template>
    <div id="itemDescription" class="panel-heading">
        <div>
            <div class="pull-right action-buttons">
                        <span @click.stop="edit($event)">
                            <a class="glyphicon glyphicon-edit" title="编辑描述">
                            </a>
                        </span>
                &nbsp;
                <span @click.stop="save()">
                    <a class="glyphicon glyphicon-saved" title="保存描述">
                    </a>
                </span>
            </div>
            <div>
                <textarea class="col-xs-12" v-if="seen" v-model="modifiedContent"
                          @keydown.ctrl.83.prevent="save(1)"
                          @keyup.esc="save()"
                          @keyup.enter="h($event)" @focus="h($event)" @paste="image($event)"
                          v-focus>
                </textarea>

                <table class="table"
                       v-if="seen  && undefined !== pictures && pictures.length > 0">
                    <thead>
                    </thead>
                    <tbody>
                    <tr v-for="(url,index) in pictures" :key="index">
                        <td><img :src="url"></td>
                    </tr>
                    </tbody>
                </table>
                <div class="textarea" v-if="!seen" @dblclick.stop="edit()" v-html="md"
                     v-highlightjs>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import marked from 'marked'
    import hljs from 'highlight.js'
    import 'highlight.js/styles/github.css';

    export default {
        name: "ItemDescription",
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
                item:{},
                seen: 0,
                description: '',
                modifiedContent: '',
                md: '',
                pictures: '',
            }
        },
        created() {
            // 避免造成重复绑定,比如登出后又重新登陆
            let state = this.$store.state;
            // 移除之前绑定的所有事件,值绑定这一个
            state.eventBus.$off(state.events.shouldGetDescription);
            state.eventBus.$on(state.events.shouldGetDescription, (item) => {
                window.console.log(state.events.shouldGetDescription)
                this.getDescription(item)
            })
        },
        methods: {
            getDescription(item) {
                window.console.log(item)
                if(!item.description){
                    item.description = ' ';
                }
                this.description = item.description
                this.modifiedContent = this.description
                this.item = item
                this.md = marked(this.modifiedContent)
            },
            image($event) {
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
                            this.$http.post(path, params, {
                                headers: {'Content-Type': 'multipart/form-data'}
                            }).then((response) => {
                                if (response.body.status !== 1) {
                                    //
                                } else {
                                    let data = response.body.data;
                                    this.modifiedContent = $event.target.value = text.value.substr(0, text.selectionStart + 1) + "![]("
                                        + data.url + ")" + text.value.substr(text.selectionStart);
                                    this.pictures = [data.url];
                                }
                            });
                        }
                    }
                }
            },
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
            edit() {
                this.modifiedContent = this.description
                this.seen = true
            },
            save() {
                let state = this.$store.state
                this.description = this.modifiedContent
                // 修改item属性对接的值
                this.item.description = this.description
                this.md = marked(this.description)
                this.seen = false
                state.eventBus.$emit(state.events.saveItem, this.item)
                window.console.log('save items')
            }
        }
    }
</script>

<style scoped>
    /* 设置笔记距离页面顶部的边距*/
    #itemDescription {
        margin-top: 1em;
    }

    /*笔记的输入文本框*/

    .textarea {
        width: 100%;
        min-width: 100%;
        /*display: table; !* 这一条语句清除浮动特别有用*!*/
        margin: 0 0 10px;
        padding: 9px;
        border: 1px solid #ccc;
        border-radius: 4px;
        background-color: rgba(255, 255, 255, 1);
        font-size: 13px;
        line-height: 1.42857143;
        color: #333;
        white-space: pre-wrap;
        word-wrap: break-word;
    }

    /*消除bootstrap 默认的段落设置*/
    .textarea ul li p {
        margin-top: 0;
        margin-right: 0;
        margin-bottom: 0;
        margin-left: 0;
        -webkit-margin-before: 0;
        -webkit-margin-after: 0;
        -webkit-margin-start: 0;
        -webkit-margin-end: 0;
    }

    /*
      *****************************************************************************************************************
      以下是拷贝的一套css样式,先试用吧
      *****************************************************************************************************************
     */
    table {
        *border-collapse: collapse; /* IE7 and lower */
        border-spacing: 0;
        width: 100%;
    }

    table {
        border: solid #ccc 1px;
        -moz-border-radius: 6px;
        -webkit-border-radius: 6px;
        border-radius: 6px;
        /*-webkit-box-shadow: 0 1px 1px #ccc;
        -moz-box-shadow: 0 1px 1px #ccc;
        box-shadow: 0 1px 1px #ccc;   */
    }

    table tr:hover {
        background: #fbf8e9;
        -o-transition: all 0.1s ease-in-out;
        -webkit-transition: all 0.1s ease-in-out;
        -moz-transition: all 0.1s ease-in-out;
        -ms-transition: all 0.1s ease-in-out;
        transition: all 0.1s ease-in-out;
    }

    table td, .table th {
        border-left: 1px solid #ccc;
        border-top: 1px solid #ccc;
        padding: 10px;
        text-align: left;
    }

    table th {
        background-color: #dce9f9;
        background-image: -webkit-gradient(linear, left top, left bottom, from(#ebf3fc), to(#dce9f9));
        background-image: -webkit-linear-gradient(to top, #ebf3fc, #dce9f9);
        background-image: -moz-linear-gradient(to top, #ebf3fc, #dce9f9);
        background-image: -ms-linear-gradient(to top, #ebf3fc, #dce9f9);
        background-image: -o-linear-gradient(to top, #ebf3fc, #dce9f9);
        background-image: linear-gradient(to top, #ebf3fc, #dce9f9);
        /*-webkit-box-shadow: 0 1px 0 rgba(255,255,255,.8) inset;
        -moz-box-shadow:0 1px 0 rgba(255,255,255,.8) inset;
        box-shadow: 0 1px 0 rgba(255,255,255,.8) inset;*/
        border-top: none;
        text-shadow: 0 1px 0 rgba(255, 255, 255, .5);
        padding: 5px;
    }

    table td:first-child, table th:first-child {
        border-left: none;
    }

    table th:first-child {
        -moz-border-radius: 6px 0 0 0;
        -webkit-border-radius: 6px 0 0 0;
        border-radius: 6px 0 0 0;
    }

    table th:last-child {
        -moz-border-radius: 0 6px 0 0;
        -webkit-border-radius: 0 6px 0 0;
        border-radius: 0 6px 0 0;
    }

    table th:only-child {
        -moz-border-radius: 6px 6px 0 0;
        -webkit-border-radius: 6px 6px 0 0;
        border-radius: 6px 6px 0 0;
    }

    table tr:last-child td:first-child {
        -moz-border-radius: 0 0 0 6px;
        -webkit-border-radius: 0 0 0 6px;
        border-radius: 0 0 0 6px;
    }

    table tr:last-child td:last-child {
        -moz-border-radius: 0 0 6px 0;
        -webkit-border-radius: 0 0 6px 0;
        border-radius: 0 0 6px 0;
    }
</style>