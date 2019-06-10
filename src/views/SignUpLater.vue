<template>
    <div>
        <div class="container">
            <div class="row">
                <div class="col-sm-6">
                    <h1 class="text-center">make life easier</h1>
                    <h1 class="text-center">make life easier</h1>
                    <h1 class="text-center">make life easier</h1>
                    <h1 class="text-center">make life easier</h1>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "SignUpLater",
        data() {
            return {

            }
        },
        created () {
            this.getList()
        },
        methods: {
            getList() {
                let path = this.$store.state.urls.apiTest
                let config = {
                    params: {
                        item_id: 66,
                    }
                }
                this.$http.get(path, config).then((response) => {
                    window.console.log(response.body)
                })
            },
        }
    }
</script>

<style scoped>

</style>