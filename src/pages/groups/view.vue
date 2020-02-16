<template>
    <q-page class="group-page q-pa-md">
        <q-banner
            inline-actions
            class="text-white bg-red"
            v-if="!groupContainer"
        >
            Could not find the specific group
            <template v-slot:action>
                <q-btn flat color="white" label="Go back" to="/groups" />
            </template>
        </q-banner>
        <div class="" v-else>
            <q-form>
                <q-input
                    square
                    outlined
                    v-model="groupContainer.group.title"
                    disable
                    label="Title"
                />
            </q-form>

            <div class="buttons">
                <q-btn
                    color="primary"
                    label="Run"
                    :loading="groupContainer.isRunning"
                    class="q-mr-md"
                    v-on:click="() => execute(groupContainer.group.name)"
                />
                <q-btn
                    color="secondary"
                    label="Edit Group"
                    class="q-mr-md"
                    v-on:click="openEditor"
                />
                <q-btn
                    class="q-mr-md"
                    flat
                    color="primary"
                    label="back to list"
                    to="/groups"
                />
            </div>

            <div id="Console">
                <div
                    v-for="(log, index) in groupContainer.log"
                    :key="`log${index}`"
                >
                    {{ log }}
                </div>
            </div>
            <q-dialog v-model="showEditor" persistent v-if="groupToEdit">
                <q-card style="min-width: 80vw">
                    <q-form @submit="saveGroup">
                        <q-input
                            square
                            outlined
                            disable
                            v-model="groupToEdit.name"
                            label="Name (used as id)"
                        />
                        <q-input
                            square
                            outlined
                            v-model="groupToEdit.title"
                            label="Title"
                            :rules="[
                                value => value.length > 0 || 'Enter a title'
                            ]"
                        />

                        <div class="text-h5">Script selection</div>
                        <q-splitter
                            v-model="splitterModel"
                            style="height:250px; border: solid 1px black"
                        >
                            <template v-slot:before>
                                <div class="q-pa-md">
                                    <div class="text-h4 q-mb-md">Attached</div>
                                    <q-list bordered separator>
                                        <draggable
                                            v-model="scriptList"
                                            group="scriptSelection"
                                            style="min-height:20px"
                                        >
                                            <q-item
                                                clickable
                                                v-ripple
                                                v-for="(script,
                                                index) in scriptList"
                                                :key="`script-${index}`"
                                            >
                                                <q-item-section avatar top>
                                                    <q-avatar
                                                        icon="remove"
                                                        color="red"
                                                        text-color="white"
                                                        v-on:click="
                                                            () =>
                                                                removeScript(
                                                                    index
                                                                )
                                                        "
                                                    />
                                                </q-item-section>
                                                <q-item-section>{{
                                                    script.title
                                                }}</q-item-section>
                                            </q-item>
                                        </draggable>
                                    </q-list>
                                </div>
                            </template>

                            <template v-slot:after>
                                <div class="q-pa-md">
                                    <div class="text-h4 q-mb-md">Available</div>

                                    <q-list bordered separator>
                                        <q-item
                                            clickable
                                            v-ripple
                                            v-for="(script,
                                            index) in availableScriptList"
                                            :key="`avaScript-${index}`"
                                        >
                                            <q-item-section avatar top>
                                                <q-avatar
                                                    icon="add"
                                                    color="green"
                                                    text-color="white"
                                                    v-on:click="
                                                        () => addScript(script)
                                                    "
                                                />
                                            </q-item-section>
                                            <q-item-section>{{
                                                script.title
                                            }}</q-item-section>
                                        </q-item>
                                    </q-list>
                                </div>
                            </template>
                        </q-splitter>
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
import draggable from 'vuedraggable';

import {
    ScriptGroupObjectContainer,
    ScriptObjectContainer,
    ScriptManagerCommitTypes,
    ScriptManagerActionTypes,
    ScriptGroupObject,
    ScriptObject
} from '../../store/scriptManager/types';
export default Vue.extend({
    components: {
        draggable
    },
    methods: {
        execute(name: string) {
            this.$store.dispatch('scriptManager/executeGroupScript', name);
        },
        getScriptList() {
            if (!this.groupContainer) {
                return;
            }
            const scriptNameList = this.groupContainer.group.scripts;
            this.scriptList = scriptNameList.map(scriptName => {
                return this.$store.getters['scriptManager/getScriptByName'](
                    scriptName
                ).script;
            });
        },
        getAvailableScripts() {
            const allScripts: ScriptObjectContainer[] = this.$store.getters[
                'scriptManager/getAllScripts'
            ];

            this.availableScriptList = allScripts.map(
                avaScript => avaScript.script
            );
        },
        openEditor() {
            if (!this.groupContainer) {
                return;
            }
            this.getScriptList();
            this.getAvailableScripts();
            this.groupToEdit = this.$store.getters[
                'scriptManager/getGroupCopyByName'
            ](this.groupContainer.group.name);
            this.showEditor = true;
        },
        async saveGroup() {
            if (!this.groupToEdit) {
                return;
            }
            await this.$store.dispatch(
                'scriptManager/' + ScriptManagerActionTypes.UPDATE_GROUP,
                {
                    name: this.groupToEdit.name,
                    scripts: this.scriptList.map(script => script.name),
                    title: this.groupToEdit.title
                }
            );
            this.showEditor = false;
        },
        addScript(script: ScriptObject) {
            this.scriptList.push(script);
        },
        removeScript(index: number) {
            this.scriptList.splice(index, 1);
        }
    },
    mounted() {
        const { name } = this.$route.params;
        const group: ScriptGroupObjectContainer = this.$store.getters[
            'scriptManager/getGroupByName'
        ](name);
        if (!group) {
            return;
        }
        this.groupContainer = group;
    },
    updated() {
        const console = this.$el.querySelector('#Console');
        if (!console) {
            return;
        }
        console.scrollTop = console.scrollHeight;
    },
    data() {
        const data: {
            groupContainer: ScriptGroupObjectContainer | null;
            groupToEdit: ScriptGroupObject | null;
            scriptList: ScriptObject[];
            availableScriptList: ScriptObject[];
            showEditor: boolean;
            splitterModel: number;
        } = {
            groupContainer: null,
            scriptList: [],
            groupToEdit: null,
            availableScriptList: [],
            showEditor: false,
            splitterModel: 50
        };
        return data;
    }
});
</script>

<style lang="scss">
.group-page {
    display: flex;
    flex-direction: column;
    height: calc(100% - 222px);
    #Console {
        border: 1px black solid;
        height: calc(100vh - 15rem);
        overflow: auto;
    }
}
</style>
