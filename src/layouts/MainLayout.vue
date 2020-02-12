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
                <q-toolbar-title>
                    Script Manager
                </q-toolbar-title>

                <div>App version {{ $q.version }}</div>
            </q-toolbar>
        </q-header>

        <q-drawer
            v-model="leftDrawerOpen"
            show-if-above
            bordered
            content-class="bg-grey-1"
        >
            <q-list>
                <q-item-label header class="text-grey-8">
                    Pages
                </q-item-label>
                <q-btn to="/scripts" label="Script List"/>
                <q-btn to="/groups" label="Script Group List"/>
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
            leftDrawerOpen: false,
            essentialLinks: [
                {
                    title: 'Docs',
                    caption: 'quasar.dev',
                    icon: 'school',
                    link: 'https://quasar.dev'
                },
                {
                    title: 'Github',
                    caption: 'github.com/quasarframework',
                    icon: 'code',
                    link: 'https://github.com/quasarframework'
                },
                {
                    title: 'Discord Chat Channel',
                    caption: 'chat.quasar.dev',
                    icon: 'chat',
                    link: 'https://chat.quasar.dev'
                },
                {
                    title: 'Forum',
                    caption: 'forum.quasar.dev',
                    icon: 'record_voice_over',
                    link: 'https://forum.quasar.dev'
                },
                {
                    title: 'Twitter',
                    caption: '@quasarframework',
                    icon: 'rss_feed',
                    link: 'https://twitter.quasar.dev'
                },
                {
                    title: 'Facebook',
                    caption: '@QuasarFramework',
                    icon: 'public',
                    link: 'https://facebook.quasar.dev'
                }
            ]
        };
    }
});
</script>
