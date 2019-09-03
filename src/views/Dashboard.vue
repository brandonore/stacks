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
                        <v-list-item-title class="secondary--text">Batch count</v-list-item-title>
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
                        <h3
                        class="grey--text text--darken-2 font-weight-regular"
                        >{{ `${formatWeight(trimWeight)} (g)` }}</h3>
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
                        <v-list-item-title class="secondary--text">Slabs ready for delivery</v-list-item-title>
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
                        <h3 class="grey--text text--darken-2 font-weight-regular">{{ totalGrams }}</h3>
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
                        <h3
                        class="grey--text text--darken-2 font-weight-regular"
                        >{{ `${formatWeight(extractWaste)} (g)` }}</h3>
                    </v-list-item-content>
                    </template>
                </v-list-item>
                </template>
            </v-card>
            </v-flex>
            <v-flex d-flex xs12 sm6 md8>
            <v-card flat class="pa-5" width="100%">
                <v-card-text>
                <LineChart :chartdata="computedChartData" :options="lineChartData.options" />
                </v-card-text>
            </v-card>
            </v-flex>
        </v-layout>
        <!-- secondary row -->
        <!-- <v-layout wrap class="secondary-row">
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
        </v-layout>-->
        </v-container>
    </div>
    </template>

<script>
import LineChart from "@/components/LineChart";
import BarChart from "@/components/BarChart";
import DoughnutChart from "@/components/DoughnutChart";
import lineChartData from "@/lineChartData";
import barChartData from "@/chart2";
import doughnutChartData from "@/doughnut-chart";

const numeral = require("numeral");

export default {
name: "dashboard",
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
    lineChartData,
    barChartData,
    doughnutChartData,
    height: 400,
    loaded: false
    };
},
methods: {
    formatWeight(weight) {
    let val = numeral(weight).format("0,0");
    return val;
    }
},
created() {
    this.$db.collection("trim").onSnapshot(res => {
    const changes = res.docChanges();
    changes.forEach(change => {
        if (change.type === "added") {
        this.trim.push({
            ...change.doc.data(),
            id: change.doc.id
        });
        }
    });
    }),
    this.$db.collection("extract").onSnapshot(res => {
        const changes = res.docChanges();
        changes.forEach(change => {
        if (change.type === "added") {
            this.extract.push({
            ...change.doc.data(),
            id: change.doc.id
            });
        }
        });
    }),
    this.$db.collection("packaging").onSnapshot(res => {
        const changes = res.docChanges();
        changes.forEach(change => {
        if (change.type === "added") {
            this.packaging.push({
            ...change.doc.data(),
            id: change.doc.id
            });
        }
        });

        this.$forceUpdate();
    });
},
computed: {
    computedChartData() {
        let tempData = {
            labels: [
            "JAN",
            "FEB",
            "MAR",
            "APR",
            "MAY",
            "JUN",
            "JUL",
            "AUG",
            "SEP",
            "OCT",
            "NOV",
            "DEC"
            ],
            datasets: [
            {
                label: "Avg Yield % by Month",
                borderColor: "rgba(116, 235, 213, 1)",
                pointBorderColor: "rgba(116, 235, 213, 1)",
                pointBackgroundColor: "rgba(116, 235, 213, 1)",
                pointHoverBackgroundColor: "rgba(116, 235, 213, 1)",
                pointHoverBorderColor: "rgba(116, 235, 213, 1)",
                pointBorderWidth: 10,
                pointHoverRadius: 10,
                pointHoverBorderWidth: 1,
                pointRadius: 0.5,
                fill: true,
                backgroundColor: "rgba(116, 235, 213, 0.6)",
                borderWidth: 4,
                data: [
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null
                ]
            }
            ]
        }
        this.packaging.forEach(item => {
            let monthNumber = parseInt(item.packageDate.substring(0, 2)) - 1
            let percentage = Number(item.yield.substr(0, item.yield.length - 1))

            if (tempData.datasets[0].data[monthNumber] === null) {
            tempData.datasets[0].data[monthNumber] = percentage
            } else {
            tempData.datasets[0].data[monthNumber] =
                (tempData.datasets[0].data[monthNumber] + percentage) / 2
            }
        });
        return tempData;
    },
    packageCount() {
        return this.trim.reduce((total, item) => {
            return total + item.batch.split(",").length;
        }, 0);
    },
    trimWeight() {
        return this.trim.reduce((total, item) => {
            return total + item.weight;
        }, 0);
    },
    slabsOnRack() {
        return this.packaging.length;
    },
    extractWaste() {
        return this.extract.reduce((total, item) => {
            return total + item.waste;
        }, 0);
    },
    totalGrams() {
        return this.packaging.reduce((total, item) => {
            return total + item.totalGrams;
        }, 0);
    }
}
};
</script>

<style>
    .test-card {
    border-top: 3px solid #5969ff;
    border-radius: 6px;
    }
</style>