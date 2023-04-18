<!-- CUSTOMER FOOTER -->
<template>
    <v-bottom-navigation app color="primary">
      <v-btn v-for="(item, i) in items" nuxt :key="i" :to="item.to" :value="item.label">
        <v-icon>{{ item.icon }}</v-icon>
        <span>{{ item.label }}</span>
      </v-btn>
    </v-bottom-navigation>
  </template>
  
  <!-- ICONS: https://pictogrammers.com/library/mdi/ -->
  <script>
  export default {
    data: function () {
      return {
        items: [
        {
            icon: 'mdi-home',
            label: 'Home',
            to: '/'
          },
          {
            icon: 'mdi-chart-bar  ',
            label: 'XZ Report',
            to: '/report/xzReport'
          },
          {
            icon: 'mdi-list-box-outline',
            label: 'Excess Report',
            to: '/report/excessReport'
          },
          {
            icon: 'mdi-currency-usd',
            label: 'Sales Report',
            to: '/report/salesReport'
          },
          {
            icon: 'mdi-package-variant-closed-plus ',
            label: 'Restock Report',
            to: '/report/restockReport'
          },
        ],
      };
    }
  }
  </script>