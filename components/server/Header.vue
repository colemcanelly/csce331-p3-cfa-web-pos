<!-- SERVER HEADER -->
<template>
  <v-app-bar app class="cfa-red-lighten-4">
    <v-card flat @click.stop="back()" class="mx-1 cfa-red-lighten-4">
      <v-icon>mdi-chevron-left</v-icon>
      Back
    </v-card>
    <v-spacer></v-spacer>
    <!-- <span>Total Price: {{ totalPrice }}</span> -->
    <div id="google_translate_element"></div>
    <style>
    #google_translate_element select.goog-te-combo {
      border: 1px solid #808080;
      border-radius: 4px;
      padding: 4px;
    }
    body > .skiptranslate {
    display: none;
    } 
    </style>
    <script type="text/javascript">
        function googleTranslateElementInit() {
          new google.translate.TranslateElement({pageLanguage: 'en'}, 'google_translate_element');
        }
    </script>
    <script type="text/javascript" src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>



    <v-spacer></v-spacer>
    <h2 class="blue-grey--text text--darken-3">{{ kiosk_num }}</h2>
  </v-app-bar>
</template>

<script>

export default {
  name: 'Header',
  data: function () {
    return {
      kiosk_num: '#'
    };
  },
  props: {
    totalPrice: {
      type: Number,
      required: true
    }
  },
  methods: {
    back() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push('/');
    }
  }
}
</script>