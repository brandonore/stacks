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
                :expanded.sync="expanded"
                item-key="name"
                show-expand
                :single-expand="singleExpand"
                class="elevation-1"
            >
                <template v-slot:top>
                    <v-toolbar flat color="white">
                        <v-toolbar-title>Extraction</v-toolbar-title>
                        <v-spacer></v-spacer>
                    </v-toolbar>
                </template>
                <template v-slot:expanded-item="{ item }">
                    <td :colspan="headers.length">{{ item.notes }}</td>
                </template>
            </v-data-table>
        </v-card>
        <!-- {{ extract.doc[0].id }} -->
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
            expanded: [],
            singleExpand: true,
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
