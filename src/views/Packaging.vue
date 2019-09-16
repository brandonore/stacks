<template>
    <div class="package mx-3">
        <h3 class="mb-5 mt-3 secondary--text">Packaging</h3>
        <v-divider class="mb-5"></v-divider>
        <v-container fluid grid-list-xl>
            <v-layout wrap>
                <v-flex d-flex width="100%">
                    <v-card flat class="mx-auto" width="100%">
                        <v-toolbar color="pink" dark flat>
                            <v-toolbar-title>Slabs on Rack</v-toolbar-title>
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
                            :items="packageSlab"
                            :search="search"
                            class="pa-5"
                        >
                            <template v-slot:item.champagne="{ item }">
                                <v-chip small :color="getChampagne(item.champagne)" dark>{{ item.champagne }}</v-chip>
                            </template>
                            <template v-slot:item.action="{ item }">
                            <v-tooltip left>
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
                                            class=""
                                            @click="labelModal(item)"
                                        >
                                            fas fa-tag
                                        </v-icon>
                                    </template>
                                    <span>Mark as Labeled</span>
                                </v-tooltip>
                            </template>
                        </v-data-table>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-container>

        <!-- middle row -->
        <v-container fluid grid-list-xl>
            <v-layout wrap>
                <v-flex justify-center d-flex width="100%">
                    <v-icon class="arrow" color="grey lighten-1">far fa-angle-double-down</v-icon>
                </v-flex>
            </v-layout>
        </v-container>

        <!-- delivery table -->
        <v-container fluid grid-list-xl>
            <v-layout wrap>
                <v-flex d-flex width="100%">
                        <v-card class="mx-auto" width="100%" flat>
                            <v-toolbar color="cyan darken-1" dark flat>
                                <v-toolbar-title>Delivery Status</v-toolbar-title>
                                <v-spacer></v-spacer>
                            </v-toolbar>
                            <v-text-field
                                v-model="deliverySearch"
                                append-icon="far fa-search"
                                label="Search"
                                single-line
                                hide-details
                                class="pa-5"
                            ></v-text-field>
                            <v-data-table
                                :headers="deliveryHeaders"
                                :items="deliveryItems"
                                :items-per-page="10"
                                :search="deliverySearch"
                                class="mt-5 delivery-table"
                            >
                            <template v-slot:item="{ item }">
                                <tr :style="[item.readyToDeliver ? {'textDecoration': 'line-through', 'color': '#3cd1c2', 'backgroundColor': 'rgba(60,209,194, 0.2)', 'font-weight': 'bold' } : '']">
                                    <td>{{ item.shop }}</td>
                                    <td>{{ item.strain }}</td>
                                    <td>{{ item.productType }}</td>
                                    <td>{{ item.totalGrams }}</td>
                                    <td>{{ item.readyToDeliver }}</td>
                                    <td>
                                        <v-icon small class="mr-2" @click="markDelivered(item)">fas fa-check-circle</v-icon>
                                        <v-icon small class="mr-2" @click="confirmDeliveryModal(item.id)">fas fa-times</v-icon>
                                    </td>
                                </tr>
                            </template>
                            <template v-slot:item.action="{ item }">
                            <v-tooltip left>
                                <template v-slot:activator="{ on }">
                                    <v-icon
                                        v-on="on"
                                        small
                                        class="mr-2"
                                        @click="markDelivered(item)"
                                    >
                                        fas fa-check-circle
                                    </v-icon>
                                </template>
                                <span>Mark Delivered</span>
                                </v-tooltip>
                                <v-tooltip top>
                                    <template v-slot:activator="{ on }">
                                        <v-icon
                                            v-on="on"
                                            small
                                            @click="confirmDeliveryModal(item.id)"
                                        >
                                            fas fa-times
                                        </v-icon>
                                    </template>
                                    <span>Delete Item</span>
                                </v-tooltip>
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
                    <h3 class="secondary--text">Edit Slab</h3>
                </v-card-title>
                <v-card-text>
                    <v-form class="px-3" ref="form">
                        <v-text-field label="Shop" v-model="$v.editPackage.shop.$model" clearable></v-text-field>
                        <template v-if="$v.editPackage.shop.$error">
                            <span class="error--text" v-if="!$v.editPackage.shop.required">Value required</span>
                        </template>
                        <v-text-field label="Date Processed" v-model="$v.editPackage.processDate.$model" clearable></v-text-field>
                        <template v-if="$v.editPackage.processDate.$error">
                            <span class="error--text" v-if="!$v.packaging.processDate.required">Value required</span>
                        </template>
                        <v-text-field label="Strain" v-model="$v.editPackage.strain.$model" clearable></v-text-field>
                        <template v-if="$v.editPackage.strain.$error">
                            <span class="error--text" v-if="!$v.packaging.strain.required">Value required</span>
                        </template>
                        <v-text-field label="Shatter/Budder/Live/Sugar" v-model="$v.editPackage.productType.$model" clearable></v-text-field>
                        <template v-if="$v.editPackage.productType.$error">
                            <span class="error--text" v-if="!$v.packaging.productType.required">Value required</span>
                        </template>
                        <v-text-field label="METRC Tags (Last 4) Comma seperated list for multiple values" v-model="$v.editPackage.batch.$model" clearable></v-text-field>
                        <template v-if="$v.editPackage.batch.$error">
                            <span class="error--text" v-if="!$v.editPackage.batch.required">Value required</span>
                            <span class="error--text" v-if="!$v.editPackage.batch.minLength">4 digits required</span><br>
                        </template>
                        <v-text-field label="Weight In" v-model="$v.editPackage.weight.$model" clearable></v-text-field>
                        <template v-if="$v.editPackage.weight.$error">
                            <span class="error--text" v-if="!$v.editPackage.weight.required">Value required</span>
                            <span class="error--text" v-if="!$v.editPackage.weight.numeric">Numbers only</span>
                        </template>
                        <v-text-field label="Processor Initials" v-model="$v.editPackage.initials.$model" clearable></v-text-field>
                        <template v-if="$v.editPackage.initials.$error">
                            <span class="error--text" v-if="!$v.packaging.initials.required">Value required</span>
                        </template>
                        <v-text-field label="Total Grams" v-model="editPackage.totalGrams" clearable></v-text-field>
                        <v-text-field label="Sample Size" v-model="$v.editPackage.sample.$model" clearable></v-text-field>
                        <template v-if="$v.editPackage.sample.$error">
                            <span class="error--text" v-if="!$v.packaging.sample.required">Value required</span>
                        </template>
                        <v-text-field label="Test Type" v-model="$v.editPackage.testType.$model" clearable></v-text-field>
                        <template v-if="$v.editPackage.testType.$error">
                            <span class="error--text" v-if="!$v.packaging.testType.required">Value required</span>
                        </template>
                        <v-layout>
                            <v-flex xs12 sm6>
                                <v-text-field label="Date Packaged" class="mr-5" v-model="editPackage.packageDate" clearable></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm6>
                                <v-text-field label="Packager Initials" v-model="editPackage.packInitials" clearable></v-text-field>
                            </v-flex>
                        </v-layout>
                        <v-layout wrap>
                            <v-flex xs12 sm4>
                                <v-switch label="Champagne?" v-model="editPackage.champagne" color="primary" inset></v-switch>
                            </v-flex>
                            <v-flex xs12 sm8 class="text-right">
                                <v-btn class="mr-2 mt-3" depressed color="error" @click="reset">Clear</v-btn>
                                <v-btn class="mr-2 mt-3" outlined color="error" @click="edit_dialog = false">Cancel</v-btn>
                                <v-btn text class="mr-2 mt-3 success" @click="updateItem" :loading="loading">Update</v-btn>
                            </v-flex>
                        </v-layout>
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
        <!-- delete delivery dialog -->
        <template>
            <v-layout justify-center>
            <v-dialog v-model="delete_delivery_dialog" persistent max-width="350">
                <v-card class="pa-2">
                <v-card-title class="subtitle-1 font-weight-light">Are you sure you want to delete this item?</v-card-title>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" text @click="delete_delivery_dialog = false">Cancel</v-btn>
                    <v-btn color="success" text @click="deleteDeliveryItem">Yes</v-btn>
                </v-card-actions>
                </v-card>
            </v-dialog>
            </v-layout>
        </template>
        <!-- label dialog -->
        <template>
            <v-layout justify-center>
            <v-dialog v-model="label_dialog" persistent max-width="350">
                <v-card class="pa-2">
                <v-card-title class="subtitle-1 font-weight-light">Are you sure you want to mark {{ deliveryItem.strain }} as labeled?</v-card-title>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" text @click="label_dialog = false">Cancel</v-btn>
                    <v-btn color="success" text @click="moveToDelivery">Yes</v-btn>
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

const numeral = require('numeral')

export default {
name: 'package',
data() {
    return {
        selected: [],
        packageSlab: [],
        deliveryItems: [],
        deliveryItem: {},
        shopdata: [],
        editPackage: {
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
            packInitials: '',
            yield: null,
        },
        search: '',
        deliverySearch: '',
        edit_dialog: false,
        delete_dialog: false,
        delete_delivery_dialog: false,
        label_dialog: false,
        id: null,
        loading: null,
        headers: [
            { text: 'Shop Name', align: 'left', value: 'shop' },
            { text: 'Date Processed', value: 'processDate' },
            { text: 'Date on Rack', value: 'rackDate' },
            { text: 'Date Packaged', value: 'packageDate'},
            { text: 'Strain Name', value: 'strain' },
            { text: 'Shatter/Budder/Live/Sugar', value: 'productType' },
            { text: 'Champagne?', value: 'champagne' },
            { text: 'METRC Tag (Last 4)', value: 'batch' },
            { text: 'Weight In (g)', value: 'weight' },
            { text: 'Processor Initials', value: 'initials' },
            { text: 'Total Grams', value: 'totalGrams' },
            { text: 'Sample Size', value: 'sample' },
            { text: 'Test Type', value: 'testType' },
            { text: 'Packager Initials', value: 'packInitials' },
            { text: 'Yield', value: 'yield'},
            { text: 'Actions', value: 'action' }
        ],
        deliveryHeaders: [
            { text: 'Shop Name', align: 'left', value: 'shop' },
            { text: 'Strain Name', value: 'strain' },
            { text: 'Shatter/Budder/Live/Sugar', value: 'productType' },
            { text: 'Total Grams', value: 'totalGrams' },
            { text: 'Ready to Deliver', value: 'readyToDeliver' },
            { text: 'Actions', value: 'action' }
        ]
    }
},
validations: {
        editPackage: {
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
        labelModal(item) {
            this.deliveryItem = Object.assign({}, item)
            this.deliveryItem['readyToDeliver'] = false
            this.label_dialog = true
        },
        moveToDelivery() {
            this.$db.collection('users').doc(this.user.uid).collection('delivery').add(this.deliveryItem).then(() => {
                this.label_dialog = false
            })
        },
        markDelivered(item) {
            !item.readyToDeliver ? item.readyToDeliver = true : item.readyToDeliver = false
            this.$db.collection('users').doc(this.user.uid).collection('delivery').doc(item.id).update({'readyToDeliver': item.readyToDeliver})
                .then(() => {
                    console.log('Item marked as delivered')
                }).catch((err) => {
                    console.log(err)
                })
        },
        calcYield(grams, weight) {
            return grams / weight
        },
        confirmModal(id) {
            this.delete_dialog = true
            this.id = id
        },
        confirmDeliveryModal(id) {
            this.delete_delivery_dialog = true
            this.id = id
        },
        deleteItem() {
            this.$db.collection('users').doc(this.user.uid).collection('packaging').doc(this.id).delete()
            this.id = null
            this.delete_dialog = false
        },
        deleteDeliveryItem() {
            this.$db.collection('users').doc(this.user.uid).collection('delivery').doc(this.id).delete()
            this.id = null
            this.delete_delivery_dialog = false
        },
        editItem(item) {
            this.editPackage = Object.assign({}, item)
            this.edit_dialog = true
        },
        updateItem() {
            this.editPackage.weight = Number(this.editPackage.weight)
            this.editPackage.totalGrams = Number(this.editPackage.totalGrams)
            this.editPackage.yield = numeral(this.editPackage.totalGrams / this.editPackage.weight).format('0.00%')
            this.$db.collection('users').doc(this.user.uid).collection('packaging').doc(this.editPackage.id).update(this.editPackage)
            .then(() => {
                this.edit_dialog = false
            }).catch((err) => {
                console.log(err)
            })
            this.$root.$emit('set-snackbar', 'editItem')
        },
        getChampagne(item) {
            if(item === true) return 'champagne'
            else return 'secondary'
        },
        reset () {
            this.$refs.form.reset()
        }
    },
    computed: {
        ...mapState(['user'])
    },
    created() {
        this.$db.collection('users').doc(this.user.uid).collection('packaging').onSnapshot((res) => {
            const changes = res.docChanges()
            changes.forEach((change) => {
                if(change.type === 'added') {
                    this.packageSlab.push({
                        ...change.doc.data(),
                        id: change.doc.id
                    })
                } else if(change.type === 'removed') {
                    this.packageSlab = this.packageSlab.filter((item) => {
                        return item.id != change.doc.id
                    })
                } else if(change.type === 'modified') {
                    this.packageSlab = this.packageSlab.filter((item) => {
                        return item.id != change.doc.id
                    }) 
                    this.packageSlab.push({
                        ...change.doc.data()
                    })
                }
            })
        }),
        this.$db.collection('users').doc(this.user.uid).collection('delivery').onSnapshot((res) => {
            const changes = res.docChanges()
            changes.forEach((change) => {
                if(change.type === 'added') {
                    this.deliveryItems.push({
                        ...change.doc.data(),
                        id: change.doc.id
                    })
                } else if(change.type === 'removed') {
                    this.deliveryItems = this.deliveryItems.filter((item) => {
                        return item.id != change.doc.id
                    })
                } else if(change.type === 'modified') {
                    this.deliveryItems = this.deliveryItems.filter((item) => {
                        return item.id != change.doc.id
                    }) 
                    this.deliveryItems.push({
                        ...change.doc.data()
                    })
                }
            })
        })
    }
}
</script>

<style scoped>
    .strike {
        text-decoration: line-through;
    }
    .arrow {
        font-size: 2rem;
    }
    .form-switch {
        padding-left: 8rem;
    }
    .delivered {
        border-left: 5px solid #3cd1c2 !important;
        color: white;
    }
    .not-delivered {
        border: none;
        color: rgba(0, 0, 0, 0.87)
    }
</style>
