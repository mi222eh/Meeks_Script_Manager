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
            <q-input
                square
                outlined
                v-model="groupContainer.group.title"
                @change="saveGroupScripts"
                label="Title"
            />

            <div class="buttons">
                <q-btn
                    color="white"
                    text-color="black"
                    label="Run"
                    v-on:click="() => execute(groupContainer.group.name)"
                />
                <q-btn
                    color="white"
                    text-color="black"
                    label="View Scripts"
                    v-on:click="() => (showScripts = true)"
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
            <q-dialog v-model="showScripts" persistent>
                <q-card style="min-width: 350px">
                    <q-card-section>
                        <div class="text-h6">Scripts</div>
                    </q-card-section>

                    <q-card-section class="q-pt-none">
                        <q-list bordered separator>
                            <draggable
                                v-model="scriptContainerList"
                                @end="saveGroupScripts"
                            >
                                <q-item
                                    v-for="(script,
                                    index) in scriptContainerList"
                                    :key="`script${index}`"
                                >
                                    {{ script.script.title }}
                                </q-item>
                            </draggable>
                        </q-list>
                    </q-card-section>

                    <q-card-actions align="right" class="text-primary">
                        <q-btn flat label="Close" v-close-popup />
                    </q-card-actions>
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
    ScriptManagerActionTypes
} from '../../store/scriptManager/types';
export default Vue.extend({
    components: {
        draggable
    },
    methods: {
        execute(name: string) {
            this.$store.dispatch('scriptManager/executeGroupScript', name);
        },
        getScriptContainerDataList(scriptNameList: string[]) {
            this.scriptContainerList = scriptNameList.map(scriptName => {
                return this.$store.getters['scriptManager/getScriptByName'](
                    scriptName
                );
            });
        },
        saveGroupScripts() {
            if (!this.groupContainer) {
                return;
            }
            this.$store.dispatch('scriptManager/' + ScriptManagerActionTypes.UPDATE_GROUP, {
                name: this.groupContainer.group.name,
                scripts: this.scriptContainerList.map(scr => scr.script.name),
                title: this.groupContainer.group.title
            });
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
        this.getScriptContainerDataList(this.groupContainer.group.scripts);
        this.$watch(
            () => {
                if (!this.groupContainer) {
                    return;
                }
                return this.groupContainer.log;
            },
            () => {
                const console = this.$el.querySelector('#Console');
                if (!console) {
                    return;
                }
                console.scrollTop = console.scrollHeight;
            }
        );
    },
    data() {
        const data: {
            groupContainer: ScriptGroupObjectContainer | null;
            scriptContainerList: ScriptObjectContainer[];
            showScripts: boolean;
        } = {
            groupContainer: null,
            scriptContainerList: [],
            showScripts: false
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
        height: calc(100vh - 11rem);
        overflow: auto;
    }
}
</style>
