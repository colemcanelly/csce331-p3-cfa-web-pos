<template>
    <v-row>
        <v-col>
            <span>This is a test page.</span>
            <Table />
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
  }
}
</script>