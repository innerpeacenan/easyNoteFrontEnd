<template>
    <div id="ffz_app_main">

        <div title="同时按下<CtrL>和<ENTER>,可隐藏或显示左侧导航栏" tabindex="0" @keydown.ctrl.enter="toggleItemsTab()">
            <div :class="settings.seen_items === 1 ? 'col-lg-4' : 'hide'">
                <items-panel></items-panel>
            </div>

            <div :class="settings.seen_items === 1 ? 'col-lg-8' : 'col-lg-12'">
                <item-description></item-description>
                <todo-lists-panel></todo-lists-panel>
                <notes-panel></notes-panel>
            </div>
        </div>
    </div>

</template>

<script>
    // @ is an alias to /src
    import ItemsPanel from '@/components/ItemsPanel.vue'
    import NotesPanel from '@/components/NotesPanel.vue'
    import TodoListsPanel from '@/components/TodoListsPanel.vue'
    import ItemDescription from "../components/ItemDescription";

    export default {
        name: 'Home',
        data() {
            return {
                settings: {
                    seen_items: 1,//默认展示左侧事项列表
                }
            }
        },
        computed: {
        },
        components: {
            ItemDescription,
            ItemsPanel,
            NotesPanel,
            TodoListsPanel,
        },
        methods: {
            toggleItemsTab: function () {
                this.settings.seen_items = this.settings.seen_items == 1 ? 0 : 1;
            }
        },
    }
</script>
