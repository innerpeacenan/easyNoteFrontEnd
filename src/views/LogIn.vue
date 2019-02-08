<template>
    <div>
        <div class="container">
            <div class="row">
                <div class="col-sm-6">
                    <h1 class="text-center">make life easier</h1>
                </div>
            </div>

            <div clas="row">
                <form id="loginForm" class="form-horizontal col-sm-6" method="post">
                    <div class="form-group">
                        <label class="col-sm-2 control-label">用户: </label>
                        <div class="col-sm-10">
                            <input class="form-control" id="username" name="name" v-model='name'
                                   autocomplete="off" autofocus>
                            <span>{{errorMsg['name']}}</span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label">密码: </label>
                        <div class="col-sm-10">
                            <input class="form-control" id="passwd" name="passwd" v-model="passwd"
                                   autocomplete="off" type="password">
                            <span>{{errorMsg['passwd']}}</span>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="col-sm-offset-2 col-sm-10">
                            <button type="button" v-on:click.stop="doLogin()" class="btn btn-default">登录</button>
                            <button type="button" v-on:click.stop="logout()" class="btn btn-default pull-right">登出</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>


<script>
    export default {
        name: "LogIn",
        created(){
            this.logout();
        },
        data() {
            return {
                // 默认设置想,默认展示左侧事项列表
                name: "",
                passwd: "",
                errorMsg: {
                    name: "",
                    passwd: "",
                },
            }
        },
        methods: {
            doLogin() {
                const path = this.$store.state.urls.login
                let params = {
                    name: this.name,
                    passwd: this.passwd,
                }
                this.$http.post(path, params).then((response) => {
                    let data = response.body.data;
                    if (response.body.status !== 1) {
                        this.errorMsg.name = data.name;
                        this.errorMsg.passwd = data.passwd;
                    } else {
                        // 登陆成功
                        this.name = data.name;
                        this.passwd = data.passwd;
                    }
                }, (response) => {
                    if (302 !== response.status) {
//
                    }
                });
            },
            logout(){
                const path = this.$store.state.urls.logout
                const description = path.description
                let params = {}
                this.$http.post(path, params).then((response) => {
                    if (response.body.status !== 1) {
                        window.window.console.error(`${description}失败，原因: ${response.body.msg}`);
                    } else {
                        // 登陆成功
                    }
                });
            },
        }
    }
</script>

<style>
    #username {
        background-repeat: no-repeat;
        background-position: 2px -65px;
        background-image: url("/web/img/input_icons_24.png");
        background-attachment: scroll;
        line-height: 2em;
        padding-left: 30px;
    }

    #username:focus {
        background-repeat: no-repeat;
        background-position: 2px -105px;
        background-image: url("/web/img/input_icons_24.png");
        background-attachment: scroll;
    }

    #passwd {
        background-repeat: no-repeat;
        background-position: 2px -144px;
        background-image: url("/web/img/input_icons_24.png");
        background-attachment: scroll;
        line-height: 2em;
        padding-left: 30px;
    }

    #passwd:focus {
        background-repeat: no-repeat;
        background-position: 2px -185px;
        background-image: url("/web/img/input_icons_24.png");
        background-attachment: scroll;
    }
</style>