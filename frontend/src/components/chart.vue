<template>
    <div class="container">
      <Bar v-if="loaded" :chart-data="chartData" />
    </div>
  </template>

<script>
import axios from "axios";
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
  name: 'BarChart',
  components: { Bar },
  data: () => ({
    orgID: import.meta.env.VITE_OID,
    queryData: [],
    loaded: false,
    chartData: {
        labels: [],
        datasets: [
          {
            label: 'Attendees',
            backgroundColor: '#f87979',
            data: []
          }
        ]
    }
  }),
  async mounted() {
    this.loaded = false
    try {
        let apiURL = import.meta.env.VITE_ROOT_API + `/eventdata/chart/${this.orgID}`;
        await axios.get(apiURL).then((resp) => {
            this.queryData = resp.data.sort(function(a, b){
            return parseFloat(b.Attendees) - parseFloat(a.Attendees);
          })
            this.queryData.forEach((item) => {
                this.chartData.labels.push(item.Name)
                this.chartData.datasets[0]['data'].push(item.Attendees)

                this.loaded = true
                
            });
        });
    } catch (e) {
      console.error(e)
    }
  }
}
</script>