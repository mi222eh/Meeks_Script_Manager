<template>
    <q-page class="q-pa-md">
        <div class="button-row">
            <q-btn to="scripts/create" label="Create new script" glossy color="primary"></q-btn>
            <q-btn @click="() => importScript()" label="Import" glossy color="secondary"></q-btn>
        </div>
        <q-list separator class="q-mt-md">
            <q-item
                clickable
                v-ripple
                v-for="(scriptContainer, index) in $store.getters[
                'scriptManager/getAllScripts'
            ]"
                :key="`script${index}`"
            >
                <q-item-section
                    clickable
                    v-on:click="() => gotoScript(scriptContainer.script.id)"
                >{{scriptContainer.script.title}}</q-item-section>
                <q-item-section top side>
                    <q-btn size="12px" flat dense round icon="more_vert">
                        <q-menu transition-show="scale" transition-hide="scale">
                            <q-list separator class="menu-list">
                                <q-item
                                    clickable
                                    v-ripple
                                    class="run"
                                    v-on:click="() => runCommand(scriptContainer.script.id)"
                                >
                                    <q-item-section>Run</q-item-section>
                                </q-item>
                                <q-item
                                    clickable
                                    v-ripple
                                    class="view"
                                    v-on:click="() => gotoScript(scriptContainer.script.id)"
                                >
                                    <q-item-section>View</q-item-section>
                                </q-item>
                                <q-item
                                    clickable
                                    v-ripple
                                    class="delete"
                                    v-on:click="() => deleteScript(scriptContainer)"
                                >
                                    <q-item-section>Delete</q-item-section>
                                </q-item>
                            </q-list>
                        </q-menu>
                    </q-btn>
                </q-item-section>
            </q-item>
        </q-list>
    </q-page>
</template>

<script lang="ts">
import Vue from 'vue';
import { ScriptObjectContainer } from 'src/store/scriptManager/types';
import { remote } from 'electron';
import { readJSON } from 'fs-extra';
export default Vue.extend({
    methods: {
        async runCommand(id: number) {
            await this.$store.dispatch('scriptManager/executeScript', id);
        },
        gotoScript(id: number) {
            this.$router.push(`/scripts/view/${id}`);
        },
        async importScript() {
            const files = await remote.dialog.showOpenDialog({
                properties: ['openFile', 'multiSelections'],
                filters: [
                    {
                        name: 'JSON',
                        extensions: ['json']
                    }
                ]
            });
            if (files.canceled) {
                return;
            }
            files.filePaths.forEach(async filePath => {
                const script = await readJSON(filePath);
                this.$store.dispatch('scriptManager/createScript', script);
            });
        },
        deleteScript(script: ScriptObjectContainer) {
            this.$q
                .dialog({
                    title: 'Delete',
                    message: `Do you want to delete ${script.script.title}?`,
                    cancel: true,
                    persistent: false
                })
                .onOk(() => {
                    this.$store.dispatch(
                        'scriptManager/removeScript',
                        script.script.id
                    );
                });
        }
    }
});
</script>

<style lang="scss" scoped>
.menu-list {
    .run {
        background-color: $primary;
        color: white;
    }
    .view {
        color: $primary;
    }
    .delete {
        // background-color: red;
        color: red;
    }
}
.button-row {
    display: flex;
    > * {
        margin-left: 15px;
        &:first-child {
            margin-left: 0;
        }
    }
}
</style>
