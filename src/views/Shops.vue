<template>
    <div class="shops mx-3">
        <h3 class="mb-5 mt-3 secondary--text">Current Shops</h3>
        <v-divider class="mb-5"></v-divider>
        <v-container fluid grid-list-xl>
            <v-layout wrap>
                <v-flex d-flex width="100%">
                    <v-card flat class="mx-auto" width="100%">
                        <v-toolbar color="deep-purple lighten-1" dark flat>
                            <v-toolbar-title>Shop Data</v-toolbar-title>
                            <v-spacer></v-spacer>
                        </v-toolbar>
                        <!-- <v-card-title class="mb-5">
                            <v-text-field
                                v-model="search"
                                append-icon="far fa-search"
                                label="Search"
                                single-line
                                hide-details
                            ></v-text-field>
                        </v-card-title> -->
                        <v-data-iterator
                            :items="shops"
                            :items-per-page.sync="itemsPerPage"
                            :footer-props="{ itemsPerPageOptions }"
                        >
                            <template v-slot:default="props">
                                <v-row class="px-5 mt-5">
                                    <v-col
                                        v-for="item in props.items"
                                        :key="item.name"
                                        cols="12"
                                        sm="6"
                                        md="4"
                                        lg="3"
                                    >
                                        <v-card outlined hover class="pa-2">
                                            <v-card-title><h6>{{ item.shopname }}</h6></v-card-title>
                                            <v-divider></v-divider>
                                            <v-card-text>License: {{ item.license }}</v-card-text>                                          
                                            <v-card-actions align="end">
                                                <v-icon small class="mr-2" @click="editItem(item)">fas fa-pencil</v-icon>
                                                <v-icon small @click="confirmModal(item.id)">fas fa-times</v-icon>
                                            </v-card-actions>
                                        </v-card>
                                    </v-col>
                                </v-row>
                            </template>
                        </v-data-iterator>
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
                    <h3 class="secondary--text">Edit Shop</h3>
                </v-card-title>
                <v-card-text>
                    <v-form class="px-3" ref="form">
                        <v-text-field label="Shop" v-model="$v.editShop.shopname.$model" clearable></v-text-field>
                        <template v-if="$v.editShop.shopname.$error">
                            <span class="error--text" v-if="!$v.editShop.shopname.required">Value required</span>
                        </template>
                        <v-text-field label="License #" v-model="$v.editShop.license.$model" clearable></v-text-field>
                        <template v-if="$v.editShop.license.$error">
                            <span class="error--text" v-if="!$v.editShop.license.required">Value required</span>
                        </template>
                        <v-layout row wrap>
                            <v-flex xs12 class="text-center">
                                <v-btn class="mr-2 mt-3" depressed color="error" @click="reset($v)">Clear</v-btn>
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
                <v-card-title class="subtitle-1 font-weight-light">Are you sure you want to delete the shop?</v-card-title>
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
import { required } from 'vuelidate/lib/validators'
import format from 'date-fns/format'

export default {
name: 'shops',
data() {
    return {
        shops: [],
        shopdata: [],
        itemsPerPageOptions: [4, 8, 12, 16, 20, 24],
        itemsPerPage: 24,
        editShop: {
            shopname: '',
            license: '',
        },
        search: '',
        edit_dialog: false,
        delete_dialog: false,
        id: null,
        loading: null,
    }
},
validations: {
        editShop: {
            shopname: {
                required
            },
            license: {
                required
            }
        }
    },
methods: {
    editItem(item) {
        this.editShop = Object.assign({}, item)
        this.edit_dialog = true
    },
    updateItem() {
        db.collection('shopdata').doc(this.editShop.id).update(this.editShop)
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
        db.collection('shopdata').doc(this.id).delete()
        this.id = null
        this.delete_dialog = false
    },
    reset ($v) {
            this.$refs.form.reset()
            this.loading = false
            $v.$reset()
    },
},
created() {
    db.collection('shopdata').onSnapshot((res) => {
        const changes = res.docChanges()
        changes.forEach((change) => {
            if(change.type === 'added') {
                this.shops.push({
                    ...change.doc.data(),
                    id: change.doc.id
                })
            } else if(change.type === 'removed') {
                this.shops = this.shops.filter((item) => {
                    return item.id != change.doc.id
                })
            } else if(change.type === 'modified') {
                this.shops = this.shops.filter((item) => {
                return item.id != change.doc.id
                }) 
                this.shops.push({
                ...change.doc.data()
                })
            }
        })
    })
}
}
</script>