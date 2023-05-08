<template>
    <v-app>
    <v-container>
        <v-row><v-col cols="12"><v-card ><v-card-title style="font-size:30px" class="text-center text-h3 font-weight-bold">Drinks</v-card-title ></v-card></v-col></v-row>
       
        <v-row>
            <v-col cols="6" v-for="menuItem in drinkMenuItems" :key="menuItem.id" class="d-flex justify-center">
                <v-card class="mx-auto d-flex flex-column align-self-center" style="height: 100%">
                    <v-card-title class="text-center keep-words text-h5">{{ menuItem.menu_item }}</v-card-title>
                    <v-img :src="menuItem.img" contain></v-img>
                    <v-card-text class="text-center" style="flex-grow: 1">${{  menuItem.food_price }}</v-card-text>
                    <v-btn class="mt-auto mb-2 ml-2 mr-2" elevation="2" @click="addItemToOrder(menuItem)">Add to Order</v-btn>
                </v-card>
            </v-col>
        </v-row>
       
   
    </v-container>
    </v-app>
    </template>
 
 
 <script>
 import {currentOrder} from '~/static/temp-data'
 
 
 export default {
    name: "DrinksPage",
    layout: 'customer',
    data() {
        return {
            currentOrder,
            tableData: [{}],
           
        };
    },
    /**
     * retrieves the menu upon every refresh
     */
    mounted: function() {
      this.getMenu();
    },
    methods: {

        /**
     * @module Drinks
     */
        /**
         * axios call to retrieve menu and store in tableData
        */
        async getMenu () {
            try {
                const response = await this.$axios.get('/menu');
                this.tableData = response.data;
            } catch (err) {
                console.log("ERROR");
                console.log(err);
            }
        },
        /**
         * updates the currentOrder array to include the passed in item
         * @param item - a menu item object with accessible attributes
         * (like price, name, image url)
         */
        addItemToOrder(item) {
            console.log(item);
 
 
            this.$set(this.currentOrder, this.currentOrder.length, item);
            localStorage.setItem('currentOrder', JSON.stringify(this.currentOrder));
 
 
        },
    },
     /**
     * filters menu items by menu_cat attribute (in this case, breakfast) each time function
     * is called within the v-for loop included in the html
     */
    computed: {
        drinkMenuItems() { return this.tableData.filter( (menuItem) => menuItem.menu_cat === "drink" ); },
    },
 };
 </script>
 
 
 <style scoped>
 .keep-words {
    word-break: keep-all;
 }
 
 
 </style scoped>
 