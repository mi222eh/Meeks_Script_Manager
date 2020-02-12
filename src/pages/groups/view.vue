<template>
    <q-page>
        <q-banner
            inline-actions
            class="text-white bg-red"
            v-if="!groupContainer"
        >
            Could not find the specific group
            <template v-slot:action>
                <q-btn flat color="white" label="Go back" to="/groups" />
            </template>
        </q-banner>
        <div v-else>
            <q-card>
                <q-card-section>
                    <q-input
                        square
                        outlined
                        v-model="groupContainer.group.title"
                        label="Title"
                    />
                     <q-btn color="white" text-color="black" label="Run" v-on:click="() => execute(groupContainer.group.name)" />
                </q-card-section>

                <q-card-section class="q-pt-none">
                    <div
                        v-for="(log, index) in groupContainer.log"
                        :key="`log${index}`"
                    >
                        {{ log }}
                    </div>
                </q-card-section>
            </q-card>
        </div>
    </q-page>
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
    methods:{
        execute(name:string){
            this.$store.dispatch('scriptManager/executeGroupScript', name);
        }
    },
    mounted() {
        const { name } = this.$route.params;
        const group = this.$store.getters['scriptManager/getGroupByName'](name);

        this.groupContainer = group;
    },
    data() {
        return {
            groupContainer: null
        };
    }
});
</script>

<style></style>
