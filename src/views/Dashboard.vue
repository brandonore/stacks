<template>
<div class="dashboard mx-3">
    <h3 class="mb-4 secondary--text">Dashboard</h3>
    <v-divider class="mb-5"></v-divider>
        <v-container fluid grid-list-xl>
            <v-layout wrap class="home-row">
                <v-flex d-flex width="100%" xs12 sm6 md4>
                    <v-card flat class="pa-5" width="100%">
                        <h4 class="mb-3 grey--text font-weight-regular text-uppercase">Overview Breakdown</h4>
                        <v-divider class="mb-5"></v-divider>
                        <template>
                            <v-list-item>
                                <template>
                                    <v-list-item-content>
                                        <v-list-item-title>Package count</v-list-item-title>
                                    </v-list-item-content>
                                </template>
                                <template>
                                    <v-list-item-content class="text-right">
                                        <v-list-item-title>{{ packageCount }}</v-list-item-title>
                                    </v-list-item-content>
                                </template>
                            </v-list-item>
                            <v-list-item>
                                <template>
                                    <v-list-item-content>
                                        <v-list-item-title>Total trim weight</v-list-item-title>
                                    </v-list-item-content>
                                </template>
                                <template>
                                    <v-list-item-content class="text-right">
                                        <v-list-item-title>{{ `${formatWeight(trimWeight)} (g)` }}</v-list-item-title>
                                    </v-list-item-content>
                                </template>
                            </v-list-item>
                            <v-list-item>
                                <template>
                                    <v-list-item-content>
                                        <v-list-item-title>Slabs on rack</v-list-item-title>
                                    </v-list-item-content>
                                </template>
                                <template>
                                    <v-list-item-content class="text-right">
                                        <v-list-item-title>8</v-list-item-title>
                                    </v-list-item-content>
                                </template>
                            </v-list-item>
                            <v-list-item>
                                <template>
                                    <v-list-item-content>
                                        <v-list-item-title>Slabs ready for label</v-list-item-title>
                                    </v-list-item-content>
                                </template>
                                <template>
                                    <v-list-item-content class="text-right">
                                        <v-list-item-title>12</v-list-item-title>
                                    </v-list-item-content>
                                </template>
                            </v-list-item>
                            <v-list-item>
                                <template>
                                    <v-list-item-content>
                                        <v-list-item-title>Total waste</v-list-item-title>
                                    </v-list-item-content>
                                </template>
                                <template>
                                    <v-list-item-content class="text-right">
                                        <v-list-item-title>3900 (g)</v-list-item-title>
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
        </v-container>

        <!-- <v-divider class="my-5"></v-divider> -->
        <v-layout row justify-space-around class="mt-5">
            <v-flex xs12 sm6 md3>
            <v-card>
                <v-card-title>
                Test Chart
                </v-card-title>
                <v-card-text>
                <LineChart :chartdata="planetChartData.data" :options="planetChartData.options" />
                </v-card-text>
            </v-card>
            </v-flex>
            <v-flex xs12 sm6 md3>
            <v-card>
                <v-card-title>
                Test Chart 2
                </v-card-title>
                <v-card-text>
                <BarChart :chartdata="barChartData.data" :options="barChartData.options" />
                </v-card-text>
            </v-card>
            </v-flex>
            <v-flex xs12 sm6 md3>
            <v-card>
                <v-card-title>
                Test Chart 2
                </v-card-title>
                <v-card-text>
                <BarChart :chartdata="barChartData.data" :options="barChartData.options" />
                </v-card-text>
            </v-card>
            </v-flex>
        </v-layout>
</div>
</template>

<script>
import db from '../firebase'
import LineChart from '@/components/LineChart'
import BarChart from '@/components/BarChart'
import planetChartData from '@/chart1'
import barChartData from '@/chart2'

const numeral = require('numeral')

export default {
    name: 'dashboard',
    components: {
        LineChart,
        BarChart
    },
    data() {
        return {
            trim: [],
            planetChartData,
            barChartData,
            items: [
                { title: 'Package count', num: '11' },
                { title: 'Total package weight', num: '20,308g' },
                { title: 'Slabs on rack', num: '8' }
            ],
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
        })
    },
    computed: {
        packageCount() {
            return this.trim.reduce((total, item) => {
                return total + item.batch.split(',').length;
            }, 0)
        },
        trimWeight() {
            return this.trim.reduce((total, item) => {
                return total + item.weight;
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