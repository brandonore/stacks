<template>
    <nav>
        <!-- top toolbar -->
        <v-toolbar flat app>
            <v-toolbar-side-icon class="grey--text" @click="drawer = !drawer"></v-toolbar-side-icon>
            <v-toolbar-title class="text-uppercase success--text">
                <span class="font-weight-light grey--text">Marsh</span>
                <span>Mallow</span>
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <!-- top dropdown menu -->
            <v-menu offset-y transition="slide-x-transition">
                <v-btn flat slot="activator" color="grey" class="px-3"> 
                    <v-icon left>far fa-angle-down</v-icon>
                    <span>menu</span>    
                </v-btn>
                <v-list>
                    <v-list-tile v-for="link in links" :key="link.text" router :to="link.route">
                        <v-list-tile-title>{{ link.text }}</v-list-tile-title>
                    </v-list-tile>
                </v-list>
            </v-menu>
        </v-toolbar>
        <!-- side menu -->
        <v-navigation-drawer v-model="drawer" app class="secondary">
            <v-layout column align-center>
                <v-flex class="mt-5 text-xs-center">
                    <v-avatar size="100">
                        <img src="/shiina-av.png" alt="">
                    </v-avatar>
                    <p class="white--text my-0 mt-3 title font-weight-light">
                        Logged in as:
                    </p>
                    <p class="white--text mt-2 font-weight-bold subheading">
                        y2ktheory
                    </p>
                </v-flex>
            </v-layout>
            <v-divider class="grey mt-3 mb-4"></v-divider>
            <v-flex ml-2>
                <label class="white--text ml-2 font-weight-bold text-uppercase">Menu</label>
            </v-flex>
            <v-list>
                <v-list-tile v-for="link in links" :key="link.text" router :to="link.route" color="purple" :class="link.route === $route.link ? 'highlighted' : ''" class="side-link">
                    <v-list-tile-action>
                        <v-icon class="white--text">{{ link.icon }}</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title class="white--text">{{ link.text }}</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
            <v-divider class="grey my-4"></v-divider>
            <v-flex class="text-xs-center">
                <AddTrim /><br>
                <v-btn flat color="white" class="px-3 mt-3">
                    <span>Sign Out</span>
                    <v-icon right>far fa-sign-out-alt</v-icon>
                </v-btn>
            </v-flex>
        </v-navigation-drawer>
    </nav>
</template>

<script>
import AddTrim from './AddTrim'

export default {
    name: 'navbar',
    components: {
        AddTrim
    },
    data() {
        return {
            links: [
                { icon: 'fas fa-home', text: 'Dashboard', route: '/' },
                { icon: 'fas fa-sack', text: 'Trim', route: '/trim' },
                { icon: 'fas fa-burn', text: 'Extraction', route: '/extract' },
                { icon: 'fas fa-box', text: 'Packaging', route: '/package' },
                { icon: 'fas fa-sliders-h', text: 'Settings', route: '/settings'}
            ],
            drawer: true,
            snackbar: false
        }
    }
};
</script>

<style>
    .side-link:hover {
        background: #3cd1c2;
    }
</style>