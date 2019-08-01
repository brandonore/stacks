<template>
    <div class="signup">
        <h3>Sign Up</h3>
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
            type="password"
            required
        ></v-text-field>
        <v-btn
            color="success"
            class="mr-4"
            @click="signUp"
        >
            Sign Up
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