<template>
    <q-page class="q-pa-md script-page">
        <q-banner inline-actions class="text-white bg-red" v-if="!scriptContainer">
            Could not find the specific script
            <template v-slot:action>
                <q-btn flat color="white" label="Go back" to="/scripts" />
            </template>
        </q-banner>
        <div v-else class="flex-column flex-grow">
            <q-input square outlined v-model="scriptTitle" label="Title" />
            <div class="buttons q-my-md">
                <q-btn
                    class="q-mr-md"
                    color="primary"
                    label="Run"
                    :loading="scriptContainer.isRunning"
                    v-on:click="() => execute(scriptContainer.script.id)"
                />
                <q-btn class="q-mr-md" flat color="primary" label="back to list" to="/scripts" />
                <q-btn
                    class="q-mr-md"
                    flat
                    color="secondary"
                    label="Export"
                    @click="() => exportScript()"
                />
            </div>
            <q-card class="flex-grow flex-column">
                <q-tabs
                    v-model="tab"
                    dense
                    class="text-grey"
                    active-color="primary"
                    indicator-color="primary"
                    align="justify"
                >
                    <q-tab name="console" label="Console" />
                    <q-tab name="commands" label="Command List" />
                </q-tabs>

                <q-separator class="flex-shrink" />

                <q-tab-panels v-model="tab" animated class="panels flex-column flex-grow">
                    <q-tab-panel name="console" class="flex-grow flex-column">
                        <div id="Console" ref="console" class="flex-grow">
                            <div
                                v-for="(log, index) in scriptContainer.log"
                                :key="`log${index}`"
                            >{{ log }}</div>
                        </div>
                        <!-- <q-input
                            prefix=">"
                            square
                            dense
                            outlined
                            v-model="commandLine"
                            v-on:keyup.enter="sendCommandLine"
                        />-->
                    </q-tab-panel>

                    <q-tab-panel name="commands" class="flex-grow">
                        <q-btn
                            color="positive"
                            glossy
                            label="Add Command"
                            class="full-width"
                            @click="() => openCreateCommand()"
                            stretch
                        />
                        <q-list bordered separator class="q-mt-md">
                            <draggable v-model="commandList" draggable=".command">
                                <transition-group>
                                    <q-item
                                        clickable
                                        v-ripple
                                        :class="{
                                        'command': !scriptContainer.isRunning
                                    }"
                                        v-for="(command) in commandList"
                                        :key="command.commandId"
                                    >
                                        <q-item-section>
                                            <q-item-label>{{command.title}}</q-item-label>
                                            <q-item-label caption>{{command.command}}</q-item-label>
                                        </q-item-section>
                                        <q-item-section top side>
                                            <q-btn size="12px" flat dense round icon="more_vert">
                                                <q-menu
                                                    transition-show="scale"
                                                    transition-hide="scale"
                                                >
                                                    <q-list separator class="menu-list">
                                                        <!-- <q-item
                                                        clickable
                                                        v-ripple
                                                        class="run"
                                                        v-on:click="() => runCommand(scriptContainer.script.id)"
                                                    >
                                                        <q-item-section>Run</q-item-section>
                                                        </q-item>-->
                                                        <q-item
                                                            clickable
                                                            v-ripple
                                                            class="view"
                                                            v-on:click="() => openEditCommand(command)"
                                                        >
                                                            <q-item-section>View</q-item-section>
                                                        </q-item>
                                                        <q-item
                                                            clickable
                                                            v-ripple
                                                            class="delete"
                                                            v-on:click="() => deleteCommand(command.commandId)"
                                                        >
                                                            <q-item-section>Delete</q-item-section>
                                                        </q-item>
                                                    </q-list>
                                                </q-menu>
                                            </q-btn>
                                        </q-item-section>
                                    </q-item>
                                </transition-group>
                            </draggable>
                        </q-list>
                    </q-tab-panel>
                </q-tab-panels>
            </q-card>

            <q-dialog v-model="editorOpen" persistent>
                <q-card style="min-width: 80vw">
                    <q-form @submit="saveCurrentCommandObject">
                        <q-card-section>
                            <div class="text-h6">Command</div>
                        </q-card-section>

                        <q-card-section class="q-pt-none">
                            <q-input
                                square
                                outlined
                                v-model="commandObject.title"
                                label="Title"
                                :rules="[
                                    value => value.length > 0 || 'Enter a title'
                                ]"
                            />
                            <q-input
                                square
                                outlined
                                v-model="commandObject.command"
                                label="Command"
                                :rules="[
                                    value =>
                                        value.length > 0 || 'Enter a command'
                                ]"
                            />
                            <q-input
                                square
                                outlined
                                v-model="commandObject.cwd"
                                label="CWD(Current Working Directory)"
                            />
                        </q-card-section>

                        <q-card-actions align="right" class="text-primary">
                            <q-btn label="Done" type="submit" color="primary" glossy />
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
import draggable from 'vuedraggable';
import { remote } from 'electron';

import {
    ScriptObjectContainer,
    CommandObject,
    ScriptObject
} from '../../store/scriptManager/types';
import { writeJSON } from 'fs-extra';
export default Vue.extend({
    components: {
        draggable
    },
    methods: {
        execute(name: string) {
            this.$store.dispatch('scriptManager/executeScript', name);
        },
        async saveCurrentCommandObject() {
            this.editorOpen = false;
            if (!this.scriptId) {
                return;
            }
            const script: ScriptObject = this.$store.getters[
                'scriptManager/getScriptCopyById'
            ](this.scriptId);
            if (this.commandObject && this.commandObject.commandId < 0) {
                script.commandList.push(this.commandObject);
            } else if (this.commandObject) {
                const index = script.commandList.findIndex(
                    command =>
                        this.commandObject.commandId === command.commandId
                );
                script.commandList[index] = this.commandObject;
            }
            await this.$store.dispatch('scriptManager/updateScript', script);
        },
        openCreateCommand() {
            this.commandObject = {
                commandId: -1,
                title: '',
                command: '',
                cwd: ''
            };
            this.editorOpen = true;
        },
        deleteCommand(commandId: number) {
            const script: ScriptObject = this.$store.getters[
                'scriptManager/getScriptCopyById'
            ](this.scriptId);
            script.commandList = script.commandList.filter(
                command => command.commandId !== commandId
            );
            this.$store.dispatch('scriptManager/updateScript', script);
        },
        openEditCommand(commandObject: CommandObject) {
            this.commandObject = JSON.parse(JSON.stringify(commandObject));
            this.editorOpen = true;
        },
        sendCommandLine() {
            this.$store.dispatch('scriptManager/sendProcessInput', {
                id: this.scriptId,
                input: this.commandLine
            });
            this.commandLine = '';
        },
        async exportScript() {
            const file = await remote.dialog.showSaveDialog({
                filters: [
                    {
                        name: 'JSON',
                        extensions: ['json']
                    }
                ],
                title: 'Save Script'
            });
            if (file.canceled) {
                return;
            }
            if (!file.filePath) {
                return;
            }
            const script: ScriptObject = this.$store.getters[
                'scriptManager/getScriptCopyById'
            ](this.scriptId);
            script.id = -1;
            writeJSON(file.filePath, script, {});
        }
    },

    computed: {
        commandList: {
            get() {
                // @ts-ignore
                const script: ScriptObjectContainer = this.$store.getters[
                    'scriptManager/getScriptById'
                    // @ts-ignore
                ](this.scriptId);
                return script.script.commandList;
            },
            set(value: CommandObject[]) {
                // @ts-ignore
                const script: ScriptObject = this.$store.getters[
                    'scriptManager/getScriptCopyById'
                    // @ts-ignore
                ](this.scriptId);
                script.commandList = value;
                // @ts-ignore
                this.$store.commit('scriptManager/updateScript', script);
            }
        },
        scriptContainer() {
            const script: ScriptObjectContainer = this.$store.getters[
                'scriptManager/getScriptById'
            ](this.scriptId);
            return script;
        },
        scriptTitle: {
            get() {
                // @ts-ignore
                const script: ScriptObject = this.$store.getters[
                    'scriptManager/getScriptCopyById'
                    // @ts-ignore
                ](this.scriptId);
                return script.title;
            },
            set(value: string) {
                // @ts-ignore
                const script: ScriptObject = this.$store.getters[
                    'scriptManager/getScriptCopyById'
                    // @ts-ignore
                ](this.scriptId);

                script.title = value;
                this.$store.commit('scriptManager/updateScript', script);
            }
        }
    },

    mounted() {
        const { id } = this.$route.params;
        this.scriptId = parseInt(id);
    },
    created() {},
    updated() {
        const consoleElement = this.$el.querySelector('#Console');
        if (!consoleElement) {
            return;
        }
        consoleElement.scrollTop = consoleElement.scrollHeight;
    },
    data() {
        const data: {
            commandObject: CommandObject;
            scriptId: number;
            editorOpen: boolean;
            tab: string;
            commandLine: string;
        } = {
            scriptId: -1,
            commandObject: {
                commandId: -1,
                title: '',
                command: '',
                cwd: ''
            },
            editorOpen: false,
            tab: 'console',
            commandLine: ''
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
    .q-panel {
        display: flex;
        flex-grow: 1;
        flex-direction: column;
    }
    .panels {
        // height: 64vh;
    }
    #Console {
        border: 1px black solid;
        height: 54vh;
        overflow: auto;
    }
}
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

.flex-column {
    display: flex;
    flex-direction: column;
}
.flex-grow {
    flex-grow: 1;
}
.flex-shrink {
    flex-grow: 0;
}
</style>
