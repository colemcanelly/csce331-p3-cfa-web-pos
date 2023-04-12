<!-- SERVER HEADER -->
<template>
  <v-app-bar app class="cfa-red-lighten-4">
    <v-card flat @click.stop="back()" class="mx-1 cfa-red-lighten-4">
      <v-icon>mdi-chevron-left</v-icon>
      Back
    </v-card>
    <v-spacer />
    <h2 class="blue-grey--text text--darken-3">{{ kiosk_num }}</h2>
  </v-app-bar>
</template>

<script>

export default {
  data: function () {
    return {
      title: "Chick-Fil-A",
      image: "/cfa-logo.svg",
      kiosk_num: '#'
    };
  },
  methods: {
    back() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push('/');
    }
  }
}
</script>