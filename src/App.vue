<!--该文件时长vue-router的根目录-->
<template>
    <div id="app">
        <header>
            <router-link to="/" class="col-xs-3 AppHeader-navItem">主页</router-link>
            <router-link to="/backup/notes" class="col-xs-3 AppHeader-navItem">归档笔记</router-link>
            <router-link to="/backup/items" class="col-xs-3 AppHeader-navItem">归档事项</router-link>
            <router-link to="/logout" class="col-xs-3 AppHeader-navItem">登出</router-link>
        </header>
        <keep-alive>
            <router-view></router-view>
        </keep-alive>
    </div>
</template>

<style>

</style>
