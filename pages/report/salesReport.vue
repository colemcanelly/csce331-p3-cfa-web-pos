<template>
  <v-row class="overflow-scroll">
      <v-col>
          <!-- <span>This is a test page.</span> -->
          <Table :table="table" :title="title" :headers="headers"></Table>
      </v-col>
  </v-row>
</template>

<script>
import Report from '~/components/report/Report.vue'
export default {
name: 'salesReportPage',
layout: 'report',
components: {
  Report
},
data: () => ({
  title: "Sales Report",
  table: 'supply',
  headers: [
    { text: 'Ingredient', value: 'ingredient', sortable: false },
    { text: 'Threshold', value: 'threshold' },
    { text: 'Restock Quantity', value: 'restock_quantity' },
  ],
})
}
</script>