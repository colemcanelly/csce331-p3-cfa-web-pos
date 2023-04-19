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
            icon: 'mdi-keyboard-backspace',
            label: 'Back',
            to: '/managerMenu'
          },
          {
            icon: 'mdi-currency-usd',
            label: 'Sales',
            to: '/report/salesReport'
          },
          {
            icon: 'mdi-chart-bar  ',
            label: 'XZ',
            to: '/report/xzReport'
          },
          {
            icon: 'mdi-list-box-outline',
            label: 'Excess',
            to: '/report/excessReport'
          },
          {
            icon: 'mdi-package-variant-closed-plus ',
            label: 'Restock',
            to: '/report/restockReport'
          },
        ],
      };
    }
  }
  </script>