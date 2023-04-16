<template>
<v-app>
<v-container>
    <v-row><v-col cols="12"><v-card ><v-card-title class="text-center">Combos</v-card-title ></v-card></v-col></v-row>
    
    <v-row>
        <v-col cols="6" v-for="menuItem in comboMenuItems" :key="menuItem.id">
            <v-card >
                <v-card-title class="text-center">{{ menuItem.menu_item }}</v-card-title>
                <v-img :src="menuItem.img"></v-img>
                <v-card-text class="text-center">{{  menuItem.food_price }}</v-card-text>
                <v-btn class="mb-2 ml-2 mr-2" elevation="2" @click="addItemToOrder(menuItem)">Add to Order</v-btn>
            </v-card>
        </v-col>
    </v-row>
    

</v-container>
</v-app>
</template>

<script>
import {currentOrder} from '~/static/temp-data'

export default {
    name: "CombosPage",
    layout: 'customer',
    data() {
        return {
            currentOrder,
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

            this.$set(this.currentOrder, this.currentOrder.length, item);
            localStorage.setItem('currentOrder', JSON.stringify(this.currentOrder));

        },
    },
    computed: {
        comboMenuItems() { return this.tableData.filter( (menuItem) => menuItem.menu_cat === "main" ); },
    },
};
</script>

