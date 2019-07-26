<template>
  <div class="dashboard">
    <h1 class="mb-4 secondary--text">Dashboard</h1>
    <v-divider class="mb-5"></v-divider>
    <v-container>
      <v-layout justify-space-between row wrap>
      <v-flex xs12 sm6 md3 class="test-card">
        <h4 class="mb-3 secondary--text">Package Count on hand:</h4>
        <h2 class="text-xs-left">{{ packageCount }}</h2>
      </v-flex>
      <v-flex xs12 sm6 md3 class="test-card">
        <h4 class="mb-3 secondary--text">Package Count on hand:</h4>
        <h2 class="text-xs-left">{{ packageCount }}</h2>
      </v-flex>
      <v-flex xs12 sm6 md3 class="test-card">
        <h4 class="mb-3 secondary--text">Package Count on hand:</h4>
        <h2 class="text-xs-left">{{ packageCount }}</h2>
      </v-flex>
      <v-flex xs12 sm6 md3 class="test-card">
        <h4 class="mb-3 secondary--text">Package Count on hand:</h4>
        <h2 class="text-xs-left">{{ packageCount }}</h2>
      </v-flex>
    </v-layout>
      <v-layout row justify-center class="mt-4">
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
        <v-flex xs12 sm6 md4>
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
    </v-container>
  </div>
</template>

<script>
import db from '../firebase'
import LineChart from '@/components/LineChart'
import BarChart from '@/components/BarChart'
import planetChartData from '@/chart1'
import barChartData from '@/chart2'

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
      barChartData
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
    }
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