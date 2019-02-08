<template>
    <div>
    </div>
</template>


<script>
    export default {
        name: "LogOut",
        created() {
            const path = this.$store.state.urls.logout
            const description = path.description
            let params = {}
            this.$http.post(path, params).then((response) => {
                if (response.body.status !== 1) {
                    window.console.error(`${description}失败，原因: ${response.body.msg}`);
                } else {
                    // 登陆成功
                }
            });
        },
        data() {
            return {}
        },
        methods: {}
    }
</script>

<style scoped>

</style>