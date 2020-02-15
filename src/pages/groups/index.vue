<template>
    <q-page class="q-pa-md">
        <q-btn
            to="groups/create"
            label="Create new group"
            glossy=""
            color="primary"
        ></q-btn>
        <q-card
            class="q-ma-md my-card"
            bordered
            v-for="(groupContainer, index) in $store.getters[
                'scriptManager/getAllGroups'
            ]"
            :key="`group${index}`"
        >
            <q-card-section>
                <!-- <div class="text-overline text-orange-9">Build Buster75</div> -->
                <div class="text-h5 q-mt-sm q-mb-xs">
                    {{ groupContainer.group.title }}
                </div>
            </q-card-section>

            <q-card-actions class="flex flex-end">
                <q-btn
                    color="primary"
                    label="Run"
                    :loading="groupContainer.isRunning"
                    v-on:click="() => runGroup(groupContainer.group.name)"
                />
                <q-btn
                    flat
                    color="primary"
                    label="View"
                    v-on:click="() => gotoGroup(groupContainer.group.name)"
                />

                <q-btn class="q-mr-md" flat color="red" label="Delete" v-on:click=" ()=> deleteGroup(groupContainer)"/>
            </q-card-actions>
        </q-card>
    </q-page>
</template>

<script lang="ts">
import Vue from 'vue';
import { ScriptGroupObjectContainer } from '../../store/scriptManager/types';
export default Vue.extend({
    methods: {
        async runGroup(name: string) {
            this.$store.dispatch('scriptManager/executeGroupScript', name);
        },
        gotoGroup(name: string) {
            this.$router.push(`groups/view/${name}`);
        },
        deleteGroup(group: ScriptGroupObjectContainer) {
            this.$q
                .dialog({
                    title: 'Delete',
                    message: `Do you want to delete ${group.group.title}?`,
                    cancel: true,
                    persistent: false
                })
                .onOk(() => {
                    this.$store.dispatch('scriptManager/removeGroup', group.group.name);
                });
        }
    }
});
</script>

<style></style>
