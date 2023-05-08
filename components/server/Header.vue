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
    <div>
      Total price: ${{ totalPrice.toLocaleString(undefined, { style: 'currency', currency: 'USD' }) }}
      <!-- rest of the template -->
    </div>
  </v-app-bar>
</template>

<script>

export default {
  name: 'Header',
  data: function () {
    return {
      kiosk_num: '#',
      totalPrice: 0
    };
  },
  props: {
    // totalPrice: {
    //     type: String,
    //     required: true
    //   }
  },
  methods: {
    back() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push('/');
    }
  },
  mounted() {
  this.$root.$on('total-price-updated', (totalPrice) => {
    console.log("Total Price Passed in", totalPrice);
    this.totalPrice = totalPrice;
  });
}
}
</script>