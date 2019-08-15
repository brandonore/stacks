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
                                <img v-if="avatarURL" :src="avatarURL" alt="avatar" class="avatar-image">
                                <span v-else class="white--text">No avatar</span>
                            </v-avatar>
                            <div class="white--text my-0 mt-4 subtitle-1 font-weight-light">
                                Logged in as:
                            </div>
                            <div class="white--text font-weight-bold title">
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
                    <v-divider class="grey my-5"></v-divider>
                        <v-flex class="ml-2 mb-3">
                            <label class="white--text ml-2 body-2 text-uppercase">Control</label>
                        </v-flex>
                        <v-layout justify-center class="mt-5">
                            <v-flex d-flex xs12 sm6 lg5>
                                <AddShopData />
                            </v-flex>
                            <v-flex d-flex xs12 sm6 lg5>
                                <AddTrim />
                            </v-flex>
                        </v-layout>
                        <v-layout justify-center class="mt-5">
                            <v-flex d-flex xs12 sm6 lg5>
                                <AddExtract />
                            </v-flex>
                            <v-flex d-flex xs12 sm6 lg5>
                                
                            </v-flex>
                        </v-layout>
                        <v-layout row wrap xs12 class="mt-5">
                            <v-flex class="text-center">
                                <v-btn text color="white" class="px-3" @click="signOut">
                                    <span>Sign Out</span>
                                    <v-icon right>far fa-sign-out-alt</v-icon>
                                </v-btn>
                            </v-flex>
                        </v-layout>
                </v-container>
            </v-list>
        </v-navigation-drawer>

        <v-app-bar
            app
            light
            flat
            class="app-bar"
        >
            <v-app-bar-nav-icon color="grey" @click.stop="drawer = !drawer" v-if="user"></v-app-bar-nav-icon>
            <v-divider
                class="mx-4"
                vertical
                inset
                v-if="user"
            ></v-divider>
            <v-toolbar-title>
                <span class="success--text">STACKS</span>
                <!-- <span class="success--text">CKS</span> -->
            </v-toolbar-title>
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
import firebase from 'firebase'
import AddShopData from './AddShopData'
import AddTrim from './AddTrim'
import AddExtract from './AddExtract'


export default {
    name: 'navbar',
    components: { 
        AddShopData, 
        AddTrim,
        AddExtract
    },
    props: {
        source: String,
    },
    data: () => ({
        links: [
            { icon: 'fas fa-home', text: 'Dashboard', route: '/' },
            { icon: 'fas fa-sack', text: 'Trim', route: '/trim' },
            { icon: 'fas fa-burn', text: 'Extraction', route: '/extract' },
            { icon: 'fas fa-box', text: 'Packaging', route: '/packaging' },
            { icon: 'fas fa-calendar-day', text: 'Calendar', route: '/calendar' },
            { icon: 'fas fa-sliders-h', text: 'Settings', route: '/settings'}
        ],
        user: null,
        drawer: null,
        snackbar: false,
        timeout: 4000,
        snackbarVal: '',
        navBgColor: '#373B5FFF',
        avatarURL: null
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
            firebase.auth().signOut().then(() => {
                console.log('signed out successfully')
                this.drawer = null
                this.$router.replace('/login')
            })
            
        }
    },
    created() {
        firebase.auth().onAuthStateChanged(user => {
            if(user) {
                this.user = user
                console.log(user)
            } else {
                this.user = null
            }
        })
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
        background: #3cd1c2;
    }
</style>
