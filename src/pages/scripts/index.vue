<template>
    <q-page class="q-pa-md">
        <q-btn to="scripts/create" label="Create new script" glossy="" color="primary"></q-btn>
        <q-card
            class="q-ma-md my-card"
            bordered
            v-for="({ script }, index) in $store.getters[
                'scriptManager/getAllScripts'
            ]"
            :key="`script${index}`"
        >
            <q-card-section>
                <!-- <div class="text-overline text-orange-9">Build Buster75</div> -->
                <div class="text-h5 q-ml-xs">{{ script.title }}</div>
            </q-card-section>

            <q-card-actions class="q-ml-md">
                <q-btn
                    color="primary"
                    label="Run"
                    v-on:click="() => runCommand(script)"
                />
                <q-btn
                    flat
                    color="primary"
                    label="View"
                    v-on:click="() => gotoScript(script.name)"
                />
            </q-card-actions>
        </q-card>
    </q-page>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
    methods: {
        async runCommand(name: string) {
            try {
                await this.$store.dispatch('scriptManager/executeScript', name);
            } catch (e) {
                console.error(e);
            }
        },
        gotoScript(name:string){
            this.$router.push(`/scripts/view/${name}`);
        }
    }
});
</script>

<style></style>
