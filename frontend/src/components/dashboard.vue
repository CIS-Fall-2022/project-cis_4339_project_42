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
      <!--Here is the original way we had by using our resources of MongoDB giving us the ability to develop a graph with our data.-->
      <!--HOWEVER We went to the way the professor wanted the graph, however she never specified how she wanted us to code the graph-->
      
      <!--div class="flex flex-col col-span-2">
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
              >{{ queryData[index].Date.month+1 + "/" + queryData[index].Date.year }}</td> queryData[index].Date.month+1 + " " + " " + queryData[index].Date.year
              <td class="p-2 text-center">{{ queryData[index].Name }}</td>
              <td class="p-2 text-center">{{ queryData[index].Attendees }}</td
       <div class="flex flex-col col-span-2">
        <table class="min-w-full shadow-md rounded">
          <thead class="bg-gray-50 text-xl">
          </thead>
          <tbody class="divide-y divide-gray-300">
            I connected our Atlas through an embeded code BUT did had to modified the template so that the Chart will display properly
            <tr>
                <td><div align="center">
                <iframe style="background: #FFFFFF;border: none; border-radius: 2px;box-shadow: 0 2px 10px 0 rgba(70, 76, 79, .2);" 
                width="700" height="500" 
                src="https://charts.mongodb.com/charts-project-0-meuix/embed/charts?id=6337535c-f5b8-4843-873a-0454b62d36cc&maxDataAge=3600&theme=light&autoRefresh=true">
                </iframe>
                </div>
                </td>
            </tr>

          </tbody>
        </table>
        </div> -->
      
      <!--HERE IS THE WAY THE PROFESSOR WANTED IT-->
      <div class="flex flex-col col-span-2 mx-auto h-6/6 w-5/6 border border-slate-900">
        <table class="w-full text-sm text-left border border-slate-900">
          <thead class="font-bold text-sm dark:text-white uppercase" style="background-color: #C8102E;">
            <tr>
              <th class="p-4 text-center">Attendees</th>
              <th class="p-4 text-center">Event Name</th>
              <th class="p-4 text-center">Date</th>
              
            </tr>
          </thead>
          <tbody class="border border-slate-900">
            <tr class="font-medium border-spacing-2 border border-slate-300" v-for="event,index in queryData" :key="event">
              <td class="p-3 text-center dark:text-black uppercase"> {{ queryData[index].Attendees }}</td>
              <td class="p-3 text-center dark:text-black uppercase"> {{ queryData[index].Name }}</td>
              <td class="p-3 text-center dark:text-black uppercase"> {{ new Date(queryData[index].Date).toUTCString().slice(0, -12) }}</td>
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
  }
};
</script>