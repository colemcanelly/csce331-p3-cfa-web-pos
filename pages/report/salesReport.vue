<template>
  <v-row class="overflow-scroll">
      <v-col>
        
          <!-- <span>This is a test page.</span> -->
          <Report :table="table" :title="title" :headers="headers"></Report>
      </v-col>
  </v-row>
</template>

<script>
import Report from '~/components/report/SalesReport.vue'
export default {
name: 'salesReportPage',
layout: 'report',
components: {
  Report
},
data: () => ({
  title: "Sales Report",
  table: 'salesReport',
  headers: [
    { text: 'Menu Item', value: 'name' },
    { text: 'Total Sales', value: 'revenue' },
  ],
})
}
</script>