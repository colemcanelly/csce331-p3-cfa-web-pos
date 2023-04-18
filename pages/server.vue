<template>
  <v-container>
    <v-row>
      <v-col cols="8">
        <v-card>
          <v-tabs v-model="tab" color="deep-purple-accent-4" align-tabs="center">
            <v-tab :value="0">Main</v-tab>
            <v-tab :value="1">breakfast</v-tab>
            <v-tab :value="2">Drinks</v-tab>
            <v-tab :value="3">Condiments</v-tab>
            <v-tab :value="4">Desserts</v-tab>
            <v-tab :value="5">Seasonal</v-tab>
          </v-tabs>
          <v-window v-model="windowTab" class="overflow-y-auto">
            <v-window-item v-for="n in 5" :key="n" :value="n">
              <v-container fluid>
                <v-row>
                  <v-col v-for="menuItem in currentMenuItems" :key="menuItem.id" cols="12" md="4">
                    <v-btn elevation="2" @click="addItemToOrder(menuItem)">
                        <v-card-title class="text-center">{{ menuItem.menu_item }}</v-card-title>
                        <v-img :src="menuItem.img"></v-img>
                        <v-card-text class="text-center">{{  menuItem.food_price }}</v-card-text>
                    </v-btn>
                    
                  </v-col>
                </v-row>
              </v-container>
            </v-window-item>
          </v-window>
        </v-card>
      </v-col>
      <v-col cols="4">
        <v-card class="overflow-y-auto">
          <p>Order</p>
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
        </v-card>
      </v-col>

    </v-row>
  </v-container>
</template>

<style>
.overflow-y-auto {
  max-height: 50vh;
}
</style>

<script>
// import {currentOrder} from '~/static/temp-data'

export default {
  layout: 'server',
  data() {
    return {
      tab: 1,
      windowTab: 1,
      currentOrder: [],
      tableData: [],
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
        },
        removeItemFromOrder(item) {
            const index = this.currentOrder.findIndex(obj => obj === item)
            if (index !== -1) {
                this.currentOrder.splice(index,1);
            }
            console.log(this.currentOrder)
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
            //localStorage.setItem('currentOrder', JSON.stringify(this.currentOrder));
          }
          else{
            console.log("CurrentOrder.length == 0");
          }
        }
    },
    computed: {
      currentCategory() {
        console.log(this.tab);
        switch (this.tab) {
          case 0:
            return 'main';
          case 1:
            return 'breakfast';
          case 2:
            return 'drink';
          case 3:
            return 'condiment';
          case 4:
            return 'dessert';
          case 5:
            return 'seasonal';
        }
      },
      currentMenuItems() {
        console.log(this.currentCategory);
        return this.tableData.filter((menuItem) => menuItem.menu_cat === this.currentCategory);
      },
    },

};
</script>