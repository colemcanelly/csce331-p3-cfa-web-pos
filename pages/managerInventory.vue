<template>
  <v-row class="overflow-scroll">
      <v-col>
          <!-- <span>This is a test page.</span> -->
          <Table :table="table" :title="title" :headers="headers"></Table>
      </v-col>
  </v-row>
</template>

<script>
import Table from '~/components/manager/Table.vue'
export default {
name: 'IndexPage',
layout: 'manager',
components: {
  Table
},
data: () => ({
  title: "Inventory",
  table: 'supply',
  headers: [
    { text: 'Ingredient', value: 'ingredient', sortable: false },
    { text: 'Threshold', value: 'threshold' },
    { text: 'Restock Quantity', value: 'restock_quantity' },
  ],
})
}
</script>