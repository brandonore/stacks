<template>
    <div class="signup mx-3">
        <v-layout row justify-center>
            <v-card class="pa-5" flat width="650">
                <h3 class="mb-4 secondary--text text-center">Sign Up</h3>
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
        </v-layout>
    </div>
</template>


<script>
import { mapGetters } from 'vuex'
import { required, sameAs, email, minLength } from 'vuelidate/lib/validators'

export default {
    data() {
        return {
            valid: false,
            email: null,
            username: null,
            password: null,
            passwordConfirm: null,
            firebaseError: null
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