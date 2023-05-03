<template>
  <v-btn @click="loginWithGoogle" x-large outlined block color="primary">
    <v-icon right>mdi-google</v-icon>
    <v-spacer></v-spacer>
    <span class="pa-2 align-self-center">Google</span>
    <v-spacer></v-spacer>
  </v-btn>
</template>

<script>
export default {
  methods: {
    loginWithGoogle() {
      try { 
        this.$auth.loginWith("google");
      } catch (err) {
        console.log("Login error: " + err);
      }
    },
  },
  data: () => ({})
}
</script>