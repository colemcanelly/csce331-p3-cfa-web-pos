<template>
  <v-row class="overflow-scroll">
  <v-col>

    <div class="d-flex justify-center">
      <v-btn
        color="primary"
        outlined
        @click="getXReport"
      >
        Generate X Report
        <v-icon>mdi-check-bold</v-icon>
      </v-btn>
    </div>
    <div class="d-flex justify-center">
      <v-btn
        color="primary"
        outlined
        @click="getZReport"
      >
        Generate Z Report
        <v-icon>mdi-check-bold</v-icon>
      </v-btn>
    </div>
      <v-data-table
      :headers="headers.concat()"
      :items="tableData"
      :search="search"
      no-data-text="Click generate to see restock report"
      hide-default-footer
      sort-by="calories"
      >
      </v-data-table>
  </v-col>
  </v-row>
</template>
  
  <script>
  export default {
  name: 'xzReportPage',
  layout: 'report',
  components: {
    Report
  },
  data: () => ({
    title: "XZ Report",
    table: 'supply',
    tableData: [],
    start_date: new Date().toISOString(),
    end_date: new Date().toISOString(),
    sales: 0.0,
    headers: [
      { text: 'Report Type', value: 'report_type' },
      { text: 'End Date', value: 'end_date' },
      { text: 'Sales', value: 'sales' },
    ],
  }),
  methods: {
    async getXReport() {
      try {
        const { data: {end_date, sales } } = await this.$axios.get('/x-report');
        this.tableData = response.data;
        console.log(this.tableData);
      }
      catch (err) {
                console.log("ERROR");
                console.log(err);
      }
    },
    async getZReport() {
      try {
        const response = await this.$axios.get('/z-report');
        this.tableData = response.data;
        console.log(this.tableData);
      }
      catch (err) {
                console.log("ERROR");
                console.log(err);
      }
    },
  },
  }
  </script>