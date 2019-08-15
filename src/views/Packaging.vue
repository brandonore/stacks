<template>
    <div class="package mx-3">
        <h3 class="mb-5 mt-3 secondary--text">Packaging</h3>
        <v-divider class="mb-5"></v-divider>
        <v-container fluid grid-list-xl>
            <v-layout wrap>
                <v-flex d-flex width="100%">
                    <v-card flat class="pa-5" width="100%">
                        <v-card-title class="mb-5">
                            <v-text-field
                                v-model="search"
                                append-icon="far fa-search"
                                label="Search"
                                single-line
                                hide-details
                            ></v-text-field>
                        </v-card-title>
                        <v-data-table
                            :headers="headers"
                            :items="packageSlab"
                            :search="search"
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
                                            @click="labelModal(item.id)"
                                        >
                                            fas fa-tag
                                        </v-icon>
                                    </template>
                                    <span>Labeled?</span>
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
                            <v-btn icon>
                                <v-icon>fal fa-times</v-icon>
                            </v-btn>
                            </v-toolbar>
                            <v-data-table
                                :headers="deliveryHeaders"
                                :items="deliveryItems"
                                :items-per-page="5"
                                class="mt-5"
                            >
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
                                            @click="deleteDeliveryModal(item.id)"
                                        >
                                            fas fa-times
                                        </v-icon>
                                    </template>
                                    <span>Delete Item</span>
                                </v-tooltip>
                            </template>
                            </v-data-table>
                            
                            <!-- <v-list two-line>
                            <v-list-item-group
                                v-model="selected"
                                multiple
                                color="success"
                            >
                                <template v-for="(item, index) in items">
                                    <v-list-item :key="item.title">
                                        <template v-slot:default="{ active, toggle }">
                                        <v-list-item-content>
                                            <v-list-item-title v-text="item.title"></v-list-item-title>
                                            <v-list-item-subtitle class="text--primary" v-text="item.headline"></v-list-item-subtitle>
                                            <v-list-item-subtitle v-text="item.subtitle"></v-list-item-subtitle>
                                        </v-list-item-content>
                                        <v-list-item-action>
                                            <v-list-item-action-text v-text="item.action"></v-list-item-action-text>
                                                <v-icon
                                                    v-if="!active"
                                                    color="grey lighten-1"
                                                >
                                                    fal fa-check-circle
                                                </v-icon>
                                                <v-icon
                                                    v-else
                                                    color="success"
                                                >
                                                    fas fa-check-circle
                                                </v-icon>
                                        </v-list-item-action>
                                        </template>
                                    </v-list-item>
                                    <v-divider
                                        v-if="index + 1 < items.length"
                                        :key="index"
                                    ></v-divider>
                                </template>
                            </v-list-item-group>
                            </v-list> -->
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
                        <v-text-field label="Shop" v-model="editPackage.shop" clearable></v-text-field>
                        <!-- <template v-if="$v.editTrim.shop.$error">
                            <span class="error--text" v-if="!$v.editTrim.shop.required">Value required</span>
                        </template> -->
                        <v-text-field label="Date Processed" v-model="editPackage.processDate" clearable></v-text-field>
                        <v-text-field label="Strain" v-model="editPackage.strain" clearable></v-text-field>
                        <v-text-field label="Shatter/Budder/Live/Sugar" v-model="editPackage.productType" clearable></v-text-field>
                        <v-text-field label="Champagne" v-model="editPackage.champagne" clearable></v-text-field>
                        <v-text-field label="Weight In" v-model="editPackage.weight" clearable></v-text-field>
                        <v-text-field label="Processor Initials" v-model="editPackage.initials" clearable></v-text-field>
                        <v-text-field label="Total Grams" v-model="editPackage.totalGrams" clearable></v-text-field>
                        <v-text-field label="Sample Size" v-model="editPackage.sample" clearable></v-text-field>
                        <v-text-field label="Test Type" v-model="editPackage.testType" clearable></v-text-field>
                        <v-layout>
                            <v-flex xs12 sm6>
                                <v-text-field label="Date Packaged" class="mr-5" v-model="editPackage.packageDate" clearable></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm6>
                                <v-text-field label="Packager Initials" v-model="editPackage.packInitials" clearable></v-text-field>
                            </v-flex>
                        </v-layout>
                        <v-layout wrap>
                            <v-flex xs12 class="text-center">
                                <v-btn class="mr-2 mt-3" outlined color="error" @click="reset">Clear</v-btn>
                                <v-btn class="mr-2 mt-3" outlined color="success" @click="edit_dialog = false">Cancel</v-btn>
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
        <!-- label dialog -->
        <template>
            <v-layout justify-center>
            <v-dialog v-model="label_dialog" persistent max-width="350">
                <v-card class="pa-2">
                <v-card-title class="subtitle-1 font-weight-light">Are you sure you want to mark this as labeled?</v-card-title>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" text @click="label_dialog = false">Cancel</v-btn>
                    <v-btn color="success" text @click="moveToDelivery">Yes</v-btn>
                </v-card-actions>
                </v-card>
            </v-dialog>
            </v-layout>
        </template>
        {{ packageSlab }}
    </div>
</template>

<script>
import db from '@/firebase'
import { required, numeric, minLength } from 'vuelidate/lib/validators'
import format from 'date-fns/format'

const numeral = require('numeral')

export default {
name: 'package',
data() {
    return {
        selected: [],
        packageSlab: [],
        deliveryItems: [
            { shop: 'Allgreens', strain: 'Kong', productType: 'Shatter', totalGrams: 128 },
            { shop: 'Allgreens', strain: 'Agent Orange', productType: 'Shatter', totalGrams: 86 },
            { shop: 'Herbal Healing', strain: 'Think Fast', productType: 'Shatter', totalGrams: 436 },
            { shop: 'Dankery', strain: 'Blue Drea', productType: 'Live', totalGrams: 225 },
            { shop: 'American Wholesale', strain: 'London Pound Cake', productType: 'Budder', totalGrams: 187 },
            {  }
        ],
        // items: [
        //     {
        //     // action: '15 min',
        //     title: 'Allgreens',
        //     subtitle: "Kong | Shatter | 120g | 2249",
        //     },
        //     {
        //     // action: '15 min',
        //     title: 'Allgreens',
        //     subtitle: "Kong | Shatter | 120g | 2249",
        //     },
        //     {
        //     // action: '15 min',
        //     title: 'Allgreens',
        //     subtitle: "Kong | Shatter | 120g | 2249",
        //     },
        //     {
        //     // action: '15 min',
        //     title: 'Allgreens',
        //     subtitle: "Kong | Shatter | 120g | 2249",
        //     },
            
        // ],
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
        edit_dialog: false,
        delete_dialog: false,
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
            { text: 'Actions', value: 'action' }
        ]
    }
},
// validations: {
//         editTrim: {
//             shop: {
//                 required
//             },
//             license: {
//                 required
//             },
//             manifest: {
//                 required
//             },
//             strain: {
//                 required
//             },
//             weight: {
//                 required,
//                 numeric
//             },
//             batch: {
//                 required,
//                 minLength: minLength(4),
//                 numeric
//             },
//             type: {
//                 required
//             },
//             date: {
//                 required
//             }
//         }
//     },
    methods: {
        moveToDelivery() {
            // move slab to delivery table
        },
        calcYield(grams, weight) {
            return grams / weight
        },
        confirmModal(id) {
            this.delete_dialog = true
            this.id = id
        },
        labelModal(id) {
            this.label_dialog = true
            this.id = id
        },
        deleteItem() {
            db.collection('packaging').doc(this.id).delete()
            this.id = null
            this.delete_dialog = false
        },
        editItem(item) {
            this.editPackage = Object.assign({}, item)
            this.edit_dialog = true
        },
        updateItem() {
            this.editPackage.weight = Number(this.editPackage.weight)
            this.editPackage.totalGrams = Number(this.editPackage.totalGrams)
            this.editPackage.yield = numeral(this.editPackage.totalGrams / this.editPackage.weight).format('0.00%')
            db.collection('packaging').doc(this.editPackage.id).update(this.editPackage)
            .then(() => {
                this.edit_dialog = false
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
    created() {
        db.collection('packaging').onSnapshot((res) => {
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
</style>
