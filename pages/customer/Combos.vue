<template>
<v-app>
<v-container>
    <v-row><v-col cols="12"><v-card ><v-card-title class="text-center">Combos</v-card-title ></v-card></v-col></v-row>
    
    <v-row>
        <v-col cols="6" v-for="(item, index) in menuItems" :key="index">
            <v-card >
                <v-card-title class="text-center">{{ item.name }}</v-card-title>
                <v-img :src="item.img"></v-img>
                <v-card-text class="text-center">{{  item.price }}</v-card-text>
                <v-btn class="mb-2 ml-2 mr-2" elevation="2" @click="addItemToOrder()">Add to Order</v-btn>
            </v-card>
        </v-col>
    </v-row>
    

</v-container>
</v-app>
</template>

<script>
import { combos } from '~/static/temp-data';
import { cartItems } from '~/static/temp-data';
// import basilBottle from '../assets/basil-bottle.webp';


{/* <div>
        <h1>Combos</h1>
        <div class="grid-wrap">
            <div 
            class="product-item"
            v-for="combo in combos"
            :key="combo.id"
            >
                <!-- <img :src="product.imageName" /> -->
                <h3 class="product-name"> {{ combo.name }}</h3>
                <p class="product-price"> {{ combo.price }}</p>
                <button @click="addItemToOrder()">Add to Order</button>
            </div>
        </div>
    </div> */}

export default {
    name: "CombosPage",
    layout: 'customer',
    data() {
        return {
            combos,
            cartItems,
            menuItems: [
                {name: 'Item 1', img: '/breakfast.png', price: '$20.00'},
                {name: 'Item 2', img: '/dessert.png',  price: '$20.00'},
                {name: 'Item 3', img: '/drink.jpeg',  price: '$20.00'},
            ],
        };
    },
    methods: {
        addItemToOrder() {
            const newItem = {
                id: '456',
                name: 'New Item',
                price: '$10.00',
                imageName: basilBottle,
            };
            console.log("about to push a cartItem");
            this.$set(this.cartItems, this.cartItems.length, newItem);
        }
    }
};
</script>

