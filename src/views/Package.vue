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
                            :items="packageItem"
                            :search="search"
                        >
                            <template v-slot:item.failed="{ item }">
                                <v-chip small :color="getColor(item.failed)" dark>{{ item.failed }}</v-chip>
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
                            </template>
                        </v-data-table>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-container>
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
    </div>
</template>

<script>
import db from '@/firebase'
import { required, numeric, minLength } from 'vuelidate/lib/validators'
import format from 'date-fns/format'

export default {
name: 'package',
data() {
    return {
        packageItem: [],
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
            yield: null
        },
        search: '',
        edit_dialog: false,
        delete_dialog: false,
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
        ]
    }
},
validations: {
        editTrim: {
            shop: {
                required
            },
            license: {
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
                numeric
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
        calcYield(grams, weight) {
            return grams / weight
        },
        confirmModal(id) {
            this.delete_dialog = true
            this.id = id
        },
        deleteItem() {
            db.collection('packaging').doc(this.id).delete()
            this.id = null
            this.delete_dialog = false
        },
    },
    created() {
        db.collection('packaging').onSnapshot((res) => {
            const changes = res.docChanges()
            changes.forEach((change) => {
                if(change.type === 'added') {
                    this.packageItem.push({
                        ...change.doc.data(),
                        id: change.doc.id
                    })
                } else if(change.type === 'removed') {
                    this.packageItem = this.packageItem.filter((item) => {
                        return item.id != change.doc.id
                    })
                } else if(change.type === 'modified') {
                    this.packageItem = this.packageItem.filter((item) => {
                    return packageItem.id != change.doc.id
                    }) 
                    this.packageItem.push({
                    ...change.doc.data()
                    })
                }
            })
        })
    }
}
</script>

