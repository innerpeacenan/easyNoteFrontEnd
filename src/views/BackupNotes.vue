<template>
    <div id="ffz_app_backup_main">

        <div title="同时按下<CtrL>和<ENTER>,可隐藏或显示左侧导航栏" tabindex="0" @keydown.ctrl.enter="toggleItemsTab()">
            <div :class="settings.seen_items === 1 ? 'col-lg-4' : 'hide'">
                <items-panel></items-panel>
            </div>

            <div :class="settings.seen_items === 1 ? 'col-lg-8' : 'col-lg-12'">
                <item-description></item-description>
                <backup-notes-panel></backup-notes-panel>
            </div>
        </div>
    </div>

</template>

<script>
    // @ is an alias to /src
    import ItemsPanel from '@/components/ItemsPanel.vue'
    import BackupNotesPanel from '@/components/BackupNotesPanel.vue'
    import ItemDescription from "../components/ItemDescription"

    export default {
        name: 'BackupNotes',
        data() {
            return {
                // 默认设置想,默认展示左侧事项列表
                settings: {
                    seen_items: 1
                }
            }
        },
        components: {
            ItemDescription,
            ItemsPanel,
            BackupNotesPanel,

        },
        methods: {
            toggleItemsTab: function () {
                window.console.log('toggleItemsTab trigger')
                this.settings.seen_items = this.settings.seen_items == 1 ? 0 : 1;
            }
        },
    }
</script>
