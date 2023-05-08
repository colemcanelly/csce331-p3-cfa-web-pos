// main.js
import Vue from 'vue';

Vue.$bus = new Vue();

new Vue({
  el: '#app',
  render: h => h(App),
});