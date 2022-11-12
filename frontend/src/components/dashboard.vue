<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <main>
    <div>
      <h1 class="font-bold text-4xl text-red-700 tracking-widest text-center mt-10">Welcome</h1>
    </div>
    <div>
      <h1 class="font-bold text-xl text-red-700 tracking-widest text-center mt-10"></h1>
    </div>
    <div class="container mx-auto h-3/6 w-1/3">
      <div class="chart-container">
        <BarChart/>
        
      </div>
    </div>
    <div class="hidden">
      {{chartData}}
    </div>
    <hr class="mt-10 mb-10" />
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
      <div class="ml-10">
        <h2 class="text-2xl font-bold">List of Events</h2>
        <h3 class="italic">The Month and Year</h3>
      </div>
      <div class="flex flex-col col-span-2">
        <table class="min-w-full shadow-md rounded">
          <thead class="bg-gray-50 text-x2">
            <tr>
              <th class="p-4 text-left">Date</th>
              <th class="p-4 text-center">Eveny Name</th>
              <th class="p-4 text-center">Attendees</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-300">
            <tr 
              v-for="event,index in queryData" :key="event"
            >
              <td
                class="p-2 text-left "
              >{{ queryData[index].Date.month+1 + "/" + queryData[index].Date.year }}</td> <!--queryData[index].Date.month+1 + " " + " " + queryData[index].Date.year-->
              <td class="p-2 text-center">{{ queryData[index].Name }}</td>
              <td class="p-2 text-center">{{ queryData[index].Attendees }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </main>
</template>
<script>
import BarChart from '../components/chart.vue'
import axios from "axios";

export default {
  name: 'App',
  components: { BarChart },
  data() {
    return {
      queryData: [],
      chartData: {
        labels: [],
        datasets: [{ data: [] }]
      },
      orgID: import.meta.env.VITE_OID
    }
  },
  mounted() {
    let apiURL = import.meta.env.VITE_ROOT_API + `/eventdata/chart/${this.orgID}`;
    axios.get(apiURL).then((resp) => {
      this.queryData = resp.data.sort(function(a, b){
            return b.Attendees - a.Attendees;
          })
        resp.data.forEach((item) => {
          this.chartData.labels.push(item.Name)
          this.chartData.datasets[0]['data'].push(item.Attendees)

      });
    });
    window.scrollTo(0, 0);
  },
  methods: {
    routePush(routeName) {
      this.$router.push({ name: routeName });
    },
  },
};
</script>