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
          label: 'Nearby',
          to: '/customer/Nearby'
        },
        {
          icon: 'mdi-silverware-fork-knife',
          label: 'Menu',
          to: '/customer/Categories'
        },
        {
          icon: 'mdi-shopping',
          label: 'My Order',
          to: '/customer/Order'
        },
        {
          icon: 'mdi-account',
          label: 'Account',
          to: '/customer/Account' 
        }
      ],
    };
  }
}
</script>