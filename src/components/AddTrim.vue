<template>
    <v-dialog max-width="600px" v-model="dialog">
        <v-btn flat slot="activator" class="success">Add Trim <v-icon right>fal fa-plus</v-icon></v-btn>
        <v-card>
            <v-card-title>
                <h2>Add Trim/Incoming Package</h2>
            </v-card-title>
            <v-card-text>
                <v-form class="px-3" ref="form">
                    <v-text-field label="Shop" v-model="trim.shop" clearable></v-text-field>
                    <v-text-field label="License #" v-model="trim.license" clearable></v-text-field>
                    <v-text-field label="Manifest #" v-model="trim.manifest" clearable></v-text-field>
                    <v-text-field label="METRC Tags (Last 4)" v-model="trim.batch" clearable></v-text-field>
                    <v-text-field label="Strain" v-model="trim.strain" clearable></v-text-field>
                    <v-text-field label="Weight (g)" v-model.trim="$v.trim.weight.$model" clearable></v-text-field>
                    <template v-if="$v.trim.weight.$error">
                        <p class="error--text" v-if="!$v.trim.weight.numeric">Numerical values only</p>
                        <p class="error--text" v-if="!$v.trim.weight.required">Value required</p>
                    </template>
                    <v-layout row wrap>
                        <v-flex xs12 sm6>
                            <v-text-field label="Trim/Bud/Live" v-model="trim.type" clearable></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm6 class="text-sm-right">
                            <v-menu>
                                <v-text-field :value="formattedDate" slot="activator" label="Input Date" clearable></v-text-field>
                                <v-date-picker v-model="trim.date"></v-date-picker>
                            </v-menu>
                        </v-flex>
                    </v-layout>
                    <v-layout row wrap>
                        <v-flex xs12 sm6>
                            <v-switch label="Failed?" v-model="trim.failed" color="primary"></v-switch>
                        </v-flex>
                        <v-flex xs12 sm6 class="text-sm-right">
                            <v-btn flat class="success mr-2 mt-3 grey--text" outline @click="dialog = false">Cancel</v-btn>
                            <v-btn flat class="success mr-2 mt-3" @click="submit" :loading="loading">Add</v-btn>
                        </v-flex>
                    </v-layout>
                </v-form>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
import format from 'date-fns/format'
import db from '@/firebase'
import { required, numeric } from 'vuelidate/lib/validators'

export default {
    name: 'addtrim',
    data() {
        return {
            trim: {
                shop: '',
                license: '',
                manifest: '',
                batch: [],
                strain: '',
                weight: null,
                failed: false,
                type: '',
                date: null
            },
            loading: false,
            dialog: false
        }
    },
    validations: {
        trim: {
            weight: {
                required,
                numeric
            }
        }
    },
    methods: {
        submit() {
            
            this.$v.$touch()

            if(!this.$v.$invalid) {
                this.loading = true
                const trim = {
                    shop: this.trim.shop,
                    license: this.trim.license,
                    manifest: this.trim.manifest,
                    batch: this.trim.batch,
                    strain: this.trim.strain,
                    weight: this.trim.weight,
                    failed: this.trim.failed,
                    type: this.trim.type,
                    date: format(this.trim.date, 'MMM Do YYYY')
                }
                db.collection('trim').add(trim).then(() => {
                    this.loading = false
                    this.dialog = false
                    this.trim = {
                        shop: '',
                        license: '',
                        manifest: '',
                        batch: [],
                        strain: '',
                        weight: null,
                        failed: false,
                        type: '',
                        date: null
                    }
                })
            } else {
                return
            }
        },
        reset () {
            this.$refs.form.reset()
        }
    },
    computed: {
        formattedDate() {
            return this.trim.date ? format(this.trim.date, 'MMM Do YYYY') : ''
        }
    }
}
</script>