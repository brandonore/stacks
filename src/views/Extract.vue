<template>
    <div class="extract mx-3">
        <h3 class="mb-4 secondary--text">Extraction</h3>
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
                :items="extract"
                item-key="id"
                show-expand
                single-expand="true"
            >
                <template v-slot:top>
                    <v-toolbar flat color="white">
                        <v-toolbar-title>Extraction</v-toolbar-title>
                        <v-spacer></v-spacer>
                    </v-toolbar>
                </template>
                <template v-slot:item.action="{ item }">
                    <v-icon
                        small
                        class="mr-2"
                        @click="moveExtractItem(item)"
                    >
                        far fa-arrow-to-right
                    </v-icon>
                    <v-icon
                        small
                        class="mr-2"
                        @click="editExtract(item)"
                    >
                        far fa-edit
                    </v-icon>
                    <v-icon
                        small
                        @click="deleteItem(item.id)"
                        v-on="on"
                    >
                        far fa-times-square
                    </v-icon>
                </template>
                <template v-slot:expanded-item="{ item }">
                    <td :colspan="headers.length + 1">{{ item.notes }}</td>
                </template>
            </v-data-table>
        </v-card>
    </div>
</template>

<script>
import db from '@/firebase'
// import { required, numeric, minLength } from 'vuelidate/lib/validators'
import format from 'date-fns/format'

export default {
    name: 'extract',
    data() {
        return {
            extract: [],
            editExtract: {},
            search: '',
            edit_dialog: false,
            delete_dialog: false,
            id: null,
            headers: [
                { text: 'Shop Name', align: 'left', value: 'shop' },
                { text: 'Manifest Date', value: 'manifestdate' },
                { text: 'Process Date', value: 'procdate' },
                { text: 'Processor Initials', value: 'procinitials' },
                { text: 'Strain Name', value: 'strain' },
                { text: 'METRC Tag (Last 4)', value: 'batch' },
                { text: 'Weight In (g)', value: 'weight' },
                { text: 'Waste Out', value: 'waste' },
                { text: 'Trim/Bud/Live', value: 'trimtype' },
                { text: 'Shatter/Budder/Live/Sugar *Note if champagne', value: 'type' },
                { text: 'BHO/BPHO', value: 'gas' },
                { text: 'Failed?', value: 'failed' },
                { text: 'Rerun?', value: 'rerun' },
                { text: 'Actions', value: 'action' }
            ]
        }
    },
    methods: {
        moveExtractItem(item) {

        },
        editItem(item) {
            this.editExtract = Object.assign({}, item)
            this.edit_dialog = true
        },
        updateItem() {
            db.collection('trim').doc(this.editExtract.id).update(this.editExtract)
            .then(() => {
                this.edit_dialog = false
            })
        },
        confirmModal(id) {
            this.delete_dialog = true
            this.id = id
        },
        deleteItem() {
            db.collection('extract').doc(this.id).delete()
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
        db.collection('extract').onSnapshot((res) => {
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
        color: white;
    }
</style>
