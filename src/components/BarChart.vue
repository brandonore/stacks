<script>
import { Bar } from 'vue-chartjs'

export default {
    name: 'barchart',
    extends: Bar,
    props: {
        chartdata: {
        type: Object,
        default: null
        },
        options: {
        type: Object,
        default: null
        }
    },
    mounted () {
        this.renderChart(this.chartdata, this.options)
    }
}
</script>