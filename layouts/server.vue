<template>
  <v-app dark>
    <Header />
    <v-main class="overflow-hidden">
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
    <Footer />
  </v-app>
</template>

<script>
import Header from '~/components/server/Header.vue';
import Footer from '~/components/server/Footer.vue';
export default {
  name:"ServerLayout",
  components: {
    Header,
    Footer
  }
}
</script>