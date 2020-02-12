<template>
    <q-page>
        {{group.title}}
    </q-page>
</template>

<script>
export default {
    mounted(){
        const { name } = this.$route.params;
        this.group = this.$store.getters.getGroupByName(name)
    },
    data(){
        return{
            group: null
        }
    }
};
</script>

<style></style>
