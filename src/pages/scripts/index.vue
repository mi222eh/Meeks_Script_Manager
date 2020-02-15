<template>
    <q-page class="q-pa-md">
        <q-btn to="scripts/create" label="Create new script" glossy="" color="primary"></q-btn>
        <q-card
            class="q-ma-md my-card"
            bordered
            v-for="(scriptContainer, index) in $store.getters[
                'scriptManager/getAllScripts'
            ]"
            :key="`script${index}`"
        >
            <q-card-section>
                <!-- <div class="text-overline text-orange-9">Build Buster75</div> -->
                <div class="text-h5 q-ml-xs">{{ scriptContainer.script.title }}</div>
            </q-card-section>

            <q-card-actions class="q-ml-md">
                <q-btn
                    color="primary"
                    label="Run"
                    :loading="scriptContainer.isRunning"
                    v-on:click="() => runCommand(scriptContainer.script.name)"
                />
                <q-btn
                    flat
                    color="primary"
                    label="View"
                    v-on:click="() => gotoScript(scriptContainer.script.name)"
                />
                <q-btn
                    flat
                    color="red"
                    label="Delete"
                    v-on:click="() => deleteScript(scriptContainer)"
                />
            </q-card-actions>
        </q-card>
    </q-page>
</template>

<script lang="ts">
import Vue from 'vue';
import { ScriptObjectContainer } from 'src/store/scriptManager/types';
export default Vue.extend({
    methods: {
        async runCommand(name: string) {
            await this.$store.dispatch('scriptManager/executeScript', name);
        },
        gotoScript(name:string){
            this.$router.push(`/scripts/view/${name}`);
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
                        script.script.name
                    );
                });
        }
    }
});
</script>

<style></style>
