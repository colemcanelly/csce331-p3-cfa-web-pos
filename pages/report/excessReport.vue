<template>
    <v-row class="overflow-scroll">
        <v-col>
            <!-- <span>This is a test page.</span> -->
            <Report :table="table" :title="title" :headers="headers"></Report>
        </v-col>
    </v-row>
  </template>
  
  <script>
  import Report from '~/components/report/ExcessReport.vue'
  export default {
  name: 'excessReportPage',
  layout: 'report',
  components: {
    Report
  },
  data: () => ({
    title: "Excess Report",
    table: 'excess-report',
    headers: [
      { text: 'Ingredient', value: 'ingredient', sortable: false },
      { text: 'Start Quantity', value: 'qty_sod' },
      { text: 'Quatity Sold', value: 'total_qty_sold' },
      { text: 'Percent Difference', value: 'percentage_diff' },
    ],
  })
  }
  </script>