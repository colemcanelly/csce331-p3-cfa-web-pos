<template>
    <v-app>
    <v-container>
    
    
       <v-row><v-col cols="12"><v-card ><v-card-title style="font-size:40px" class="text-center font-weight-bold">Order Summary</v-card-title ></v-card></v-col></v-row>
      
       <v-row>
           <v-col cols="12" v-for="item in currentOrder" :key="item.id">
               <v-card >
                   <v-card-title class="text-center">{{ item.menu_item }}</v-card-title>
                   <!-- <v-img :src="menuItem.img"></v-img> -->
                   <v-card-text class="text-center">{{  item.food_price }}</v-card-text>
                   <v-btn class="mb-2 ml-2 mr-2" elevation="2" @click="removeItemFromOrder(item)">Remove From Order</v-btn>
               </v-card>
           </v-col>
           <v-col cols = "12">
               <v-card-text class = "text-center" style="font-size:30px;">Total Price: ${{ this.totalPrice }}</v-card-text>
           </v-col>
       </v-row>
       <v-row>
           <v-col cols="12" class="text-center">
               <v-btn mb-2 ml-2 mr-2 x-large block elevation="2" style="font-size: 30px" @click="submitOrder">Submit Order</v-btn>
           </v-col>
       </v-row>
      
    
    
    </v-container>
    </v-app>
    </template>
    
    
    <script>
/**
 * Importing the currentOrder object from temp-data file
 * @module CustomerPage
 */

    import { currentOrder } from '~/static/temp-data';
    // import {totalPrice} from '~/static/temp-data'

    /**
 * The OrderPage component
 * @typedef {Object} OrderPage
 * @property {string} name - The name of the component
 * @property {string} layout - The name of the layout
 * @property {Object} data - The component data
 * @property {Array} currentOrder - The current order items
 * @property {number} totalPrice - The total price of the order
 * @property {number} i - The index of the current order item
 * @property {Object} methods - The component methods
 * @property {Function} removeItemFromOrder - A method that removes an item from the order
 * @property {Function} submitOrder - A method that submits the order to the database
 * @property {Function} mounted - A lifecycle hook that runs when the component is mounted
 */
    
    
    export default {
       name: "OrderPage",
       layout: 'customer',
       data() {
           return {
               currentOrder,
               totalPrice: 0,
               i: 0,
           }
       },
       methods: {
            /**
     * A method that removes an item from the order
     * @param {Object} item - The menuItem that is attached to the same component of the remove item button that was pressed
     * @return {void}
     */
           removeItemFromOrder(item) {
               const index = this.currentOrder.findIndex(obj => obj === item)
               if (index !== -1) {
                   this.currentOrder.splice(index,1);
               }
               console.log(this.currentOrder)
               localStorage.setItem('currentOrder', JSON.stringify(this.currentOrder));
               this.totalPrice = this.computedTotalPrice;
               location.reload();
           },
            /**
            * submits all items within currentOrder array to database
            * then clears array and refreshes the page
            * @return {void}
            */

           async submitOrder() {
             console.log(this.currentOrder);
             if (this.currentOrder.length > 0) {
               console.log("Trying to submit order");
               const orderData = {
                 order_date: new Date().toISOString().slice(0, 10), // get current date in YYYY-MM-DD format
                 order_time: new Date().toLocaleTimeString('en-US', { hour12: false }).substring(0, new Date().toLocaleTimeString('en-US', { hour12: false }).lastIndexOf(':')) + ':00',
                 customer_fname: 'John', // replace with actual customer name
                 currentOrder: this.currentOrder,
                 order_creator: 1,
               };
               try {
                 const response = await this.$axios.post('/order', orderData);
                 console.log(response);
                 //this.tableData = response.data
                 //this.tableData = response.data;
               } catch (err) {
                 console.log("ERROR");
                 console.log(err);
               }
               var index = 0
               for (index;index < this.currentOrder.length;index++) {
                   this.currentOrder.splice(index,1);
               }
               this.currentOrder.length = 0;
               localStorage.setItem('currentOrder', JSON.stringify(this.currentOrder));
             }
             else{
               console.log("CurrentOrder.length == 0");
             }
             location.reload();
           },
       },
        /**
        * implemented for persistence across refreshes
        */
       mounted() {
           const storedOrder = localStorage.getItem('currentOrder');
           if (storedOrder) {
               this.currentOrder = JSON.parse(storedOrder);
           }
          
           for (this.i; this.i < this.currentOrder.length; this.i++) {
               this.totalPrice += parseFloat(this.currentOrder[this.i].food_price);
           }
           this.totalPrice = parseFloat(this.totalPrice).toFixed(2);
       },
    }
    </script>