<template>
  <v-row class="overflow-scroll">
      <v-col>
          <!-- <span>This is a test page.</span> -->
          <Inventory :table="table" :title="title" :headers="headers"></Inventory>
      </v-col>
  </v-row>
</template>

<script>

/**
 * Represents the manager inventory page.
 * @module ManagerInventoryPage
 */

 import Inventory from '~/components/manager/Inventory.vue'

/**
 * Represents the default export of the ManagerInventoryPage module.
 * @type {object}
 * @property {string} name - The name of the component.
 * @property {string} layout - The layout of the component.
 * @property {object} components - The child components of the ManagerInventoryPage.
 * @property {object} data - The data of the component.
 * @property {string} data.title - The title of the page.
 * @property {string} data.table - The name of the table.
 * @property {array} data.headers - The headers of the table.
 * @property {object} headers[i] - The i-th header of the table.
 * @property {string} headers[i].text - The text of the i-th header.
 * @property {string} headers[i].value - The value of the i-th header.
 * @property {boolean} headers[i].sortable - Whether the i-th header is sortable or not.
 */
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
      { text: 'Current Quantity', value: 'current_quantity' },
      { text: 'Restock Quantity', value: 'restock_quantity' },
      { text: 'Threshold', value: 'threshold' },
      
    ],
  })
}
</script>