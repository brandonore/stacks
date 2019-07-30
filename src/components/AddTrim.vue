<template>    
    <v-dialog max-width="650" v-model="dialog">
        <template v-slot:activator="{ on }">
            <v-btn v-on="on" text color="white" class="success">Trim <v-icon right>fal fa-plus</v-icon></v-btn>
        </template>
        <v-card>
            <v-card-title class="mb-5">
                <h3 class="secondary--text">Add Trim/Incoming Package</h3>
            </v-card-title>
            <v-card-text>
                <v-form class="px-3" ref="form">
                    <v-select
                        label="Select Shop"
                        :items="shopdata"
                        item-text="shopname"
                        v-model="trim.shop"
                        clearable
                        return-object
                        offset-y
                        @change="populateLicense(trim.shop.shopname, trim.shop.license)"
                    ></v-select>
                    <v-text-field label="License #" v-model="trim.license"></v-text-field>
                    <v-text-field label="Manifest #" v-model="trim.manifest" clearable></v-text-field>
                    <v-text-field label="Strain" v-model="trim.strain" clearable></v-text-field>
                    <v-text-field label="METRC Tags (Last 4) Comma seperated list for multiple values" v-model="$v.trim.batch.$model" clearable></v-text-field>
                    <template v-if="$v.trim.batch.$error">
                        <p class="error--text" v-if="!$v.trim.batch.required">Value required</p>
                        <p class="error--text" v-if="!$v.trim.batch.minLength">4 digits required</p>
                    </template>
                    <v-text-field label="Weight (g)" v-model.trim="trim.weight" clearable></v-text-field>
                    <v-text-field label="Trim/Bud/Live" v-model="trim.type" clearable></v-text-field>
                    <v-layout wrap>
                        <v-flex xs12>
                            <v-menu offset-y transition="slide-x-transition" min-width="290px">
                                <template v-slot:activator="{ on }">
                                    <v-text-field :value="formattedDate" v-on="on" label="Input Date" clearable></v-text-field>
                                </template>
                                <v-date-picker show-current landscape v-model="trim.date"></v-date-picker>
                            </v-menu>
                        </v-flex>
                    </v-layout>
                    <v-layout row wrap>
                        <v-flex xs12 sm4>
                            <v-switch label="Failed?" v-model="trim.failed" color="primary"></v-switch>
                        </v-flex>
                        <v-flex xs12 sm8 class="text-right">
                            <v-btn class="mr-2 mt-3" outlined color="error" @click="reset">Clear</v-btn>
                            <v-btn class="mr-2 mt-3" outlined color="success" @click="dialog = false">Cancel</v-btn>
                            <v-btn text class="mr-2 mt-3 success" @click="submit" :loading="loading">Add</v-btn>
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
import { required, numeric, minLength } from 'vuelidate/lib/validators'

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
            shopdata: [],
            loading: false,
            dialog: false
        }
    },
    validations: {
        trim: {
            weight: {
                required,
                numeric
            },
            batch: {
                required,
                minLength: minLength(4)
            }
        }
    },
    methods: {
        addBatchNum() {
            if(this.trim.batchNum) {
                this.trim.batch.push(this.trim.batchNum)
                this.trim.batchNum = null
            }
        },
        clearBatch() {
            this.trim.batch = []
        },
        populateLicense(shopname, license) {
            this.trim.shop = shopname
            this.trim.license = license
        },
        reset () {
            this.$refs.form.reset()
            this.trim.batch = []
        },
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
    },
    computed: {
        formattedDate() {
            return this.trim.date ? format(this.trim.date, 'MMM Do YYYY') : ''
        }
    },
    created() {
        db.collection('shopdata').onSnapshot((res) => {
            const changes = res.docChanges()
            changes.forEach((change) => {
                if(change.type === 'added') {
                    this.shopdata.push({
                        ...change.doc.data(),
                        id: change.doc.id
                    })
                }
            })
        })
    }
}
</script>
