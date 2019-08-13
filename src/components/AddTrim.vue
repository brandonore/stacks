<template>    
    <v-dialog max-width="650" v-model="dialog">
        <template v-slot:activator="{ on }">
            <v-btn v-on="on" width="225" text class="secondary--text pa-3 white" depressed>Trim <v-icon right>fal fa-plus</v-icon></v-btn>
        </template>
        <v-card class="pa-5">
            <v-card-title class="mb-5">
                <h3 class="secondary--text">Add Trim/Incoming Package</h3>
            </v-card-title>
            <v-card-text>
                <v-form class="px-3" ref="form">
                    <v-select
                        label="Select Shop"
                        :items="shopdata"
                        item-text="shopname"
                        v-model="$v.trim.shop.$model"
                        return-object
                        offset-y
                        @change="populateLicense(trim.shop.shopname, trim.shop.license)"
                    ></v-select>
                    <template v-if="$v.trim.shop.$error">
                        <span class="error--text" v-if="!$v.trim.shop.required">Value required</span>
                    </template>
                    <v-text-field label="License #" v-model="trim.license" clearable></v-text-field>
                    <v-text-field label="Manifest #" v-model="$v.trim.manifest.$model" clearable></v-text-field>
                    <template v-if="$v.trim.manifest.$error">
                        <span class="error--text" v-if="!$v.trim.manifest.required">Value required</span>
                    </template>
                    <v-text-field label="Strain" v-model="$v.trim.strain.$model" clearable></v-text-field>
                    <template v-if="$v.trim.strain.$error">
                        <span class="error--text" v-if="!$v.trim.strain.required">Value required</span>
                    </template>
                    <v-text-field label="METRC Tags (Last 4) Comma seperated list for multiple values" v-model="$v.trim.batch.$model" clearable></v-text-field>
                    <template v-if="$v.trim.batch.$error">
                        <span class="error--text" v-if="!$v.trim.batch.required">Value required</span>
                        <span class="error--text" v-if="!$v.trim.batch.minLength">4 digits required</span><br>
                    </template>
                    <v-text-field label="Weight (g)" v-model="$v.trim.weight.$model" clearable></v-text-field>
                    <template v-if="$v.trim.weight.$error">
                        <span class="error--text" v-if="!$v.trim.weight.required">Value required</span>
                        <span class="error--text" v-if="!$v.trim.weight.numeric">Numbers only</span>
                    </template>
                    <v-text-field label="Trim/Bud/Live" v-model="$v.trim.type.$model" clearable></v-text-field>
                    <template v-if="$v.trim.type.$error">
                        <span class="error--text" v-if="!$v.trim.type.required">Value required</span>
                    </template>
                    <v-layout wrap>
                        <v-flex xs12>
                            <v-menu offset-y transition="slide-x-transition" min-width="290px">
                                <template v-slot:activator="{ on }">
                                    <v-text-field :value="formattedDate" v-on="on" label="Input Date" clearable></v-text-field>
                                </template>
                                <v-date-picker show-current landscape v-model="$v.trim.date.$model"></v-date-picker>
                            </v-menu>
                            <template v-if="$v.trim.date.$error">
                                <span class="error--text" v-if="!$v.trim.date.required">Value required</span>
                            </template>
                        </v-flex>
                    </v-layout>
                    <v-layout row wrap>
                        <v-flex xs12 sm4>
                            <v-switch label="Failed?" v-model="trim.failed" color="primary"></v-switch>
                        </v-flex>
                        <v-flex xs12 sm8 class="text-right">
                            <v-btn class="mr-5 mt-3" depressed color="error" @click="reset($v.trim)">Clear</v-btn>
                            <v-btn class="mr-5 mt-3" outlined color="error" @click="dialog = false">Cancel</v-btn>
                            <v-btn text class="mr-5 mt-3 success" @click="submit($v.trim)" :loading="loading">Add</v-btn>
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
                weight: '',
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
            shop: {
                required
            },
            manifest: {
                required
            },
            strain: {
                required
            },
            weight: {
                required,
                numeric
            },
            batch: {
                required,
                minLength: minLength(4),
            },
            type: {
                required
            },
            date: {
                required
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
            this.loading = false
            this.trim.batch = []
        },
        populateLicense(shopname, license) {
            this.trim.shop = shopname
            this.trim.license = license
        },
        reset ($v) {
            this.$refs.form.reset()
            this.loading = false
            this.trim.batch = []
            $v.$reset()
        },
        submit($v) {
            this.$v.$touch()
            if(!this.$v.$invalid) {
                this.loading = true
                const trim = {
                    shop: this.trim.shop,
                    license: this.trim.license,
                    manifest: this.trim.manifest,
                    batch: this.trim.batch,
                    strain: this.trim.strain,
                    weight: Number(this.trim.weight),
                    failed: this.trim.failed,
                    type: this.trim.type,
                    date: format(this.trim.date, 'MM/DD/YYYY')
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
                        weight: '',
                        failed: false,
                        type: '',
                        date: null
                    }
                })
                $v.$reset()
                this.$root.$emit('set-snackbar', 'addItem')
            } else {
                return
            }
        },
    },
    computed: {
        formattedDate() {
            return this.trim.date ? format(this.trim.date, 'MM/DD/YYYY') : ''
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
