<template>
  <v-app dark>
    <Header></Header>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
    <v-footer
      :absolute="!fixed"
      app
    >
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import Header from '~/components/Header.vue';
export default {
    name: "DefaultLayout",
    data() {
        return {
            drawer: false,
            fixed: false,
            right: true,
            rightDrawer: false,
            title: "Vuetify.js"
        };
    },
    components: { Header }
}
</script>
