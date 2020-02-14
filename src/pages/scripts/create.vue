<template>
    <q-page class="q-pa-md">
        <q-form @submit="createScript">
            <q-input
                square
                outlined
                v-model="script.name"
                label="Name (used as id)"
                :rules="[
                    value => value.length > 0 || 'Enter a name',
                    value => value.split(' ').length <= 1 || 'No spaces in name',
                    value =>
                        !$store.getters['scriptManager/getAllScripts'].some(
                            script => script.script.name === value
                        ) || 'Name already exists'
                ]"
            />
            <q-input square outlined v-model="script.title" label="Title" :rules="[
                    value => value.length > 0 || 'Enter a title']"/>
            <q-input square outlined v-model="script.command" label="Command" :rules="[
                    value => value.length > 0 || 'Enter a command']"/>
            <q-input
                square
                outlined
                v-model="script.cwd"
                label="CWD(Current Working Directory)"
            />
            <div class="q-mt-md">
                <q-btn label="Create" type="submit" color="primary" glossy/>
                <q-btn label="Back" to="/scripts" color="primary" flat class="q-ml-sm" />
            </div>
        </q-form>
    </q-page>
</template>

<script lang="ts">
import Vue from 'vue';
import { ScriptObject } from 'src/store/scriptManager/types';

export default Vue.extend({
    methods: {
        async createScript() {
            const script: ScriptObject = {
                name: this.script.name,
                title: this.script.title,
                command: this.script.command,
                cwd: this.script.cwd
            };
            await this.$store.dispatch('scriptManager/createScript', script);
            this.$router.push('/scripts')
        }
    },
    data() {
        const data: {
            script: ScriptObject;
        } = {
            script: {
                name: '',
                title: '',
                command: '',
                cwd: ''
            }
        };
        return data;
    }
});
</script>

<style></style>
