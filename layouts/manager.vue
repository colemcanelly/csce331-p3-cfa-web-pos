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
import Header from '~/components/manager/manHeader.vue';
import Footer from '~/components/manager/manFooter.vue';
export default {
  name:"CustomerLayout",
  components: {
    Header,
    Footer
  }
}
</script>