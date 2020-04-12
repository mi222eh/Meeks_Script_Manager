<template>
    <q-layout view="lHh Lpr lFf">
        <q-header elevated>
            <q-toolbar>
                <q-btn
                    flat
                    dense
                    round
                    @click="leftDrawerOpen = !leftDrawerOpen"
                    icon="menu"
                    aria-label="Menu"
                />
                <q-toolbar-title>Script Manager</q-toolbar-title>
                <!-- <q-slider v-model="standard" :min="0" :max="50"/> -->
                <!-- <div>1.0.0</div> -->
            </q-toolbar>
        </q-header>

        <q-drawer v-model="leftDrawerOpen" show-if-above bordered content-class="bg-grey-1">
            <q-list class="q-mt-md">
                <q-item-label header class="text-grey-8">Pages</q-item-label>
                <q-item>
                    <q-btn to="/scripts" label="Script List" />
                </q-item>
            </q-list>
        </q-drawer>

        <q-page-container>
            <router-view />
        </q-page-container>
    </q-layout>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
    name: 'MainLayout',

    data() {
        return {
            leftDrawerOpen: false
        };
    }
});
</script>
<style lang="scss" scoped>
main {
    display: flex;
    flex-direction: column;
}
</style>