<template>
    <div class="dashboard mx-3">
        <h3 class="mb-5 mt-3 secondary--text">Dashboard</h3>
        <v-divider class="mb-5"></v-divider>
        <v-container fluid grid-list-xl>
            <!-- home row -->
            <v-layout wrap class="home-row">
                <v-flex d-flex width="100%" xs12 sm6 md4>
                    <v-card flat class="pa-5" width="100%">
                        <h4 class="mb-3 grey--text font-weight-regular text-uppercase">Overview Breakdown</h4>
                        <v-divider class="mb-5"></v-divider>
                        <template>
                            <v-list-item>
                                <template>
                                    <v-list-item-content>
                                        <v-list-item-title class="secondary--text">Package count</v-list-item-title>
                                    </v-list-item-content>
                                </template>
                                <v-spacer></v-spacer>
                                <template>
                                    <v-list-item-content class="text-right">
                                        <h3 class="grey--text text--darken-2 font-weight-regular">{{ packageCount }}</h3>
                                    </v-list-item-content>
                                </template>
                            </v-list-item>
                            <v-list-item>
                                <template>
                                    <v-list-item-content>
                                        <v-list-item-title class="secondary--text">Total trim weight</v-list-item-title>
                                    </v-list-item-content>
                                </template>
                                <template>
                                    <v-list-item-content class="text-right">
                                        <h3 class="grey--text text--darken-2 font-weight-regular">{{ `${formatWeight(trimWeight)} (g)` }}</h3>
                                    </v-list-item-content>
                                </template>
                            </v-list-item>
                            <v-list-item>
                                <template>
                                    <v-list-item-content>
                                        <v-list-item-title class="secondary--text">Slabs on rack</v-list-item-title>
                                    </v-list-item-content>
                                </template>
                                <template>
                                    <v-list-item-content class="text-right">
                                        <h3 class="grey--text text--darken-2 font-weight-regular">{{ slabsOnRack }}</h3>
                                    </v-list-item-content>
                                </template>
                            </v-list-item>
                            <v-list-item>
                                <template>
                                    <v-list-item-content>
                                        <v-list-item-title class="secondary--text">Slabs ready for label</v-list-item-title>
                                    </v-list-item-content>
                                </template>
                                <template>
                                    <v-list-item-content class="text-right">
                                        <h3 class="grey--text text--darken-2 font-weight-regular">0</h3>
                                    </v-list-item-content>
                                </template>
                            </v-list-item>
                            <v-list-item>
                                <template>
                                    <v-list-item-content>
                                        <v-list-item-title class="secondary--text">Total grams packaged</v-list-item-title>
                                    </v-list-item-content>
                                </template>
                                <template>
                                    <v-list-item-content class="text-right">
                                        <h3 class="grey--text text--darken-2 font-weight-regular">0</h3>
                                    </v-list-item-content>
                                </template>
                            </v-list-item>
                            <v-list-item>
                                <template>
                                    <v-list-item-content>
                                        <v-list-item-title class="secondary--text">Total waste</v-list-item-title>
                                    </v-list-item-content>
                                </template>
                                <template>
                                    <v-list-item-content class="text-right">
                                        <h3 class="grey--text text--darken-2 font-weight-regular">{{ `${formatWeight(extractWaste)} (g)` }}</h3>
                                    </v-list-item-content>
                                </template>
                            </v-list-item>
                        </template>
                    </v-card>
                </v-flex>
                <v-flex d-flex xs12 sm6 md8>
                    <v-card flat class="pa-5" width="100%">
                        <v-card-text>
                            <LineChart :chartdata="planetChartData.data" :options="planetChartData.options" />
                        </v-card-text>
                    </v-card>
                </v-flex>
            </v-layout>
            <!-- secondary row -->
            <v-layout wrap class="secondary-row">
                <v-flex d-flex xs12 sm6>
                    <v-card flat class="pa-5" width="100%">
                        <BarChart :chartdata="barChartData.data" :options="barChartData.options" />
                    </v-card>
                </v-flex>
                <v-flex d-flex xs12 sm6>
                    <v-card flat class="pa-5" width="100%">
                        <DoughnutChart :chartdata="doughnutChartData.data" :options="doughnutChartData.options" />
                    </v-card>
                </v-flex>
            </v-layout>
        </v-container>
    </div>
</template>

<script>
import db from '../firebase'
import LineChart from '@/components/LineChart'
import BarChart from '@/components/BarChart'
import DoughnutChart from '@/components/DoughnutChart'
import planetChartData from '@/chart1'
import barChartData from '@/chart2'
import doughnutChartData from '@/doughnut-chart'

const numeral = require('numeral')

export default {
    name: 'dashboard',
    components: {
        LineChart,
        BarChart,
        DoughnutChart
    },
    data() {
        return {
            trim: [],
            extract: [],
            packaging: [],
            planetChartData,
            barChartData,
            doughnutChartData,
            height: 400
        }
    },
    methods: {
        formatWeight(weight) {
            let val = numeral(weight).format('0,0')
            return val
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
                }
            })
        }),
        db.collection('extract').onSnapshot((res) => {
            const changes = res.docChanges()
            changes.forEach((change) => {
                if(change.type === 'added') {
                    this.extract.push({
                        ...change.doc.data(),
                        id: change.doc.id
                    })
                }
            })
        }),
        db.collection('packaging').onSnapshot((res) => {
            const changes = res.docChanges()
            changes.forEach((change) => {
                if(change.type === 'added') {
                    this.packaging.push({
                        ...change.doc.data(),
                        id: change.doc.id
                    })
                }
            })
        })
    },
    computed: {
        packageCount() {
            return this.trim.reduce((total, item) => {
                return total + item.batch.split(',').length
            }, 0)
        },
        trimWeight() {
            return this.trim.reduce((total, item) => {
                return total + item.weight
            }, 0)
        },
        slabsOnRack() {
            return this.packaging.length
        },
        extractWaste() {
            return this.extract.reduce((total, item) => {
                return total + item.waste
            }, 0)
        }
    }
}
</script>

<style>
    .test-card {
        border-top: 3px solid #5969FF;
        border-radius: 6px;
    }
</style>