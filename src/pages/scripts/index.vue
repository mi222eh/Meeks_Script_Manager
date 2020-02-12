<template>
    <q-page>
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
                <div class="text-h5 q-mt-sm q-mb-xs">{{ script.title }}</div>
                <div class="text-caption text-grey"></div>
                <div class="text-caption text-grey"></div>
            </q-card-section>

            <q-card-actions class="flex flex-end">
                <q-btn
                    flat
                    color="primary"
                    label="Run"
                    v-on:click="() => runCommand(script)"
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
        }
    }
});
</script>

<style></style>
