<template>
<v-app>
    <div id="map" style="height: 500px;"></div>
</v-app>
</template>
  
  <script>
  export default {

    name: "NearbyPage",
    layout: 'customer',
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
      };
  
      document.head.appendChild(script);
    }
  }
  </script>
  




   