import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
    mode: 'hash',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/login',
            component: () => import('./views/LogIn.vue')
        },
        {
            path:'/logout',
            component: () => import('./views/LogIn.vue')
        },
        {
            path:'/backup/notes',
            component: () => import( './views/Home.vue'),
        },
        {
            path:'/signUp/later',
            component: () => import( './views/SignUpLater.vue')
        },
        // {
        //   path: '/items',
        //   name: 'items',
        //   // route level code-splitting
        //   // this generates a separate chunk (about.[hash].js) for this route
        //   // which is lazy-loaded when the route is visited.
        //   component: () => import(/* webpackChunkName: "about" */ './views/Items.vue')
        // }
    ]
})
