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
            icon: 'mdi-silverware  ',
            label: 'Menu',
            to: '/managerMenu'
          },
          {
            icon: 'mdi-list-box-outline',
            label: 'Inventory',
            to: '/managerInventory'
          },
          {
            icon: 'mdi-currency-usd',
            label: 'Reports',
            to: 'report/salesReport'
          },
        ],
      };
    }
  }
  </script>