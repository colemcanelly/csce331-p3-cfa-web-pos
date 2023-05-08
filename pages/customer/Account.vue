<template class="d-flex flex-row">
  <v-sheet>
    <h1>{{ title }}</h1>
    <v-btn @click="logout" color="primary m" outlined>Log out</v-btn>
  </v-sheet>
</template>

<script>
export default {
  name: "CategoriesPage",
  layout: "customer",
  computed: {
    title() {
      return `Howdy, ${this.$cookies.get("fname")}!`;
    },
  },
  methods: {
    logout() {
      try {
        console.log("logging out");
        this.$axios.post("/logout");
        this.$router.push('/login');
      } catch (error) {
        console.log(error);
      }
    },
  }
};
</script>