<template>
    <v-app>
    <v-container>
        <v-row><v-col cols="12"><v-card ><v-card-title class="text-center text-h3 font-weight-bold">Seasonal</v-card-title ></v-card></v-col></v-row>
        
        <v-row>
            <v-col cols="6" v-for="menuItem in comboMenuItems" :key="menuItem.id" class="d-flex justify-center">
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
    // import {totalPrice} from '~/static/temp-data'
    
    export default {
        name: "SeasonalPage",
        layout: 'customer',
        data() {
            return {
                currentOrder,
                // totalPrice: totalPrice,
                tableData: [{}],
                
            };
        },
        mounted: function() {
          this.getMenu();
        },
        methods: {
            async getMenu () {
                try {
                    const response = await this.$axios.get('/menu');
                    this.tableData = response.data;
                } catch (err) {
                    console.log("ERROR");
                    console.log(err);
                }
            },
            addItemToOrder(item) {
                console.log(item);
    
                // this.totalPrice = parseFloat(localStorage.getItem('totalPrice'));
                // this.totalPrice += parseFloat(item.food_price);
                this.$set(this.currentOrder, this.currentOrder.length, item);
                localStorage.setItem('currentOrder', JSON.stringify(this.currentOrder));
                // localStorage.setItem('totalPrice', this.totalPrice);
    
            },
        },
        computed: {
            comboMenuItems() { return this.tableData.filter( (menuItem) => menuItem.menu_cat === "seasonal" ); },
        },
    };
    </script>
    
    <style scoped>
    .keep-words {
        word-break: keep-all;
    }
    
    </style scoped>
    