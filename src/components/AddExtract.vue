<template>    
    <v-dialog max-width="650" v-model="dialog">
        <template v-slot:activator="{ on }">
            <v-btn v-on="on" text class="white--text text-capitalize comp-btn">Add Run</v-btn>
        </template>
        <v-card class="pa-5">
            <v-card-title class="mb-5">
                <h3 class="secondary--text">Add Run</h3>
            </v-card-title>
            <v-card-text>
                <v-form class="px-3" ref="form">
                    <v-select
                        label="Select Shop"
                        :items="shopdata"
                        item-text="shopname"
                        v-model="$v.extract.shop.$model"
                        return-object
                        offset-y
                        @change="populateLicense(extract.shop.shopname, extract.shop.license)"
                    ></v-select>
                    <template v-if="$v.extract.shop.$error">
                        <span class="error--text" v-if="!$v.extract.shop.required">Value required</span>
                    </template>
                    <v-text-field label="License #" v-model="extract.license" clearable></v-text-field>
                    <v-layout wrap>
                        <v-flex xs12>
                            <v-menu offset-y transition="slide-x-transition" min-width="290px">
                                <template v-slot:activator="{ on }">
                                    <v-text-field :value="formattedManifestDate" v-on="on" label="Manifest Date" clearable></v-text-field>
                                </template>
                                <v-date-picker show-current landscape v-model="$v.extract.manifestDate.$model"></v-date-picker>
                            </v-menu>
                            <template v-if="$v.extract.manifestDate.$error">
                                <span class="error--text" v-if="!$v.extract.manifestDate.required">Value required</span>
                            </template>
                        </v-flex>
                    </v-layout>
                    <v-layout wrap>
                        <v-flex xs12>
                            <v-menu offset-y transition="slide-x-transition" min-width="290px">
                                <template v-slot:activator="{ on }">
                                    <v-text-field :value="formattedProcessDate" v-on="on" label="Process Date" clearable></v-text-field>
                                </template>
                                <v-date-picker show-current landscape v-model="$v.extract.processDate.$model"></v-date-picker>
                            </v-menu>
                            <template v-if="$v.extract.processDate.$error">
                                <span class="error--text" v-if="!$v.extract.processDate.required">Value required</span>
                            </template>
                        </v-flex>
                    </v-layout>
                    <v-text-field label="Processor Initials" v-model="$v.extract.initials.$model" clearable></v-text-field>
                    <template v-if="$v.extract.initials.$error">
                        <span class="error--text" v-if="!$v.extract.initials.required">Value required</span>
                    </template>
                    <v-text-field label="Strain" v-model="$v.extract.strain.$model" clearable></v-text-field>
                    <template v-if="$v.extract.strain.$error">
                        <span class="error--text" v-if="!$v.extract.strain.required">Value required</span>
                    </template>
                    <v-text-field label="METRC Tags (Last 4) Comma seperated list for multiple values" v-model="$v.extract.batch.$model" clearable></v-text-field>
                    <template v-if="$v.extract.batch.$error">
                        <span class="error--text" v-if="!$v.extract.batch.required">Value required</span>
                        <span class="error--text" v-if="!$v.extract.batch.minLength">4 digits required</span><br>
                    </template>
                    <v-text-field label="Weight In (g)" v-model="$v.extract.weight.$model" clearable></v-text-field>
                    <template v-if="$v.extract.weight.$error">
                        <span class="error--text" v-if="!$v.extract.weight.required">Value required</span>
                        <span class="error--text" v-if="!$v.extract.weight.numeric">Numbers only</span>
                    </template>
                    <v-text-field label="Waste Out (g)" v-model="$v.extract.waste.$model" clearable></v-text-field>
                    <template v-if="$v.extract.waste.$error">
                        <span class="error--text" v-if="!$v.extract.waste.required">Value required</span>
                        <span class="error--text" v-if="!$v.extract.waste.numeric">Numbers only</span>
                    </template>
                    <v-text-field label="Trim/Bud/Live" v-model="$v.extract.trimType.$model" clearable></v-text-field>
                    <template v-if="$v.extract.trimType.$error">
                        <span class="error--text" v-if="!$v.extract.trimType.required">Value required</span>
                    </template>
                    <v-text-field label="Shatter/Budder/Live/Sugar" v-model="$v.extract.productType.$model" clearable></v-text-field>
                    <template v-if="$v.extract.productType.$error">
                        <span class="error--text" v-if="!$v.extract.productType.required">Value required</span>
                    </template>
                    <v-text-field label="BHO/BPHO" v-model="$v.extract.gas.$model" clearable></v-text-field>
                    <template v-if="$v.extract.gas.$error">
                        <span class="error--text" v-if="!$v.extract.gas.required">Value required</span>
                    </template>
                    <v-layout justify-space-between wrap>
                        <v-flex xs12 sm4 md3>
                            <v-switch label="Failed?" v-model="extract.failed" color="primary" inset></v-switch>
                        </v-flex>
                        <v-flex xs12 sm4 md3>
                            <v-switch label="Champagne?" v-model="extract.champagne" color="primary" inset></v-switch>
                        </v-flex>
                        <v-flex xs12 sm4 md3>
                            <v-switch label="Rerun?" v-model="extract.rerun" color="primary" inset></v-switch>
                        </v-flex>
                    </v-layout>
                    <v-textarea outlined label="Notes" v-model="extract.notes" clearable></v-textarea>
                    <v-flex xs12 justify-center class="text-center">
                            <v-btn class="mr-5 mt-3" depressed color="error" @click="reset($v.extract)">Clear</v-btn>
                            <v-btn class="mr-5 mt-3" outlined color="error" @click="dialog = false">Cancel</v-btn>
                            <v-btn text class="mr-5 mt-3 success" @click="submit($v.extract)" :loading="loading">Add</v-btn>
                    </v-flex>
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
    name: 'addextract',
    data() {
        return {
            extract: {
                shop: '',
                license: '',
                manifestDate: null,
                processDate: null,
                initials: '',
                strain: '',
                batch: [],
                weight: '',
                waste: '',
                trimType: '',
                productType: '',
                champagne: false,
                gas: '',
                failed: false,
                rerun: false,
                notes: ''
            },
            shopdata: [],
            loading: false,
            dialog: false
        }
    },
    validations: {
        extract: {
            shop: {
                required
            },
            manifestDate: {
                required
            },
            processDate: {
                required
            },
            initials: {
                required
            },
            strain: {
                required
            },
            batch: {
                required,
                minLength: minLength(4),
            },
            weight: {
                required,
                numeric
            },
            waste: {
                required,
                numeric
            },
            trimType: {
                required
            },
            productType: {
                required
            },
            gas: {
                required
            }
        }
    },
    methods: {
        addBatchNum() {
            if(this.extract.batchNum) {
                this.extract.batch.push(this.trim.batchNum)
                this.extract.batchNum = null
            }
        },
        clearBatch() {
            this.loading = false
            this.extract.batch = []
        },
        populateLicense(shopname, license) {
            this.extract.shop = shopname
            this.extract.license = license
        },
        reset ($v) {
            this.$refs.form.reset()
            this.loading = false
            this.extract.batch = []
            $v.$reset()
        },
        submit($v) {
            this.$v.$touch()
            if(!this.$v.$invalid) {
                this.loading = true
                const extract = {
                    shop: this.extract.shop,
                    license: this.extract.license,
                    manifestDate: format(this.extract.manifestDate, 'MM/DD/YYYY'),
                    processDate: format(this.extract.processDate, 'MM/DD/YYYY'),
                    initials: this.extract.initials,
                    strain: this.extract.strain,
                    batch: this.extract.batch,
                    weight: Number(this.extract.weight),
                    waste: Number(this.extract.waste),
                    trimType: this.extract.trimType,
                    productType: this.extract.productType,
                    champagne: this.extract.champagne,
                    gas: this.extract.gas,
                    failed: this.extract.failed,
                    rerun: this.extract.rerun,
                    notes: this.extract.notes
                }
                db.collection('extract').add(extract).then(() => {
                    this.loading = false
                    this.dialog = false
                    this.extract = {
                        shop: '',
                        license: '',
                        manifestDate: null,
                        processDate: null,
                        initials: '',
                        strain: '',
                        batch: [],
                        weight: '',
                        waste: '',
                        trimType: '',
                        productType: '',
                        champagne: false,
                        gas: '',
                        failed: false,
                        rerun: false,
                        notes: ''
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
        formattedManifestDate() {
            return this.extract.manifestDate ? format(this.extract.manifestDate, 'MM/DD/YYYY') : ''
        },
        formattedProcessDate() {
            return this.extract.processDate ? format(this.extract.processDate, 'MM/DD/YYYY') : ''
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

<style scoped>
    .comp-btn {
        letter-spacing: normal !important;
    }
    .comp-btn.v-btn:not(.v-btn--round).v-size--default {
        padding: 0 65% 0 0;
    }
</style>
