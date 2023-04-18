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
            icon: 'mdi-map-marker',
            label: 'Menu List',
            to: '/managerMenu'
          },
          {
            icon: 'mdi-silverware-fork-knife',
            label: 'Inventory',
            to: '/managerInventory'
          },
          {
            icon: 'mdi-shopping',
            label: 'Sales Report',
            to: '/salesReport'
          },
        //   {
        //     icon: 'mdi-shopping',
        //     label: 'XZ Report',
        //     to: '/customer/Order'
        //   },
        //   {
        //     icon: 'mdi-shopping',
        //     label: 'Excess Report',
        //     to: '/customer/Order'
        //   },
        ],
      };
    }
  }
  </script>