<template>
    <q-page class="q-pa-md">

    </q-page>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
    name: 'Index',
    methods: {
        async runCommand(name: string) {
            await this.$store.dispatch(
                'scriptManager/executeScript',
                name
            );
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
