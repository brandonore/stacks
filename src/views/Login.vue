<template>
    <div class="login mx-3">
        <v-layout row justify-center>
            <v-card class="pa-5" flat width="650">
                <h3 class="mb-4 secondary--text text-center">Login</h3>
                <v-flex class="text-center">Demo account<br>email: demo@demo.com pass: password</v-flex>
                <v-form
                    ref="form"
                    v-model="valid"
                    class="text-center"
                >
                    <v-text-field
                        v-model="$v.email.$model"
                        label="Email"
                        required
                    ></v-text-field>
                    <template v-if="$v.email.$error">
                        <span class="error--text" v-if="!$v.email.required">Value required</span>
                        <span class="error--text" v-if="!$v.email.email">Valid email required</span>
                    </template>
                    <v-text-field
                        v-model="$v.password.$model"
                        label="password"
                        required
                        type="password"
                        @keydown.enter="login"
                    ></v-text-field>
                    <template v-if="$v.password.$error">
                        <span class="error--text" v-if="!$v.password.required">Value required</span>
                    </template>
                    <v-flex v-if="firebaseError" class="ma-2 error--text">{{ firebaseError }}</v-flex>
                    <v-flex xs12 class="my-5">
                            <v-btn
                                color="success white--text"
                                class="mr-4"
                                @click="login"
                                depressed
                                width="100%"
                            >
                                Login
                            </v-btn>
                    </v-flex>
                    <v-divider></v-divider>
                    <v-layout row class="mt-5 mb-2 px-5" justify-center>
                        <v-flex xs12 class="mb-3">
                            <router-link to="/">Reset Password</router-link>
                        </v-flex>
                        <v-flex xs12>
                            No account? <router-link to="/signup">Sign Up</router-link>
                        </v-flex>
                    </v-layout>
                </v-form>
            </v-card>
        </v-layout>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { required, email } from 'vuelidate/lib/validators'

export default {
    data() {
        return {
            valid: false,
            email: null,
            password: null,
            firebaseError: null
        }
    },
    validations: {
        email: {
            required,
            email
        },
        password: {
            required,
        }
    },
    computed: {
        ...mapGetters(['user']),
        nextRoute() {
            return this.$router.replace('/dashboard') || '/'
        }
    },
    watch: {
        user(auth) {
            if(!!auth) {
                this.$router.replace(this.nextRoute)
            }
        }
    },
    methods: {
        async login($v) {
            this.$v.$touch()
            if(!this.$v.$invalid) { 
                const auth = await this.$auth.login(this.email, this.password).then((user) => {
                    console.log('successfully signed in')
                    console.log(user.user.uid)
                }, (err) => {
                    this.firebaseError = err.message
                    console.log(err.message)
                })
            }
        }
    }
}
</script>
