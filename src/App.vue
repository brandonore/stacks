<template>
    <v-app>
        <Navbar />
    </v-app>
</template>

<script>
import Navbar from '@/components/Navbar';

export default {
    name: "App",
    components: {
        Navbar
    },
    data() {
        return {
         //
        };
    }
};
</script>

<style>
    .avatar-image {
        object-fit: cover;
    }
</style>

