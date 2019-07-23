<template>
    <v-dialog max-width="600px" v-model="dialog">
        <v-btn flat slot="activator" outline class="success white--text">Shop <v-icon right>fal fa-plus</v-icon></v-btn>
        <v-card>
            <v-card-title>
                <h2 class="secondary--text">Add Shop</h2>
            </v-card-title>
            <v-card-text>
                <v-form class="px-3" ref="form">
                    <v-text-field label="Shop Name" v-model="shopname" clearable></v-text-field>
                    <v-text-field label="License #" v-model="license" clearable></v-text-field>
                    <v-layout row wrap>
                        <v-flex xs12 class="text-xs-center">
                            <v-btn flat class="success mr-2 mt-3 success--text" outline @click="dialog = false">Cancel</v-btn>
                            <v-btn flat class="success mr-2 mt-3" @click="submit" :loading="loading">Add</v-btn>
                        </v-flex>
                    </v-layout>
                </v-form>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
import db from '@/firebase'
import { required } from 'vuelidate/lib/validators'

export default {
    name: 'addshopdata',
    data() {
        return {
            shopname: '',
            license: '',
            dialog: false
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
        submit() {
            this.$v.$touch()
            if(!this.$v.$invalid) {
                this.loading = true
                const shop = {
                    shopname: this.shopname,
                    license: this.license,
                }
                db.collection('shopdata').add(shop).then(() => {
                    this.loading = false
                    this.dialog = false
                    this.trim = {
                        shopname: '',
                        license: '',
                    }
                })
            } else {
                return
            }
        }
    }
}
</script>