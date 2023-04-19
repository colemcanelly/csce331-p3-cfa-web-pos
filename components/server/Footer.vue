<!-- SERVER FOOTER -->
<template>
  <v-card app :elevation="8" class="cfa-red-lighten-4">
    <v-btn class="ma-3">Submit</v-btn>
    <h2 class="ma-3 float-right blue-grey--text text--darken-3">${{ total }}</h2>
  </v-card>
</template>

<!-- ICONS: https://pictogrammers.com/library/mdi/ -->
<script>
export default {
  data: function () {
    return {
      order_total: 0,
    };
  },
  computed: {
    total() { return parseFloat(this.order_total).toFixed(2); }
  }
}
</script>