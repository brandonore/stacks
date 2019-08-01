<template>
    <div class="login">
        <h3>Login</h3>
        <v-form
            ref="form"
            v-model="valid"
            :lazy-validation="lazy"
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
        <v-btn
            color="success"
            class="mr-4"
            @click="login"
        >
            Login
        </v-btn>
        </v-form>
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
        login() {
            firebase.auth().signInWithEmailAndPassword(this.email, this.password).then((user) => {
                console.log('successfully signed in')
                this.$router.replace('/dashboard')
            }, (err) => {
                console.log(err)
            })
        }
    }
}
</script>
