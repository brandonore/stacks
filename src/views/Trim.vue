<template>
    <div class="trim">
        <h1 class="mb-4">Trim on hand</h1>
        <v-divider class="mb-4"></v-divider>
        <v-card>
            <v-card-title>
                Available Trim
                <v-spacer></v-spacer>
                <v-text-field
                    v-model="search"
                    append-icon="search"
                    label="Search"
                    single-line
                    hide-details
                ></v-text-field>
            </v-card-title>
            <v-data-table :headers="headers" :items="trim" :search="search" class="elevation-1 mt-4">
                <template v-slot:items="props">
                    <td>{{ props.item.shop }}</td>
                    <td class="text-xs-right">{{ props.item.license }}</td>
                    <td class="text-xs-right">{{ props.item.date }}</td>
                    <td class="text-xs-right">{{ props.item.manifest }}</td>
                    <td class="text-xs-right">{{ props.item.batch }}</td>
                    <td class="text-xs-right">{{ props.item.strain }}</td>
                    <td class="text-xs-right">{{ props.item.weight }}</td>
                    <td class="text-xs-right"><v-chip small :class="`${props.item.failed} white--text`">{{ props.item.failed }}</v-chip></td>
                    <td class="text-xs-right">{{ props.item.type }}</td>
                    <td class="justify-center layout px-0">
                        <v-icon small class="mr-3" @click="test(props.item.id)">far fa-edit</v-icon>
                        <v-icon small @click="deleteItem(props.item.id)">far fa-times-square</v-icon>
                    </td>
                </template>
                <template v-slot:no-results>
                    <v-alert :value="true" color="error" icon="far fa-exclamation-circle" class="text-xs-center">
                        Your search for "{{ search }}" found no results. 😵
                    </v-alert>
                </template>
            </v-data-table>
        </v-card>
    </div>
</template>

<script>
import db from '@/firebase'

export default {
    name: 'trim',
    data() {
        return {
            trim: [],
            search: '',
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
    methods: {
        test(prop) {
            alert(prop)
        },
        deleteItem(id) {
            db.collection('trim').doc(id).delete()
        }
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
                }
            })
        })
    }
}
</script>

<style scoped>
    .false {
        background-color: #3cd1c2;
    }
    .true {
        background-color: #f83e70;
    }
</style>
