<template>
    <q-page>
        <q-card
            class="q-ma-md my-card"
            bordered
            v-for="({ group }, index) in $store.getters[
                'scriptManager/getAllGroups'
            ]"
            :key="`group${index}`"
        >
            <q-card-section>
                <!-- <div class="text-overline text-orange-9">Build Buster75</div> -->
                <div class="text-h5 q-mt-sm q-mb-xs">{{ group.title }}</div>
                <div class="text-caption text-grey"></div>
                <div class="text-caption text-grey"></div>
            </q-card-section>

            <q-card-actions class="flex flex-end">
                <q-btn
                    flat
                    color="primary"
                    label="Run"
                    v-on:click="() => runGroup(group.scripts)"
                />
            </q-card-actions>
        </q-card>
    </q-page>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
    methods: {
        async runGroup(scriptNameList: string[]) {
            for (const scriptName of scriptNameList) {
                try {
                    await this.$store.dispatch(
                        'scriptManager/executeScript',
                        scriptName
                    );
                } catch (e) {
                    console.error(e);
                }
            }
        }
    }
});
</script>

<style></style>
