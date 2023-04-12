<template>
    <v-app>
    <v-container>
        <v-row><v-col cols="12"><v-card ><v-card-title class="text-center">Breakfast</v-card-title ></v-card></v-col></v-row>
        
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
import { breakfast } from '~/static/temp-data';

export default {
    name: "BreakfastPage",
    layout: 'customer',
    data() {
        return {
            breakfast,
            menuItems: [
                {name: 'Item 1', img: '/breakfast.png', price: '$20.00'},
                {name: 'Item 2', img: '/dessert.png',  price: '$20.00'},
                {name: 'Item 3', img: '/drink.jpeg',  price: '$20.00'},
            ],
        };
    },
};
</script>