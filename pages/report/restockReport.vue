<template>
    <v-row class="overflow-scroll">
        <v-col>

          <div class="d-flex justify-center">
            <v-btn
              color="primary"
              outlined
              @click="getRestockReport"
            >
              Generate
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
  import Header from '@/components/server/Header.vue'
  import Report from '~/components/report/Report.vue'
  export default {
  name: 'restockReportPage',
  layout: 'report',
  components: {
    Report,
    Header
  },
  data() {
      return {
        tableData: [],
        headers: [
          { text: 'Ingredient', value: 'ingredient', sortable: false },
          { text: 'Threshold', value: 'threshold' },
          { text: 'Quantity', value: 'quantity' },
        ]
      };
    },
  methods: {
    async getRestockReport () {
            try {
                const response = await this.$axios.get('/restock-report');
                this.tableData = response.data;
                console.log(this.tableData);
            } catch (err) {
                console.log("ERROR");
                console.log(err);
            }
        },
  },
  }
  
  </script>
