<template>
<v-app>
<v-container>

    <v-row><v-col cols="12"><v-card ><v-card-title class="text-center">Order Summary</v-card-title ></v-card></v-col></v-row>
    
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
            <v-card-text class = "text-center">Total Price: ${{ this.totalPrice }}</v-card-text>
        </v-col>
        <v-col cols = "12">
            <v-btn class = "mb-2 ml-2 mr-2" elevation="2" @click="submitOrder">Submit Order</v-btn>
        </v-col>
    </v-row>
    

</v-container>
</v-app>
</template>

<script>
import { currentOrder } from '~/static/temp-data';
// import {totalPrice} from '~/static/temp-data'

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
        removeItemFromOrder(item) {
            const index = this.currentOrder.findIndex(obj => obj === item)
            if (index !== -1) {
                this.currentOrder.splice(index,1);
            }
            console.log(this.currentOrder)
            localStorage.setItem('currentOrder', JSON.stringify(this.currentOrder));
        },
        async submitOrder() {
            // console.log(this.currentOrder);
            // try {
            //     // no chance this works whatsoever but it is a start!
            //     await this.$axios.post('/menu', this.currentOrder);                                                                                                                                                     
            // } catch (err) {
            //     console.log("ERROR");
            //     console.log(err);
            // }
            // this.currentOrder.length = 0;
            // localStorage.setItem('currentOrder', JSON.stringify(this.currentOrder));
            console.log(this.totalPrice);
        },
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
            this.currentOrder.length = 0;
            localStorage.setItem('currentOrder', JSON.stringify(this.currentOrder));
          }
          else{
            console.log("CurrentOrder.length == 0");
          }
        }
    },
    mounted() {
        const storedOrder = localStorage.getItem('currentOrder');
        if (storedOrder) {
            this.currentOrder = JSON.parse(storedOrder);
        }
        
        for (this.i; this.i < this.currentOrder.length; this.i++) {
            this.totalPrice += parseFloat(this.currentOrder[this.i].food_price);
        }
        this.totalPrice = this.totalPrice.toFixed(2);
    }
}
</script>