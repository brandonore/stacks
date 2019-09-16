<template>
    <div class="login">
        <v-container fluid class="login-container" fill-height>
            <v-layout class="login-row">
                <v-flex xs12 lg4 class="form-container">
                    <v-card class="pa-10" width="100%" flat>
                        <h1 class="mb-4 secondary--text text-center">Signup</h1>
                        <v-form
                            ref="form"
                            v-model="valid"
                            class="text-center"
                        >
                            <v-text-field
                                v-model="email"
                                label="Email"
                                required
                            ></v-text-field>
                            <template v-if="$v.email.$error">
                                <span class="error--text" v-if="!$v.email.required">Value required</span>
                                <span class="error--text" v-if="!$v.email.email">Valid email required</span>
                            </template>
                            <v-text-field
                                v-model="username"
                                label="Username"
                                required
                            ></v-text-field>
                            <template v-if="$v.username.$error">
                                <span class="error--text" v-if="!$v.username.required">Value required</span>
                            </template>
                            <v-text-field
                                v-model="password"
                                label="Password"
                                required
                                type="password"
                            ></v-text-field>
                            <v-flex class="caption grey--text">Password must contain at least 8 characters</v-flex>
                            <template v-if="$v.password.$error">
                                <span class="error--text" v-if="!$v.password.required">Value required</span>
                                <span class="error--text" v-if="!$v.password.minLength">Password is too short!</span>
                            </template>
                            <v-text-field
                                v-model="passwordConfirm"
                                label="Confirm Password"
                                required
                                type="password"
                                @keydown.enter="signUp"
                            ></v-text-field>
                            <template v-if="$v.passwordConfirm.$error">
                                <span class="error--text" v-if="!$v.passwordConfirm.required">Value required </span>
                                <span class="error--text" v-if="!$v.passwordConfirm.sameAs">Passwords do not match</span>
                            </template>
                            <v-flex v-if="firebaseError" class="ma-2 error--text">{{ firebaseError }}</v-flex>
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
                </v-flex>
                <v-flex xs12 lg8 class="bgcol d-lg-flex d-none">
                    <lottie :options="defaultOptions" class="lottie" />
                </v-flex>
            </v-layout>
        </v-container>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { required, sameAs, email, minLength } from 'vuelidate/lib/validators'
import Lottie from 'vue-lottie'
import animationData from './../assets/login_anim.json'

export default {
    name: 'signup',
    components: {
        Lottie
    },
    data() {
        return {
            valid: false,
            email: null,
            password: null,
            firebaseError: null,
            defaultOptions: { animationData, loop: true, renderer: 'svg', rendererSettings: { preserveAspectRatio:'xMidYMid' } },
            animationSpeed: 1
        }
    },
    validations: {
        email: {
            required,
            email
        },
        username: {
            required
        },
        password: {
            required,
            minLength: minLength(8)
        },
        passwordConfirm: {
            required,
            sameAsPassword: sameAs('password')
        }
    },
    computed: {
        ...mapGetters(['user'])
    },
    methods: {
        async signUp($v) {
            this.$v.$touch()
            if(!this.$v.$invalid) {
                const auth = await this.$auth.signup(this.email, this.password).then((user) => {
                    return this.$db.collection('users').doc(user.user.uid).set({
                        username: this.username
                    })
                }).then(() => {
                    console.log('account created successfully')
                    this.$router.replace('/dashboard')
                }, (err) => {
                    this.firebaseError = err.message
                    console.log(err)
                })
            }
        }
    }
}
</script>

<style scoped>
    .form-container {
        display: flex;
        align-items: center;
        background: white;
    }
    .login-container {
        padding: 0;
    }
    .bgcol {
        background-image: url('../assets/anim_bg.png');
        background-size: cover;
    }
</style>