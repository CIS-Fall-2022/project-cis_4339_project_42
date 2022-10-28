<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <main>
    <div>
      <h1 class="font-bold text-4xl text-red-700 tracking-widest text-center mt-10">Welcome</h1>
    </div>
    <div class="flex flex-col col-span-2">
        <table class="min-w-full shadow-md rounded">
          <thead class="bg-gray-50 text-xl">
          </thead>
          <tbody class="divide-y divide-gray-300">
            <!--I connected our Atlas through an embeded code BUT did had to modified the template so that the Chart will display properly-->
            <tr>
                <td><div>
                <iframe style="background: #FFFFFF;border: none;
                border-radius: 2px;box-shadow: 0 2px 10px 0 rgba(70, 76, 79, .2);" 
                width="640" height="480" 
                src="https://charts.mongodb.com/charts-project-0-meuix/embed/charts?id=6337535c-f5b8-4843-873a-0454b62d36cc&maxDataAge=3600&theme=light&autoRefresh=true">
                </iframe>
                </div></td>
            </tr>
            <!--<tr @click="editClient(client._id)" v-for="client in queryData" :key="client._id">
              <td class="p-2 text-left">{{ client.orgName }}</td>
            </tr>
            -->
          </tbody>
        </table>
      </div>
  </main>
</template>
<script>
  import axios from "axios";
export default {
  data() {
    return
  },
  mounted() {
    let apiURL = import.meta.env.VITE_ROOT_API + `/primarydata/oid`;
    axios.get(apiURL).then((resp) => {
      this.queryData = resp.data;
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