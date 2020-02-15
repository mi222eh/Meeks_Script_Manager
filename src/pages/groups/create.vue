<template>
    <q-page class="q-pa-md">
        <q-form @submit="createGroup">
            <q-input
                square
                outlined
                v-model="name"
                label="Name (used as id)"
                :rules="[
                    value => value.length > 0 || 'Enter a name',
                    value =>
                        value.split(' ').length <= 1 || 'No spaces in name',
                    value =>
                        !$store.getters['scriptManager/getAllGroups'].some(
                            item => item.group.name === value
                        ) || 'Name already exists'
                ]"
            />
            <q-input
                square
                outlined
                v-model="title"
                label="Title"
                :rules="[value => value.length > 0 || 'Enter a title']"
            />

            <div class="text-h5">Script selection</div>
            <q-splitter
                v-model="splitterModel"
                style="height:250px; border: solid 1px black"
            >
                <template v-slot:before>
                    <div class="q-pa-md">
                        <div class="text-h4 q-mb-md">Attached</div>
                        <q-list bordered separator>
                            <draggable
                                v-model="scripts"
                                group="scriptSelection"
                                style="min-height:20px"
                            >
                                <q-item
                                    clickable
                                    v-ripple
                                    v-for="(script, index) in scripts"
                                    :key="`script-${index}`"
                                >
                                    <q-item-section>{{
                                        script.title
                                    }}</q-item-section>
                                </q-item>
                            </draggable>
                        </q-list>
                    </div>
                </template>

                <template v-slot:after>
                    <div class="q-pa-md">
                        <div class="text-h4 q-mb-md">Available</div>

                        <q-list bordered separator>
                            <draggable
                                v-model="availableScripts"
                                group="scriptSelection"
                                style="min-height:20px"
                            >
                                <q-item
                                    clickable
                                    v-ripple
                                    v-for="(script, index) in availableScripts"
                                    :key="`avaScript-${index}`"
                                >
                                    <q-item-section>{{
                                        script.title
                                    }}</q-item-section>
                                </q-item>
                            </draggable>
                        </q-list>
                    </div>
                </template>
            </q-splitter>
            <div class="q-mt-md">
                <q-btn label="Create" type="submit" color="primary" />
                <q-btn label="Back" type="reset" to="/groups" color="primary" flat />
            </div>
        </q-form>
    </q-page>
</template>

<script lang="ts">
import Vue from 'vue';
import draggable from 'vuedraggable';
import {
    ScriptObject,
    ScriptObjectContainer,
    ScriptGroupObject
} from '../../store/scriptManager/types';
export default Vue.extend({
    components: {
        draggable
    },
    methods: {
        async createGroup() {
            const group:ScriptGroupObject = {
                name: this.name,
                title: this.title,
                scripts: this.scripts.map(script => script.name)
            };
            await this.$store.dispatch('scriptManager/createGroup', group);
            this.$router.push('/groups');
        }
    },
    mounted() {
        const containers: ScriptObjectContainer[] = this.$store.getters[
            'scriptManager/getAllScripts'
        ];
        this.availableScripts = containers.map(item => item.script);
    },
    data() {
        const data: {
            name: string;
            title: string;
            scripts: ScriptObject[];
            availableScripts: ScriptObject[];
            splitterModel: number;
        } = {
            name: '',
            title: '',
            scripts: [],
            availableScripts: [],
            splitterModel: 50
        };

        return data;
    }
});
</script>

<style></style>
