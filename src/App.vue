<!--该文件时长vue-router的根目录-->
<template>
    <div id="app">
        <header>
            <router-link to="/" class="col-xs-3 AppHeader-navItem">主页</router-link>
            <router-link to="/backup/notes" class="col-xs-3 AppHeader-navItem">归档笔记</router-link>
            <router-link to="/backup/items" class="col-xs-3 AppHeader-navItem">归档事项</router-link>
            <router-link to="/signUp/later" class="col-xs-2 AppHeader-navItem">补打卡</router-link>
            <router-link to="/logout" class="col-xs-1 AppHeader-navItem">登出</router-link>
        </header>
        <!--https://laracasts.com/discuss/channels/vue/vue-2-reload-component-when-same-route-is-requested-->
        <router-view :key="$route.fullPath"></router-view>
    </div>
</template>

<style>

</style>
