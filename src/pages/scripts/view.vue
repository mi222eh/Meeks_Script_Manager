<template>
    <q-page class="q-pa-md script-page">
        <q-banner
            inline-actions
            class="text-white bg-red"
            v-if="!scriptContainer"
        >
            Could not find the specific script
            <template v-slot:action>
                <q-btn flat color="white" label="Go back" to="/scripts" />
            </template>
        </q-banner>
        <div v-else>
            <q-input
                square
                outlined
                v-model="scriptContainer.script.title"
                disable
                label="Title"
            />
            <q-input
                square
                outlined
                v-model="scriptContainer.script.command"
                disable
                label="Command"
            />
            <q-input
                square
                outlined
                v-model="scriptContainer.script.cwd"
                disable
                label="CWD"
            />

            <div class="buttons">
                <q-btn
                    class="q-mr-md"
                    color="primary"
                    label="Run"
                    :loading="scriptContainer.isRunning"
                    v-on:click="() => execute(scriptContainer.script.name)"
                />
                <q-btn
                    class="q-mr-md"
                    color="secondary"
                    label="Edit Script"
                    v-on:click="openScriptEdit"
                />
                <q-btn
                    class="q-mr-md"
                    flat
                    color="primary"
                    label="back to list"
                    to="/scripts"
                />
            </div>

            <div id="Console" ref="console">
                <div
                    v-for="(log, index) in scriptContainer.log"
                    :key="`log${index}`"
                >
                    {{ log }}
                </div>
            </div>
            <q-dialog v-model="editorOpen" persistent v-if="scriptToEdit">
                <q-card style="min-width: 80vw">
                    <q-form @submit="saveScript">
                        <q-card-section>
                            <div class="text-h6">Edit</div>
                        </q-card-section>

                        <q-card-section class="q-pt-none">
                            <q-input
                                square
                                outlined
                                v-model="scriptToEdit.name"
                                label="Name (used as id)"
                                disable
                            />
                            <q-input
                                square
                                outlined
                                v-model="scriptToEdit.title"
                                label="Title"
                                :rules="[
                                    value => value.length > 0 || 'Enter a title'
                                ]"
                            />
                            <q-input
                                square
                                outlined
                                v-model="scriptToEdit.command"
                                label="Command"
                                :rules="[
                                    value =>
                                        value.length > 0 || 'Enter a command'
                                ]"
                            />
                            <q-input
                                square
                                outlined
                                v-model="scriptToEdit.cwd"
                                label="CWD(Current Working Directory)"
                            />
                        </q-card-section>

                        <q-card-actions align="right" class="text-primary">
                            <q-btn
                                label="Save"
                                type="submit"
                                color="primary"
                                glossy
                            />
                            <q-btn flat label="Close" v-close-popup />
                        </q-card-actions>
                    </q-form>
                </q-card>
            </q-dialog>
        </div>
    </q-page>
</template>

<script lang="ts">
import Vue from 'vue';

import {
    ScriptObjectContainer,
    ScriptObject
} from '../../store/scriptManager/types';
export default Vue.extend({
    methods: {
        execute(name: string) {
            this.$store.dispatch('scriptManager/executeScript', name);
        },
        async saveScript() {

            if (!this.scriptToEdit) {
                return;
            }
            await this.$store.dispatch(
                'scriptManager/updateScript',
                this.scriptToEdit
            );
            this.editorOpen = false;
        },
        openScriptEdit() {
            this.scriptToEdit = null;
            if (!this.scriptContainer) {
                return;
            }
            const script: ScriptObject = this.$store.getters[
                'scriptManager/getScriptCopyByName'
            ](this.scriptContainer.script.name);
            if (!script) {
                return;
            }
            this.scriptToEdit = script;
            this.editorOpen = true;
        }
    },
    mounted() {
        const { name } = this.$route.params;
        const script: ScriptObjectContainer = this.$store.getters[
            'scriptManager/getScriptByName'
        ](name);

        if (!script) {
            return;
        }
        this.scriptContainer = script;
    },
    created(){

    },
    updated(){
        const consoleElement = this.$el.querySelector('#Console');
        if (!consoleElement) {
            return;
        }
        consoleElement.scrollTop = consoleElement.scrollHeight;
    },
    data() {
        const data: {
            scriptContainer: ScriptObjectContainer | null;
            scriptToEdit: ScriptObject | null;
            editorOpen: boolean;
        } = {
            scriptContainer: null,
            scriptToEdit: null,
            editorOpen: false
        };
        return data;
    }
});
</script>

<style lang="scss">
.script-page {
    display: flex;
    flex-direction: column;
    height: calc(100% - 222px);
    #Console {
        border: 1px black solid;
        height: calc(100vh - 18rem);
        overflow: auto;
    }
}
</style>
