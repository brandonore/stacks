<template>
    <div class="settings mx-3">
        <h3 class="mb-4 secondary--text">Settings</h3>
        <v-divider class="mb-5"></v-divider>
        <!-- profile info -->
        <v-container fluid>
            <v-layout wrap>
            <v-flex xs12 sm6 md3 class="layout1 text-center pa-5 white">
                <v-hover v-slot:default="{ hover }">
                    <v-avatar size="200" class="ml-5 avatar">
                        <img v-if="avatarURL" :src="avatarURL" alt="avatar" class="avatar-image">
                        <span v-else class="secondary--text headline">😛</span>
                        <v-fade-transition>
                            <div
                                v-if="hover"
                                class="d-flex transition-fast-in-fast-out secondary v-card--reveal white--text subtitle-1"
                                style="height: 100%;"
                            >
                                Change 
                                Avatar
                            </div>
                        </v-fade-transition>
                        <v-btn absolute right top fab dark small color="pink" class="mt-5">
                            <v-icon @click="$refs.avatarUpload.click()" dark>fal fa-plus</v-icon>
                        </v-btn>
                    </v-avatar>
                </v-hover>
                <input v-show="false" ref="avatarUpload" @change="uploadFile" type="file" accept="image/*" >
                <v-flex class="text-center mt-5 ml-5">
                    <v-btn small outlined color="error" @click="avatarURL = null">Remove</v-btn>
                </v-flex>
            </v-flex>
            <v-flex xs12 sm6 md9 class="layout2 white pl-5">
                <div class="text-left secondary--text text-uppercase pt-3 title">Profile Settings</div>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea minus nulla ab sint sunt necessitatibus enim, ipsa debitis placeat aspernatur!
            </v-flex>
            </v-layout>
            <!-- other settings -->
            <v-layout wrap class="mt-3">
                <v-flex xs12 sm6>
                    <v-card flat class="mr-3">
                        <div class="text-center secondary--text text-uppercase pt-3 title">Side Menu Color</div>
                        <div class="text-center grey--text subtitle-1 mb-2">Choose color:</div>
                        <v-card-actions class="justify-center">
                            <v-color-picker 
                                v-model="color"
                                flat
                                :hide-mode-switch="hideModeSwitch"
                                :mode="mode" 
                                @input="$emit('custom-color', color)"
                            ></v-color-picker>
                        </v-card-actions>
                        <v-divider></v-divider>
                        <v-card-actions class="justify-center">
                            <v-btn text color="error" @click="$emit('reset-color', '#373B5FFF')">Reset</v-btn>
                            <v-btn text color="success">Apply</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-flex>
                <v-flex xs12 sm6>
                    <v-card flat>
                        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Culpa esse possimus odit cupiditate mollitia! Quis ullam illum maxime modi 
                        esse doloribus neque labore, fugiat non facilis odit quisquam vel quidem.
                    </v-card>
                </v-flex>
            </v-layout>
        </v-container>
    </div>
</template>

<script>
import firebase from 'firebase'

export default {
    data() {
        return {
            color: '#373B5FFF',
            hideInputs: true,
            hideModeSwitch: true,
            mode: 'hexa',
            rules: [
                value => !value || value.size < 2000000 || 'Avatar size should be less than 2 MB!',
            ],
            avatar: null,
            avatarURL: null,
            uploadPercent: null
        }
    },
    methods: {
        resetColor() {
            this.color = '#373B5FFF'
        },
        uploadFile(event) {
            // get file from input
            this.avatar = event.target.files[0]
            const storageRef = firebase.storage().ref()
            const metadata = { contentType: 'image/jpeg' }
            const uploadTask = storageRef.child('images/' + this.avatar.name).put(this.avatar, metadata)
            uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, (snapshot) => {
                let percentage = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
                this.uploadPercent = percentage
                console.log('Upload is ' + this.uploadPercent + '% done')
                switch (snapshot.state) {
                    case firebase.storage.TaskState.PAUSED: // or 'paused'
                        console.log('Upload is paused');
                        break;
                    case firebase.storage.TaskState.RUNNING: // or 'running'
                        console.log('Upload is running');
                        break;
                }
            }, function (error) {
                switch (error.code) {
                    case 'storage/unauthorized':
                    // User doesn't have permission to access the object
                    break;
                    case 'storage/canceled':
                    // User canceled the upload
                    break;
                    case 'storage/unknown':
                    // Unknown error occurred, inspect error.serverResponse
                    break;
                }
            }, () => {
                this.uploadPercent = 100
                uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                    this.avatarURL = downloadURL
                    this.$emit('avatar-url', downloadURL)
                })
            })
        }
    },
    computed: {
        showColor() {
            if (typeof this.color === 'string') return this.color
        },
    }
}
</script>

<style>
    .v-card--reveal {
        align-items: center;
        justify-content: center;
        opacity: .7;
        position: absolute;
        width: 100%;
        border-radius: 50%;
    } 
    .layout1 {
        border: 1px solid blue
    }
    .layout2 {
        border: 1px solid red
    }
    .avatar {
        border: 1px solid rgba(55, 59, 95, 0.3);
    }
</style>
