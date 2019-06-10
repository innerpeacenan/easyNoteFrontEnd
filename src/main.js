import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueResource from 'vue-resource'

Vue.use(VueResource);


//https://segmentfault.com/q/1010000008009082
Vue.http.interceptors.push((request, next) => {
    let description = request.url.description;
    request.url = request.url.path
    next((response) => {
        if (403 === response.status) {
            // 以下只是示范，也可以替换成其他的，比如 response.body 替换成其他的 json 对象，status 替换成 200 ，然后在请求里边应该就可以使用 then() 的第一个函数参数定义这个 404 回调了
            router.push({ path: '/login' })
        } else if (302 === response.status) {
            //后台返回 302 表示登陆成功,可直接进入主页
            router.push({path:'/'})
        } else if (200 === response.status) {
            if (response.body.status !== 1) {
                window.console.error(`${description}失败，原因: ${response.body.msg}`);
            } else {
                //
            }
        } else {
            window.console.error(`${description}失败(stuats code !=200)，原因: ${response.status}`);
        }
        return response
    })
})

new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app')




