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
            <v-btn class = "mb-2 ml-2 mr-2" elevation="2" @click="submitOrder">Submit Order</v-btn>
        </v-col>
    </v-row>
    

</v-container>
</v-app>
</template>

<script>
import { currentOrder } from '~/static/temp-data';

export default {
    name: "OrderPage",
    layout: 'customer',
    data() {
        return {
            currentOrder,
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
            console.log(this.currentOrder);
            try {
                // no chance this works whatsoever but it is a start!
                await this.$axios.post('/menu', this.currentOrder);                                                                                                                                                     
            } catch (err) {
                console.log("ERROR");
                console.log(err);
            }
            this.currentOrder.length = 0;
            localStorage.setItem('currentOrder', JSON.stringify(this.currentOrder));
        }
    },
    mounted() {
        const storedOrder = localStorage.getItem('currentOrder');
        if (storedOrder) {
            this.currentOrder = JSON.parse(storedOrder);
        }
    }
}
</script>