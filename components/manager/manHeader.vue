<!-- CUSTOMER HEADER -->
<template>
    <v-container class="pa-0 text-center cfa-red-lighten-4 elevation-1">
        <v-row no-gutters>
            <v-col class="text-center my-1">
                <v-card to="/" flat class="rounded-0 cfa-red-lighten-4">
                    <img :src="image" :alt="title" width="28%">
                </v-card>
            </v-col>
            <v-col>
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
                .goog-te-banner-frame.skiptranslate {
                    display: none !important;
                }
                body {
                    top: 0px !important;
                }
                </style>
                <script type="text/javascript">
                    function googleTranslateElementInit() {
                    new google.translate.TranslateElement({pageLanguage: 'en'}, 'google_translate_element');
                    }
                </script>
                <script type="text/javascript" src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>
            </v-col>
        </v-row>
        <v-divider></v-divider>
    </v-container>
</template>

<script>
export default {
    data: function() {
        return {
            title: "Chick-Fil-A",
            image: "/cfa-logo.svg"
        }; 
    }
}
</script>