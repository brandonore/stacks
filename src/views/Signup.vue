<template>
    <div class="signup mx-3">
        <v-layout row justify-center>
            <v-card class="pa-5" flat width="650">
                <h3 class="mb-4 secondary--text text-center">Sign Up</h3>
                <v-form
                    ref="form"
                    v-model="valid"
                    :lazy-validation="lazy"
                    class="text-center"
                >
                    <v-text-field
                        v-model="email"
                        label="Email"
                        required
                    ></v-text-field>
                    <v-text-field
                        v-model="password"
                        label="password"
                        required
                        type="password"
                    ></v-text-field>
                    <v-flex xs12 class="my-5">
                            <v-btn
                                color="success white--text"
                                class="mr-4"
                                @click="signUp"
                                depressed
                                width="100%"
                            >
                                Sign Up
                            </v-btn>
                    </v-flex>
                    <v-divider></v-divider>
                    <v-layout row class="mt-5 mb-2 px-5" justify-center>
                        <v-flex xs12>
                            Already have an account? <router-link to="/login">Login</router-link>
                        </v-flex>
                    </v-layout>
                </v-form>
            </v-card>
        </v-layout>
    </div>
</template>


<script>
import firebase from 'firebase'

export default {
    data() {
        return {
            valid: false,
            email: null,
            password: null
        }
    },
    methods: {
        signUp() {
            firebase.auth().createUserWithEmailAndPassword(this.email, this.password).then((user) => {
                console.log('account has been created')
                this.$router.replace('/dashboard')
            }, (err) => {
                console.log(err)
            })
        }
    }
}
</script>