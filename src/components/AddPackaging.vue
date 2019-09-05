<template>    
    <v-dialog max-width="650" v-model="dialog">
        <template v-slot:activator="{ on }">
            <v-btn :ripple="false" v-on="on" text class="white--text text-capitalize comp-btn">Add Slab</v-btn>
        </template>
        <v-card class="pa-5">
            <v-card-title class="mb-5">
                <h3 class="secondary--text">Add a New Slab to the Rack</h3>
            </v-card-title>
            <v-card-text>
                <v-form class="px-3" ref="form">
                    <v-select
                        label="Select Shop"
                        :items="shopdata"
                        item-text="shopname"
                        v-model="$v.packaging.shop.$model"
                        return-object
                        offset-y
                        @change="populateLicense(packaging.shop.shopname)"
                    ></v-select>
                    <template v-if="$v.packaging.shop.$error">
                        <span class="error--text" v-if="!$v.packaging.shop.required">Value required</span>
                    </template>
                    <v-layout wrap>
                        <v-flex xs12>
                            <v-menu offset-y transition="slide-x-transition" min-width="290px">
                                <template v-slot:activator="{ on }">
                                    <v-text-field :value="formatProcessDate" v-on="on" label="Process Date" clearable></v-text-field>
                                </template>
                                <v-date-picker show-current landscape v-model="$v.packaging.processDate.$model"></v-date-picker>
                            </v-menu>
                            <template v-if="$v.packaging.processDate.$error">
                                <span class="error--text" v-if="!$v.packaging.processDate.required">Value required</span>
                            </template>
                        </v-flex>
                    </v-layout>
                    <v-layout wrap>
                        <v-flex xs12>
                            <v-menu offset-y transition="slide-x-transition" min-width="290px">
                                <template v-slot:activator="{ on }">
                                    <v-text-field :value="formatRackDate" v-on="on" label="Date on Rack" clearable></v-text-field>
                                </template>
                                <v-date-picker show-current landscape v-model="$v.packaging.rackDate.$model"></v-date-picker>
                            </v-menu>
                            <template v-if="$v.packaging.rackDate.$error">
                                <span class="error--text" v-if="!$v.packaging.rackDate.required">Value required</span>
                            </template>
                        </v-flex>
                    </v-layout>
                    <v-layout wrap>
                        <v-flex xs12>
                            <v-menu offset-y transition="slide-x-transition" min-width="290px">
                                <template v-slot:activator="{ on }">
                                    <v-text-field :value="formatPackageDate" v-on="on" label="Date Packaged" clearable></v-text-field>
                                </template>
                                <v-date-picker show-current landscape v-model="packaging.packageDate"></v-date-picker>
                            </v-menu>
                        </v-flex>
                    </v-layout>
                    <v-text-field label="Strain" v-model="$v.packaging.strain.$model" clearable></v-text-field>
                    <template v-if="$v.packaging.strain.$error">
                        <span class="error--text" v-if="!$v.packaging.strain.required">Value required</span>
                    </template>
                    <v-text-field label="Shatter/Budder/Live/Sugar" v-model="$v.packaging.productType.$model" clearable></v-text-field>
                    <template v-if="$v.packaging.productType.$error">
                        <span class="error--text" v-if="!$v.packaging.productType.required">Value required</span>
                    </template>
                    <v-text-field label="METRC Tags (Last 4) Comma seperated list for multiple values" v-model="$v.packaging.batch.$model" clearable></v-text-field>
                    <template v-if="$v.packaging.batch.$error">
                        <span class="error--text" v-if="!$v.packaging.batch.required">Value required</span>
                        <span class="error--text" v-if="!$v.packaging.batch.minLength">4 digits required</span><br>
                    </template>
                    <v-text-field label="Weight In" v-model="$v.packaging.weight.$model" clearable></v-text-field>
                    <template v-if="$v.packaging.weight.$error">
                        <span class="error--text" v-if="!$v.packaging.weight.required">Value required</span>
                        <span class="error--text" v-if="!$v.packaging.weight.numeric">Numbers only</span>
                    </template>
                    <v-text-field label="Processor Initials" v-model="$v.packaging.initials.$model" clearable></v-text-field>
                    <template v-if="$v.packaging.initials.$error">
                        <span class="error--text" v-if="!$v.packaging.initials.required">Value required</span>
                    </template>
                    <v-text-field label="Total Grams" v-model="$v.packaging.totalGrams.$model" clearable></v-text-field>
                    <template v-if="$v.packaging.totalGrams.$error">
                        <span class="error--text" v-if="!$v.packaging.totalGrams.numeric">Numbers only</span>
                    </template>
                    <v-text-field label="Sample Size" v-model="$v.packaging.sample.$model" clearable></v-text-field>
                    <template v-if="$v.packaging.sample.$error">
                        <span class="error--text" v-if="!$v.packaging.sample.required">Value required</span>
                    </template>
                    <v-text-field label="Test Type" v-model="$v.packaging.testType.$model" clearable></v-text-field>
                    <template v-if="$v.packaging.testType.$error">
                        <span class="error--text" v-if="!$v.packaging.testType.required">Value required</span>
                    </template>
                    <v-text-field label="Packager Initials" v-model="$v.packaging.packInitials" clearable></v-text-field>
                    <v-layout row wrap>
                        <v-flex xs12 sm4>
                                <v-switch label="Champagne?" v-model="packaging.champagne" color="primary" inset></v-switch>
                        </v-flex>
                        <v-flex xs12 sm8 class="text-right">
                            <v-btn class="mr-5 mt-3" depressed color="error" @click="reset($v.packaging)">Clear</v-btn>
                            <v-btn class="mr-5 mt-3" outlined color="error" @click="dialog = false">Cancel</v-btn>
                            <v-btn text class="mr-5 mt-3 success" @click="submit($v.packaging)" :loading="loading">Add</v-btn>
                        </v-flex>
                    </v-layout>
                </v-form>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
import { mapState } from 'vuex'
import format from 'date-fns/format'
import { required, numeric, minLength } from 'vuelidate/lib/validators'

export default {
    name: 'addpackaging',
    data() {
        return {
            packaging: {
                shop: '',
                processDate: null,
                rackDate: null,
                packageDate: null,
                strain: '',
                productType: '',
                champagne: false,
                batch: [],
                weight: '',
                initials: '',
                totalGrams: '',
                sample: '',
                testType: '',
                packInitials: ''
            },
            shopdata: [],
            loading: false,
            dialog: false
        }
    },
    validations: {
        packaging: {
            shop: {
                required
            },
            processDate: {
                required
            },
            rackDate: {
                required
            },
            strain: {
                required
            },
            productType: {
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
            initials: {
                required
            },
            totalGrams: {
                numeric
            },
            sample: {
                required
            },
            testType: {
                required
            }
        }
    },
    methods: {
        addBatchNum() {
            if(this.packaging.batchNum) {
                this.packaging.batch.push(this.packaging.batchNum)
                this.packaging.batchNum = null
            }
        },
        clearBatch() {
            this.loading = false
            this.packaging.batch = []
        },
        populateLicense(shopname) {
            this.packaging.shop = shopname
        },
        reset ($v) {
            this.$refs.form.reset()
            this.loading = false
            this.packaging.batch = []
            $v.$reset()
        },
        submit($v) {
            this.$v.$touch()
            if(!this.$v.$invalid) {
                this.loading = true
                const packaging = {
                    shop: this.packaging.shop,
                    processDate: format(this.packaging.processDate, 'MM/DD/YYYY'),
                    rackDate: format(this.packaging.rackDate, 'MM/DD/YYYY'),
                    packageDate: (this.packaging.packageDate ? format(this.packaging.packageDate, 'MM/DD/YYYY') : ''),
                    strain: this.packaging.strain,
                    productType: this.packaging.productType,
                    champagne: this.packaging.champagne,
                    batch: this.packaging.batch,
                    weight: Number(this.packaging.weight),
                    initials: this.packaging.initials,
                    totalGrams: Number(this.packaging.totalGrams),
                    sample: this.packaging.sample,
                    testType: this.packaging.testType,
                    packInitials: this.packaging.packInitials
                }
                this.$db.collection('users').doc(this.user.uid).collection('packaging').add(packaging).then(() => {
                    this.loading = false
                    this.dialog = false
                    this.packaging = {
                        shop: '',
                        processDate: null,
                        rackDate: null,
                        packageDate: null,
                        strain: '',
                        productType: '',
                        champagne: false,
                        batch: [],
                        weight: '',
                        initials: '',
                        totalGrams: '',
                        sample: '',
                        testType: '',
                        packInitials: ''
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
        formatProcessDate() {
            return this.packaging.processDate ? format(this.packaging.processDate, 'MM/DD/YYYY') : ''
        },
        formatRackDate() {
            return this.packaging.rackDate ? format(this.packaging.rackDate, 'MM/DD/YYYY') : ''
        },
        formatPackageDate() {
            return this.packaging.packageDate ? format(this.packaging.packageDate, 'MM/DD/YYYY') : ''
        },
        ...mapState(['user'])
    },
    created() {
        this.$db.collection('users').doc(this.user.uid).collection('shopdata').onSnapshot((res) => {
            const changes = res.docChanges()
            changes.forEach((change) => {
                if(change.type === 'added') {
                    this.shopdata.push({
                        ...change.doc.data(),
                        id: change.doc.id
                    })
                } else if(change.type === 'removed') {
                    this.shopdata = this.shopdata.filter((item) => {
                        return item.id != change.doc.id
                    })
                } else if(change.type === 'modified') {
                    this.shopdata = this.shopdata.filter((item) => {
                    return item.id != change.doc.id
                    }) 
                    this.shopdata.push({
                        ...change.doc.data()
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
        font-size: 0.8125rem
    }
    .comp-btn.v-btn:not(.v-btn--round).v-size--default {
        padding: 0 65% 0 0;
    }
</style>