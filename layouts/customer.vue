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
import Header from '~/components/customer/Header.vue';
import Footer from '~/components/customer/Footer.vue';
export default {
  name:"CustomerLayout",
  components: {
    Header,
    Footer
  }
}
</script>