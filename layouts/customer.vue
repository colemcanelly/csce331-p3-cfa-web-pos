<template>
  <v-app dark>
    <Header></Header>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
    <Footer></Footer>
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