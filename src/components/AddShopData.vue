<template>
    <v-dialog max-width="600px" v-model="dialog">
        <template v-slot:activator="{ on }">
            <v-btn :ripple="false" v-on="on" text class="white--text text-capitalize comp-btn">Add Shop</v-btn>
        </template>
        <v-card class="pa-5">
            <v-card-title class="mb-5">
                <h3 class="secondary--text">Add a new shop</h3>
            </v-card-title>
            <v-card-text>
                <v-form class="px-3" ref="form">
                    <v-text-field label="Shop Name" v-model="shopname" clearable></v-text-field>
                    <template v-if="$v.shopname.$error">
                        <p class="error--text" v-if="!$v.shopname.required">Value required</p>
                    </template>
                    <v-text-field label="License #" v-model="license" clearable></v-text-field>
                    <template v-if="$v.license.$error">
                        <p class="error--text" v-if="!$v.license.required">Value required</p>
                    </template>
                    <v-layout row wrap>
                        <v-flex xs12 class="text-center">
                            <v-btn class="mr-2 mt-3" depressed color="error" @click="reset($v)">Clear</v-btn>
                            <v-btn class="mr-2 mt-3" outlined color="error" @click="dialog = false">Cancel</v-btn>
                            <v-btn text class="success mr-2 mt-3" @click="submit" :loading="loading">Add</v-btn>
                        </v-flex>
                    </v-layout>
                </v-form>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
import { mapState } from 'vuex'
import { required } from 'vuelidate/lib/validators'
import store from '../store/store'

export default {
    name: 'addshopdata',
    data() {
        return {
            shopname: '',
            license: '',
            dialog: false,
            loading: false
        }
    },
    validations: {
        shopname: {
            required
        },
        license: {
            required
        }
    },
    methods: {
        reset ($v) {
            this.$refs.form.reset()
            this.loading = false
            $v.$reset()
        },
        submit() {
            this.$v.$touch()
            if(!this.$v.$invalid) {
                this.loading = true
                const shop = {
                    shopname: this.shopname,
                    license: this.license,
                }
                this.$db.collection('users').doc(this.user.uid).collection('shopdata').add(shop).then(() => {
                    this.loading = false
                    this.dialog = false
                    this.shopname = ''
                    this.license = ''
                })
            } else {
                return
            }
        }
    },
    computed: {
        ...mapState(['user'])
    },
}
</script>

<style scoped>
    .comp-btn {
        letter-spacing: normal !important;
        font-size: 0.8125rem
    }
    .comp-btn.v-btn:not(.v-btn--round).v-size--default {
        padding: 0 65% 0 0;
    }
    .v-btn::before {
        background-color: none;
    }
</style>