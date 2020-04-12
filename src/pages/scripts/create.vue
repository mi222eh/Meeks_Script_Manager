<template>
    <q-page class="q-pa-md">
        <q-form @submit="createScript">
            <q-input
                square
                outlined
                v-model="script.title"
                label="Title"
                :rules="[
                    value => value.length > 0 || 'Enter a title']"
            />
            <div class="q-mt-md">
                <q-btn label="Create" type="submit" color="primary" glossy />
                <q-btn label="Back" to="/scripts" color="primary" flat class="q-ml-sm" />
            </div>
        </q-form>
    </q-page>
</template>

<script lang="ts">
import Vue from 'vue';
import {
    ScriptObject,
    ScriptObjectContainer
} from 'src/store/scriptManager/types';

export default Vue.extend({
    methods: {
        async createScript() {
            const script: ScriptObject = {
                id: this.script.id,
                title: this.script.title,
                commandList: this.script.commandList
            };
            const scriptContainer: ScriptObjectContainer = await this.$store.dispatch(
                'scriptManager/createScript',
                script
            );
            this.$router.push('/scripts/view/' + scriptContainer.script.id);
        }
    },
    data() {
        const data: {
            script: ScriptObject;
        } = {
            script: {
                id: -1,
                title: '',
                commandList: []
            }
        };
        return data;
    }
});
</script>

<style></style>
