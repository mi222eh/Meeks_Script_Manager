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
                v-model="scriptContainer.script.name"
                disable
                label="Name"
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
                    color="white"
                    text-color="black"
                    label="Run"
                    v-on:click="() => execute(scriptContainer.script.name)"
                />
                <q-btn
                    color="white"
                    text-color="black"
                    label="Edit Script"
                    v-on:click="() => (showScripts = true)"
                />
            </div>

            <div id="Console">
                <div
                    v-for="(log, index) in scriptContainer.log"
                    :key="`log${index}`"
                >
                    {{ log }}
                </div>
            </div>
            <q-dialog v-model="showScripts" persistent>
                <q-card style="min-width: 350px">
                    <q-card-section>
                        <div class="text-h6">Script</div>
                    </q-card-section>

                    <q-card-section class="q-pt-none">
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

import {
    ScriptGroupObjectContainer,
    ScriptObjectContainer,
    ScriptManagerCommitTypes,
    ScriptManagerActionTypes
} from '../../store/scriptManager/types';
export default Vue.extend({
    methods: {
        execute(name: string) {
            this.$store.dispatch('scriptManager/executeScript', name);
        },
        saveScript() {}
    },
    mounted() {
        const { name } = this.$route.params;
        const script: ScriptObjectContainer = this.$store.getters[
            'scriptManager/getScriptByName'
        ](name);
        console.log(script);

        if (!script) {
            return;
        }
        this.scriptContainer = script;
        this.$watch(
            () => {
                if (!this.scriptContainer) {
                    return;
                }
                return this.scriptContainer.log;
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
            scriptContainer: ScriptObjectContainer | null;
        } = {
            scriptContainer: null
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
        height: calc(100vh - 22rem);
        overflow: auto;
    }
}
</style>
