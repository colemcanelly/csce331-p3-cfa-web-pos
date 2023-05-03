<template>
  <v-app>
     <v-row>
       <v-col cols="12"><v-card ><v-card-title class="text-center">Nearby Chick-Fil-A Locations</v-card-title ></v-card></v-col>
      
         <v-col cols="12"><v-card id="map" style="height: 500px;"></v-card></v-col>
    
       </v-row>
  
  
    
  </v-app>
  </template>
    <script>
   export default {
  
  
     name: "NearbyPage",
     layout: 'customer',
     data() {
       return {
         coordinates: [
           { lat: 30.61714, lng: -96.34383 },
           { lat: 30.61246, lng: -96.34091 },
           { lat: 30.61622, lng: -96.31972 },
           { lat: 30.63101, lng: -96.37925 },
           { lat: 30.65970, lng: -96.33103 },
         ],
       };
     },
     /**
    * creates the Map object by calling on the Google API
    * and initializing it, looping through the listed
    * coordinates of Chick-Fil-A locations to place markers on it,
    * and finally appending it to the actual page
    */
     mounted() {
       const script = document.createElement('script');
       script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAe16C2FwOAOUeGi6L_YhFjlgYrxus-uQw&callback=initMap`;
       script.defer = true;
       script.async = true;
        window.initMap = () => {
         const map = new google.maps.Map(document.getElementById('map'), {
           center: { lat: 30.6219, lng: -96.3263 },
           zoom: 12
         });
  
  
         this.coordinates.forEach((coordinate) => {
           new google.maps.Marker({
             position: coordinate,
             map,
           });
         });
       };
        document.head.appendChild(script);
     }
   }
   </script>
  