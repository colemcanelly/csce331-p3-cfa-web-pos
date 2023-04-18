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
  layout: 'customer',
  components: {
    Table
  },
  data: () => ({
    title: "Coles Table",
    table: 'menu',
    headers: [
      { text: 'Item Name', value: 'menu_item', sortable: false },
      { text: 'Price ($)', value: 'food_price' },
      { text: 'Combo (T/F)', value: 'combo' },
      { text: 'Category', value: 'menu_cat' },
    ],
  })
}
</script>