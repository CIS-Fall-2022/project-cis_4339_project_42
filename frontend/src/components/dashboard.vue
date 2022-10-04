<template>
  <main>
    <div>
      <h1 class="font-bold text-4xl text-red-700 tracking-widest text-center mt-10">Welcome</h1>
    </div>
    <div class="flex flex-col col-span-2">
        <table class="min-w-full shadow-md rounded">
          <thead class="bg-gray-50 text-xl">
            <tr>
              <th class="p-4 text-left">Organizations</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-300">
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
