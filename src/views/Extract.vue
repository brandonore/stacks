<template>
    <div class="extract mx-3">
        <h3 class="mb-5 mt-3 secondary--text">Extraction</h3>
        <v-divider class="mb-5"></v-divider>
        <v-container fluid grid-list-xl>
            <v-layout wrap>
                <v-flex d-flex width="100%">
                    <v-card flat class="mx-auto" width="100%">
                        <v-toolbar color="alternate" dark flat>
                            <v-toolbar-title>Current Runs</v-toolbar-title>
                            <v-spacer></v-spacer>
                        </v-toolbar>
                        <v-card-title class="mb-5">
                            <v-text-field
                                v-model="search"
                                append-icon="far fa-search"
                                label="Search"
                                single-line
                                hide-details
                                class="pa-5"
                            ></v-text-field>
                        </v-card-title>
                        <v-data-table
                            :headers="headers"
                            :items="extract"
                            item-key="id"
                            show-expand
                            :single-expand="singleExpand"
                            :search="search"
                            class="pa-5"
                        >
                            <template v-slot:item.failed="{ item }">
                                <v-chip small :color="getColor(item.failed)" dark>{{ item.failed }}</v-chip>
                            </template>
                            <template v-slot:item.champagne="{ item }">
                                <v-chip small :color="champagneColor(item.champagne)" dark>{{ item.champagne }}</v-chip>
                            </template>
                            <template v-slot:item.rerun="{ item }">
                                <v-chip small :color="rerunColor(item.rerun)" dark>{{ item.rerun }}</v-chip>
                            </template>
                            <template v-slot:item.action="{ item }">
                                <v-tooltip top>
                                    <template v-slot:activator="{ on }">
                                        <v-icon
                                            v-on="on"
                                            small
                                            class="mr-2"
                                            @click="editItem(item)"
                                        >
                                            fas fa-pencil
                                        </v-icon>
                                    </template>
                                    <span>Edit Item</span>
                                </v-tooltip>
                                <v-tooltip top>
                                    <template v-slot:activator="{ on }">
                                        <v-icon
                                            v-on="on"
                                            small
                                            class="mr-2"
                                            @click="confirmModal(item.id)"
                                        >
                                            fas fa-times
                                        </v-icon>
                                    </template>
                                    <span>Delete Item</span>
                                </v-tooltip>
                                <v-tooltip left>
                                    <template v-slot:activator="{ on }">
                                        <v-icon
                                            v-on="on"
                                            small
                                            class="mr-2"
                                            @click="moveItem(item)"
                                        >
                                            fas fa-arrow-to-right
                                        </v-icon>
                                    </template>
                                    <span>Move to Packaging</span>
                                </v-tooltip>
                            </template>
                            <template v-slot:expanded-item="{ item }">
                                <td :colspan="headers.length + 1">{{ item.notes }}</td>
                            </template>
                        </v-data-table>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-container>
        <!-- edit dialog -->
        <template>
            <v-layout justify-center>
            <v-dialog max-width="650" v-model="edit_dialog">
                <v-card class="pa-5">
                <v-card-title class="mb-5">
                    <h3 class="secondary--text">Edit Run</h3>
                </v-card-title>
                <v-card-text>
                    <v-form class="px-3" ref="form">
                        <v-text-field label="Shop" v-model="$v.editExtract.shop.$model" clearable></v-text-field>
                        <template v-if="$v.editExtract.shop.$error">
                            <span class="error--text" v-if="!$v.editExtract.shop.required">Value required</span>
                        </template>
                        <v-text-field label="Manifest Date" v-model="$v.editExtract.manifestDate.$model" clearable></v-text-field>
                        <template v-if="$v.editExtract.manifestDate.$error">
                            <span class="error--text" v-if="!$v.editExtract.manifestDate.required">Value required</span>
                        </template>
                        <v-text-field label="Process Date" v-model="$v.editExtract.processDate.$model" clearable></v-text-field>
                        <template v-if="$v.editExtract.processDate.$error">
                            <span class="error--text" v-if="!$v.editExtract.processDate.required">Value required</span>
                        </template>
                        <v-text-field label="Processor Initials" v-model="$v.editExtract.initials.$model" clearable></v-text-field>
                        <template v-if="$v.editExtract.initials.$error">
                            <span class="error--text" v-if="!$v.editExtract.initials.required">Value required</span>
                        </template>
                        <v-text-field label="Strain Name" v-model="$v.editExtract.strain.$model" clearable></v-text-field>
                        <template v-if="$v.editExtract.strain.$error">
                            <span class="error--text" v-if="!$v.editExtract.strain.required">Value required</span>
                        </template>
                        <v-text-field label="METRC Tags (Last 4) Comma seperated list for multiple values" v-model="$v.editExtract.batch.$model" clearable></v-text-field>
                        <template v-if="$v.editExtract.batch.$error">
                            <span class="error--text" v-if="!$v.editExtract.batch.required">Value required</span>
                            <span class="error--text" v-if="!$v.editExtract.batch.minLength">4 digits required</span><br>
                            <span class="error--text" v-if="!$v.editExtract.batch.numeric">Numbers only</span>
                        </template>
                        <v-text-field label="Weight In (g)" v-model="$v.editExtract.weight.$model" clearable></v-text-field>
                        <template v-if="$v.editExtract.weight.$error">
                            <span class="error--text" v-if="!$v.editExtract.weight.required">Value required</span>
                            <span class="error--text" v-if="!$v.editExtract.weight.numeric">Numbers only</span>
                        </template>
                        <v-text-field label="Waste Out (g)" v-model="$v.editExtract.waste.$model" clearable></v-text-field>
                        <template v-if="$v.editExtract.waste.$error">
                            <span class="error--text" v-if="!$v.editExtract.waste.required">Value required</span>
                            <span class="error--text" v-if="!$v.editExtract.waste.numeric">Numbers only</span>
                        </template>
                        <v-text-field label="Trim/Bud/Live" v-model="$v.editExtract.trimType.$model" clearable></v-text-field>
                        <template v-if="$v.editExtract.trimType.$error">
                            <span class="error--text" v-if="!$v.editExtract.trimType.required">Value required</span>
                        </template>
                        <v-text-field label="Shatter/Budder/Live/Sugar" v-model="$v.editExtract.productType.$model" clearable></v-text-field>
                        <template v-if="$v.editExtract.productType.$error">
                            <span class="error--text" v-if="!$v.editExtract.productType.required">Value required</span>
                        </template>
                        <v-text-field label="BHO/BPHO" v-model="$v.editExtract.gas.$model" clearable></v-text-field>
                        <template v-if="$v.editExtract.gas.$error">
                            <span class="error--text" v-if="!$v.editExtract.gas.required">Value required</span>
                        </template>
                        <v-layout justify-space-between wrap>
                            <v-flex xs12 sm4 md3>
                                <v-switch label="Failed?" v-model="editExtract.failed" color="primary" inset></v-switch>
                            </v-flex>
                            <v-flex xs12 sm4 md3>
                                <v-switch label="Champagne?" v-model="editExtract.champagne" color="primary" inset></v-switch>
                            </v-flex>
                            <v-flex xs12 sm4 md3>
                                <v-switch label="Rerun?" v-model="editExtract.rerun" color="primary" inset></v-switch>
                            </v-flex>
                        </v-layout>
                        <v-textarea outlined label="Notes" v-model="editExtract.notes" clearable></v-textarea>
                        <v-flex xs12 justify-center class="text-center">
                                <v-btn class="mr-5 mt-3" depressed color="error" @click="reset($v.editExtract)">Clear</v-btn>
                                <v-btn class="mr-5 mt-3" outlined color="error" @click="edit_dialog = false">Cancel</v-btn>
                                <v-btn text class="mr-5 mt-3 success" @click="updateItem" :loading="loading">Update</v-btn>
                        </v-flex>
                    </v-form>
                </v-card-text>
                </v-card>
            </v-dialog>
            </v-layout>
        </template>
        <!-- delete dialog -->
        <template>
            <v-layout justify-center>
            <v-dialog v-model="delete_dialog" persistent max-width="350">
                <v-card class="pa-2">
                <v-card-title class="subtitle-1 font-weight-light">Are you sure you want to delete this item?</v-card-title>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" text @click="delete_dialog = false">Cancel</v-btn>
                    <v-btn color="success" text @click="deleteItem">Yes</v-btn>
                </v-card-actions>
                </v-card>
            </v-dialog>
            </v-layout>
        </template>
        <!-- add to packaging dialog -->
        <template>
            <v-layout justify-center>
            <v-dialog v-model="packaging_dialog" persistent max-width="350">
                <v-card class="pa-2">
                <v-card-title class="subtitle-1 font-weight-light">Are you sure you want to move this item?</v-card-title>
                {{ packageItem }}
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" text @click="packaging_dialog = false">Cancel</v-btn>
                    <v-btn color="success" text @click="confirmMove">Yes</v-btn>
                </v-card-actions>
                </v-card>
            </v-dialog>
            </v-layout>
        </template>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import { required, numeric, minLength } from 'vuelidate/lib/validators'
import format from 'date-fns/format'

export default {
    name: 'extract',
    data() {
        return {
            extract: [],
            singleExpand: true,
            editExtract: {},
            packageItem: {},
            search: '',
            edit_dialog: false,
            delete_dialog: false,
            packaging_dialog: false,
            loading: null,
            id: null,
            headers: [
                { text: 'Shop Name', align: 'left', value: 'shop' },
                { text: 'Manifest Date', value: 'manifestDate' },
                { text: 'Process Date', value: 'processDate' },
                { text: 'Processor Initials', value: 'initials' },
                { text: 'Strain Name', value: 'strain' },
                { text: 'METRC Tag (Last 4)', value: 'batch' },
                { text: 'Weight In (g)', value: 'weight' },
                { text: 'Waste Out (g)', value: 'waste' },
                { text: 'Trim/Bud/Live', value: 'trimType' },
                { text: 'Shatter/Budder/Live/Sugar', value: 'productType' },
                { text: 'Champagne?', value: 'champagne' },
                { text: 'BHO/BPHO', value: 'gas' },
                { text: 'Failed?', value: 'failed' },
                { text: 'Rerun?', value: 'rerun' },
                { text: 'Actions', value: 'action' }
            ]
        }
    },
    validations: {
        editExtract: {
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
        moveItem(item) {
            this.packageItem = Object.assign({}, item)
            let date = new Date()
            this.packageItem['rackDate'] = format(date, 'MM/DD/YYYY')
            this.packageItem['totalGrams'] = 0
            this.packageItem['sample'] = '2'
            this.packageItem['testType'] = 'P'
            this.packageItem['packInitials'] = ''
            this.packageItem['labeled'] = false
            this.packaging_dialog = true
        },
        confirmMove() {
            this.$db.collection('users').doc(this.user.uid).collection('packaging').add(this.packageItem).then(() => {
                this.packaging_dialog = false
            })
        },
        editItem(item) {
            this.editExtract = Object.assign({}, item)
            this.edit_dialog = true
        },
        updateItem() {
            this.editExtract.weight = Number(this.editExtract.weight)
            this.editExtract.waste = Number(this.editExtract.waste)
            this.$db.collection('users').doc(this.user.uid).collection('extract').doc(this.editExtract.id).update(this.editExtract)
            .then(() => {
                this.edit_dialog = false
            }).catch((err) => {
                console.log(err)
            })
            this.$root.$emit('set-snackbar', 'editItem')
        },
        confirmModal(id) {
            this.delete_dialog = true
            this.id = id
        },
        deleteItem() {
            this.$db.collection('users').doc(this.user.uid).collection('extract').doc(this.id).delete()
            this.id = null
            this.delete_dialog = false
        },
        reset ($v) {
            this.$refs.form.reset()
            this.loading = false
            this.editExtract.batch = []
            $v.$reset()
        },
        getColor(item) {
            if(item === true) return 'error'
            else return 'success'
        },
        champagneColor(item) {
            if(item === true) return 'champagne'
            else return 'secondary'
        },
        rerunColor(item) {
            if(item === true) return 'error'
            else return 'success'
        }
    },
    computed: {
        ...mapState(['user'])
    },
    created() {
        this.$db.collection('users').doc(this.user.uid).collection('extract').onSnapshot((res) => {
            const changes = res.docChanges()
            changes.forEach((change) => {
                if(change.type === 'added') {
                    this.extract.push({
                        ...change.doc.data(),
                        id: change.doc.id
                    })
                } else if(change.type === 'removed') {
                    this.extract = this.extract.filter((item) => {
                        return item.id != change.doc.id
                    })
                } else if(change.type === 'modified') {
                    this.extract = this.extract.filter((item) => {
                        return item.id != change.doc.id
                    }) 
                    this.extract.push({
                        ...change.doc.data()
                    })
                }
            })
        })
    }
}
</script>

<style>
    .theme--light.v-data-table tbody tr.expanded.expanded__content {
        box-shadow: none;
        background-color: #373B5F;
        color: #fff;
    }
</style>
