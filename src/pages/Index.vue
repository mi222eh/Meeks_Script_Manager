<template>
    <q-page class="q-pa-md">

    </q-page>
</template>

<script lang="ts">
import Vue from 'vue';
import {
    ScriptObject, ScriptGroupObject
} from '../store/scriptManager/types';

export default Vue.extend({
    name: 'Index',
    methods: {
        async runCommand(name: string) {
            try {
                await this.$store.dispatch(
                    'scriptManager/executeScript',
                    name
                );
            } catch (e) {
                console.error(e);
            }
        },
        async runGroup(scriptNameList:string[]){
            for (const scriptName of scriptNameList) {
                await this.runCommand(scriptName)
            }
        }
    },
    data() {
        return {};
    }
});
</script>
