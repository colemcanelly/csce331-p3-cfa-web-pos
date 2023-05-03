<template>
  <v-app dark>
    <Header></Header>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
    <v-footer :absolute="!fixed" app color="primary">
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import Header from "~/components/manager/manHeader.vue";
export default {
  name: "DefaultLayout",
  data() {
    return {
      drawer: false,
      fixed: false,
      right: true,
      rightDrawer: false,
      title: "Vuetify.js",
    };
  },
  mounted() {
    console.log(this.$auth);
    console.log(this.$auth.loggedIn);
    console.log(
      this.$auth.loggedIn ? "You are Logged In!" : "You are NOT logged in"
    );
    console.log(this.$auth.user);
  },
  components: { Header },
};
</script>
