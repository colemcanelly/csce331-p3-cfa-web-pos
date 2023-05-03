<template>
  <v-row class="overflow-scroll">
      <v-col>
          <!-- <span>This is a test page.</span> -->
          <Inventory :table="table" :title="title" :headers="headers"></Inventory>
      </v-col>
  </v-row>
</template>

<script>
import Inventory from '~/components/manager/Inventory.vue'
export default {
name: 'managerInventoryPage',
layout: 'manager',
components: {
  Inventory
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