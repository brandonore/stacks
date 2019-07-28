<template>
    <div class="trim mx-3">
        <h3 class="mb-4 secondary--text">Available Trim</h3>
        <v-divider class="mb-5"></v-divider>
        <v-card flat>
            <v-card-title>
            Trim on hand
            <v-spacer></v-spacer>
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
            :items="trim"
            :search="search"
            >
            <template v-slot:item.failed="{ item }">
            <v-chip small :color="getColor(item.failed)" dark>{{ item.failed }}</v-chip>
            </template>
            <template v-slot:item.action="{ item }">
            <v-icon
                small
                class="mr-2"
                @click="editItem(item)"
            >
                far fa-edit
            </v-icon>
            <v-icon
                small
                @click="confirmModal(item.id)"
                v-on="on"
            >
                far fa-times-square
            </v-icon>
            </template>
        </v-data-table>
        </v-card>
        <!-- {{ editTrim }}
        {{ typeof(editTrim.date) }} -->
        <!-- edit dialog -->
        <template>
            <v-layout justify-center>
            <v-dialog max-width="650" v-model="edit_dialog">
                <v-card>
                <v-card-title class="mb-5">
                    <h3 class="secondary--text">Add Trim/Incoming Package</h3>
                </v-card-title>
                <v-card-text>
                    <v-form class="px-3" ref="form">
                        <v-text-field label="Shop" v-model="editTrim.shop" clearable></v-text-field>
                        <v-text-field label="License #" v-model="editTrim.license"></v-text-field>
                        <v-text-field label="Manifest #" v-model="editTrim.manifest" clearable></v-text-field>
                        <v-text-field label="METRC Tags (Last 4) Comma seperated list for multiple values" v-model="editTrim.batch" clearable></v-text-field>
                        <!-- <template v-if="$v.editTrim.batch.$error">
                            <p class="error--text" v-if="!$v.editTrim.batch.required">Value required</p>
                            <p class="error--text" v-if="!$v.editTrim.batch.minLength">4 digits required</p>
                        </template> -->
                        <v-text-field label="Strain" v-model="editTrim.strain" clearable></v-text-field>
                        <v-text-field label="Weight (g)" v-model.trim="editTrim.weight" clearable></v-text-field>
                        <v-text-field label="Trim/Bud/Live" v-model="editTrim.type" clearable></v-text-field>
                        <v-text-field label="Input Date" v-model="editTrim.date" clearable></v-text-field>
                        <v-layout row wrap>
                            <v-flex xs12 sm4>
                                <v-switch label="Failed?" v-model="editTrim.failed" color="primary"></v-switch>
                            </v-flex>
                            <v-flex xs12 sm8 class="text-right">
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
                <v-card>
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
// import { required, numeric, minLength } from 'vuelidate/lib/validators'
import format from 'date-fns/format'

export default {
name: 'trim',
data() {
    return {
        trim: [],
        shopdata: [],
        editTrim: {
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
        search: '',
        edit_dialog: false,
        delete_dialog: false,
        id: null,
        headers: [
            { text: 'Shop Name', align: 'left', value: 'shop' },
            { text: 'License #', value: 'license' },
            { text: 'Date', value: 'date' },
            { text: 'Manifest #', value: 'manifest' },
            { text: 'METRC Tag (Last 4)', value: 'batch' },
            { text: 'Strain Name', value: 'strain' },
            { text: 'Weight (g)', value: 'weight' },
            { text: 'Failed?', value: 'failed' },
            { text: 'Trim/Bud/Live', value: 'type' },
            { text: 'Actions', value: 'action', sortable: false },
        ]
    }
},
// validations: {
//     trim: {
//         weight: {
//             required,
//             numeric
//         },
//         batch: {
//             required,
//             minLength: minLength(4)
//         }
//     }
// },
methods: {
    editItem(item) {
        this.editTrim = Object.assign({}, item)
        this.edit_dialog = true
    },
    updateItem() {
        db.collection('trim').doc(this.editTrim.id).update(this.editTrim)
        .then(() => {
            this.edit_dialog = false
        })
    },
    confirmModal(id) {
        this.delete_dialog = true
        this.id = id
    },
    deleteItem() {
        db.collection('trim').doc(this.id).delete()
        this.id = null
        this.delete_dialog = false
    },
    getColor(item) {
        if(item === true) return 'error'
        else return 'success'
    },
    reset () {
        this.$refs.form.reset()
    },
},
created() {
    db.collection('trim').onSnapshot((res) => {
        const changes = res.docChanges()
        changes.forEach((change) => {
            if(change.type === 'added') {
                this.trim.push({
                    ...change.doc.data(),
                    id: change.doc.id
                })
            } else if(change.type === 'removed') {
                this.trim = this.trim.filter((item) => {
                    return item.id != change.doc.id
                })
            } else if(change.type === 'modified') {
                this.trim = this.trim.filter((item) => {
                return item.id != change.doc.id
                }) 
                this.trim.push({
                ...change.doc.data()
                })
            }
        })
    })
}
}
</script>