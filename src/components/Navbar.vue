<template>
    <v-app>
        <v-navigation-drawer
            v-model="drawer"
            app
            :color=navBgColor
            width="300"
            v-if="user"
        >
            <v-list dense>
                <v-container fluid grid-list-xl>
                    <v-layout column align-center>
                        <v-flex class="mt-5 text-center">
                            <v-avatar size="100">
                                <img src="../../public/stacksnotext.png" alt="logo" class="avatar-image">
                            </v-avatar>
                            <div class="white--text my-0 mt-4 subtitle-1 font-weight-light">
                                Logged in as:
                            </div>
                            <div class="white--text font-weight-500 title">
                                {{ user.email }}
                            </div>
                        </v-flex>
                    </v-layout>
                    <v-divider class="grey my-5"></v-divider>
                    <v-flex class="ml-2 mb-3">
                        <label class="white--text ml-2 body-2 text-uppercase">Menu</label>
                    </v-flex>
                    <v-list-item v-for="link in links" :key="link.text" :to="link.route" class="side-link">
                        <v-list-item-action>
                            <v-icon small color="white">{{ link.icon }}</v-icon>
                        </v-list-item-action>
                        <v-list-item-content>
                            <v-list-item-title class="white--text">{{ link.text }}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <!-- control items -->
                    <v-divider class="grey my-5"></v-divider>
                        <v-flex class="ml-2 mb-3">
                            <label class="white--text ml-2 body-2 text-uppercase">Control</label>
                        </v-flex>
                        <v-list-item class="side-link comp-link">
                            <v-list-item-action>
                                <v-icon small color="white">fas fa-store-alt</v-icon>
                            </v-list-item-action>
                            <v-list-item-content>
                                <v-list-item-title><AddShopData /></v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item class="side-link comp-link">
                            <v-list-item-action>
                                <v-icon small color="white">fas fa-arrow-alt-right</v-icon>
                            </v-list-item-action>
                            <v-list-item-content>
                                <v-list-item-title><AddTrim /></v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item class="side-link comp-link">
                            <v-list-item-action>
                                <v-icon small color="white">fas fa-tags</v-icon>
                            </v-list-item-action>
                            <v-list-item-content>
                                <v-list-item-title><AddExtract /></v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item class="side-link comp-link">
                            <v-list-item-action>
                                <v-icon small color="white">fas fa-circle-notch</v-icon>
                            </v-list-item-action>
                            <v-list-item-content>
                                <v-list-item-title><AddPackaging /></v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item class="sign-out-link comp-link">
                            <v-list-item-action>
                                <v-icon small color="error">fas fa-sign-out-alt</v-icon>
                            </v-list-item-action>
                            <v-list-item-content>
                                <v-list-item-title><v-btn :ripple="false" @click="signOut" text class="error--text text-capitalize comp-btn">Sign Out</v-btn></v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                </v-container>
            </v-list>
        </v-navigation-drawer>

        <v-app-bar
            app
            light
            flat
            class="app-bar"
        >
            <v-app-bar-nav-icon color="grey" class="menu-btn" @click.stop="drawer = !drawer" v-if="user"></v-app-bar-nav-icon>
            <v-divider
                class="mx-4"
                vertical
                inset
                v-if="user"
            ></v-divider>
            <router-link to="/"><img src="../../public/stackslogosmall.png" alt="logo" height="40" /></router-link>
            <v-spacer></v-spacer>
            <div class="text-center">
                <v-menu transition="slide-x-transition" offset-y v-if="user">
                <template v-slot:activator="{ on }">
                    <v-btn
                        text
                        color="primary"
                        dark
                        v-on="on"
                    >
                        Menu
                    </v-btn>
                </template>
                <v-list>
                    <v-list-item
                        v-for="link in links"
                        :key="link.text"
                        :to="link.route"
                    >
                    <v-list-item-title>{{ link.text }}</v-list-item-title>
                    </v-list-item>
                </v-list>
                </v-menu>
            </div>
        </v-app-bar>
        <v-content class="grey lighten-4">
            <v-container fluid>
                <router-view v-on:reset-color="resetNavDrawerColor($event)" v-on:custom-color="changeNavDrawerColor($event)"></router-view>
            </v-container>
        </v-content>
        <v-snackbar
            v-model="snackbar"
            color="success"
            :timeout="timeout"
            bottom
            text
        >
        {{ snackbarText(snackbarVal) }}
            <v-btn
                color="white"
                text
                @click="snackbar = false"
            >
                Close
            </v-btn>
        </v-snackbar>
    </v-app>
</template>

<script>
import { mapState } from 'vuex'
import AddShopData from './AddShopData'
import AddTrim from './AddTrim'
import AddExtract from './AddExtract'
import AddPackaging from './AddPackaging'


export default {
    name: 'navbar',
    components: { 
        AddShopData, 
        AddTrim,
        AddExtract,
        AddPackaging
    },
    props: {
        source: String,
    },
    data: () => ({
        links: [
            { icon: 'fas fa-home', text: 'Dashboard', route: '/' },
            { icon: 'fas fa-store', text: 'Shops', route: '/shops' },
            { icon: 'fas fa-sack', text: 'Trim', route: '/trim' },
            { icon: 'fas fa-burn', text: 'Extraction', route: '/extract' },
            { icon: 'fas fa-box', text: 'Packaging', route: '/packaging' },
            { icon: 'fas fa-calendar-day', text: 'Calendar', route: '/calendar' },
            { icon: 'fas fa-sliders-h', text: 'Settings', route: '/settings'}
        ],
        drawer: null,
        snackbar: false,
        timeout: 4000,
        snackbarVal: '',
        navBgColor: '#373B5FFF',
    }),
    methods: {
        resetNavDrawerColor(color) {
            this.navBgColor = color
        },
        changeNavDrawerColor(color) {
            this.navBgColor = color
        },
        setAvatar(url) {
            this.avatarURL = url
        },
        snackbarText(val) {
            switch(val) {
                case 'addItem': return 'Item added successfully'
                case 'editItem': return 'Edit successful'
                default: return ''
            }
            this.snackbarVal = ''
        },
        signOut() {
            this.$auth.logout().then(() => {
                console.log('signed out successfully')
                this.drawer = null
                this.$router.replace('/login')
            })
            
        }
    },
    computed: {
        ...mapState(['user'])
    },
    mounted() {
        this.$root.$on('set-snackbar', (val) => {
            this.snackbarVal = val
            this.snackbar = true
        })
    }
}
</script>

<style scoped>
    .side-link:hover {
        background: rgba(60, 209, 194, 0.2);
    }
    .sign-out-link:hover {
        background: rgba(248, 62, 112, 0.2);
    }
    .comp-link {
        max-height: 40px;
    }
    .comp-btn {
        letter-spacing: normal !important;
        font-size: 0.8125rem
    }
    .comp-btn.v-btn:not(.v-btn--round).v-size--default {
        padding: 0 65% 0 0;
    }
    .v-btn::before {
        background-color: transparent;
    }
</style>
