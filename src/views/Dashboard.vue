<template>
  <div class="dashboard">
    <h1 class="mb-4 secondary--text">Dashboard</h1>
    <v-divider></v-divider>
    <v-layout row wrap class="mt-4">
      <v-flex xs12 sm6 md3 class="test-card">
        <div class="card-body">
          <h4 class="mb-3 secondary--text">Package Count</h4>
          <div class="card-content secondary--text">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Reiciendis, ullam.
          </div>
        </div>
      </v-flex>
    </v-layout>
    <!-- charts -->
    <v-layout row wrap class="mt-4">
      <v-flex xs12 sm6 md4>
        <v-card>
          <v-card-title>
            Test Chart
          </v-card-title>
          <v-card-text>
            <LineChart :chartdata="planetChartData.data" :options="planetChartData.options" />
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
// import db from '../firebase'
import LineChart from '@/components/LineChart'
import planetChartData from '@/chart1'

export default {
  name: 'dashboard',
  components: {
    LineChart
  },
  data() {
    return {
      trim: [],
      planetChartData
    }
  },
  methods: {
    checkCount() {

    }
  },
  // created() {
  //   db.collection('trim').onSnapshot((res) => {
  //       const changes = res.docChanges()
  //       changes.forEach((change) => {
  //           if(change.type === 'added') {
  //               this.trim.push({
  //                   ...change.doc.data(),
  //                   id: change.doc.id
  //               })
  //           }
  //       })
  //   })
  // },
  mounted() {

  }
}
</script>

<style>
  .test-card {
    border-top: 3px solid #5969FF;
    padding: 15px;
    border-radius: 6px;
    background: white;
  }
</style>