<template>
    <v-app>
        <v-navigation-drawer
            v-model="drawer"
            app
            color="secondary"
            width="300"
        >
        <v-list dense>
            <v-layout column align-center>
                <v-flex class="mt-5 text-center">
                    <v-avatar size="100">
                        <img src="../../public/shiina-av.png" alt="">
                    </v-avatar>
                    <div class="white--text my-0 mt-4 subtitle-1 font-weight-light">
                        Logged in as:
                    </div>
                    <div class="white--text font-weight-bold title">
                        y2ktheory
                    </div>
                </v-flex>
            </v-layout>
            <v-divider class="grey my-5"></v-divider>
            <v-flex class="ml-2 mb-3">
                <label class="white--text ml-2 body-2 text-uppercase">Menu</label>
            </v-flex>
            <v-list-item v-for="link in links" :key="link.text" :to="link.route" class="side-link">
                <v-list-item-action>
                    <v-icon color="white">{{ link.icon }}</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                    <v-list-item-title class="white--text">{{ link.text }}</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-divider class="grey my-5"></v-divider>
                <v-flex class="ml-2 mb-3">
                    <label class="white--text ml-2 body-2 text-uppercase">Control</label>
                </v-flex>
                <v-layout row wrap xs12 class="mt-5">
                    <v-flex class="text-center">
                        <AddShopData class="mr-5"/>
                        <AddTrim />
                    </v-flex>
                </v-layout>
                <v-layout row wrap xs12 class="mt-5">
                    <v-flex class="text-center">
                        <v-btn text color="white" class="px-3 mt-3">
                            <span>Sign Out</span>
                            <v-icon right>far fa-sign-out-alt</v-icon>
                        </v-btn>
                    </v-flex>
                </v-layout>
            </v-list>
        </v-navigation-drawer>

        <v-app-bar
            app
            light
            text
            elevation="0"
            class="grey lighten-4 app-bar"
        >
            <v-app-bar-nav-icon color="grey" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
            <v-divider
                class="mx-4"
                vertical
                inset
            ></v-divider>
            <v-toolbar-title>
                <span class="grey--text">MARSH</span>
                <span class="success--text">MALLOW</span>
            </v-toolbar-title>
        </v-app-bar>
        <v-content class="grey lighten-4">
            <v-container fluid>
                <router-view></router-view>
            </v-container>
        </v-content>
    </v-app>
</template>

<script>
import AddTrim from './AddTrim'
import AddShopData from './AddShopData'

export default {
    name: 'navbar',
    components: { 
        AddShopData, 
        AddTrim
    },
    props: {
        source: String,
    },
    data: () => ({
        links: [
            { icon: 'fas fa-home', text: 'Dashboard', route: '/' },
            { icon: 'fas fa-sack', text: 'Trim', route: '/trim' },
            { icon: 'fas fa-burn', text: 'Extraction', route: '/extract' },
            { icon: 'fas fa-box', text: 'Packaging', route: '/package' },
            { icon: 'fas fa-calendar-day', text: 'Calendar', route: '/calendar' },
            { icon: 'fas fa-sliders-h', text: 'Settings', route: '/settings'}
        ],
        drawer: null,
        snackbar: false
    }),
}
</script>

<style>
    .side-link:hover {
        background: #3cd1c2;
    }
    .app-bar {
        border-bottom: 2px solid black;
    }
</style>
