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

/**
 * @module ManagerMenuPage
 * @description The manager menu page component.
 */
export default {
  name: 'ManagerMenuPage',
  layout: 'manager',
  components: {
    Table,
  },
  data: () => ({
    /**
     * The title of the page.
     * @type {string}
     */
    title: 'Menu',

    /**
     * The name of the table.
     * @type {string}
     */
    table: 'menu',

    /**
     * The headers of the table.
     * @type {Array}
     */
    headers: [
      { text: 'Item Name', value: 'menu_item', sortable: false },
      { text: 'Price ($)', value: 'food_price' },
      { text: 'Combo (T/F)', value: 'combo' },
      { text: 'Category', value: 'menu_cat' },
    ],
  }),
}
</script>