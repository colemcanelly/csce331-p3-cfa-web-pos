<template>
    <v-row class="overflow-scroll">
        <v-col>
            <!-- <span>This is a test page.</span> -->
            <Report :table="table" :title="title" :headers="headers"></Report>
        </v-col>
    </v-row>
  </template>
  
  <script>
  /**
  * @module ReportsPage
   * @type {import('~/components/report/ExcessReport.vue').default}
   */
  import Report from '~/components/report/ExcessReport.vue';

  /**
   * The default export for the excessReportPage component
   * @type {import('vue').ComponentOptions}
   */
  export default {
    /**
     * The name of the component
     * @type {string}
     */
    name: 'excessReportPage',

    /**
     * The name of the layout used by the component
     * @type {string}
     */
    layout: 'report',

    /**
     * The components used by the component
     * @type {object}
     */
    components: {
      Report,
    },

    /**
     * The data used by the component
     * @type {function}
     * @return {object}
     */
    data: () => ({
      /**
       * The title of the report
       * @type {string}
       */
      title: 'Excess Report',

      /**
       * The name of the table used in the report
       * @type {string}
       */
      table: 'excess-report',

      /**
       * The headers used in the report table
       * @type {array}
       */
      headers: [
        { text: 'Ingredient', value: 'ingredient', sortable: false },
        { text: 'Start Quantity', value: 'qty_sod' },
        { text: 'Quantity Sold', value: 'total_qty_sold' },
        { text: 'Percent Difference', value: 'percentage_diff' },
      ],
    }),
  };
</script>