<template>
  <v-container>
    <v-row>
      <v-col cols="8">
        <!-- <v-btn @click="translatePage('fr')">Translate to French</v-btn> -->
        <v-card>
          <v-tabs v-model="tab" show-arrows color="deep-purple-accent-4" align-tabs="center">
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
                  <v-col v-for="menuItem in currentMenuItems" :key="menuItem.id" cols="4" md="4">
                    <v-card class="menu-button" elevation="2" @click="addItemToOrder(menuItem)" style="padding: 0px;">
                        <v-card-title class="text-sm-center wrap-word keep-words " style="font-size: 14px; padding: 0px;">{{ menuItem.menu_item }}</v-card-title>
                        <!-- <v-img max-height="100" max-width="150" :src="menuItem.img"></v-img> -->
                        <v-card-text class="text-center" style="padding: 0px;">{{  menuItem.food_price }}</v-card-text>
                      
                    </v-card>
                  </v-col>
                </v-row>
              </v-container>
            </v-window-item>
          </v-window>
        </v-card>
      </v-col>
      <v-col cols="4">
        <v-card class="overflow-y-auto orders">
          <p>Order</p>
            <v-data-table
            :headers="headers.concat({text: 'Actions', value: 'actions', sortable: false})"
            :items="currentOrder"
            :search="search"
            hide-default-footer
            sort-by="calories"
            >
              <template v-slot:top>
                <!-- Delete Item -->
                <v-dialog v-model="dialogDelete" max-width="500px">
                  <v-card>
                    <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
                      <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
                      <v-spacer></v-spacer>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </template>
              <template v-slot:item.actions="{ item }">
                <v-icon small @click="removeItemFromOrder(item)">mdi-delete</v-icon>
              </template>
              <template v-slot:no-data>
                <v-btn color="primary">Add Menu Items</v-btn>
            </template>
          </v-data-table>
                              
          <!-- <v-btn class="mb-2 ml-2 mr-2" elevation="2" @click="removeItemFromOrder(item)">Remove From Order</v-btn> -->
        </v-card>

        <div class="text-center">
          <v-btn class="mb-2 ml-2 mr-2" elevation="2" @click="submitOrder">Submit Order</v-btn>
          <v-card-text class = "text-center">Total Price: ${{ this.totalPrice }}</v-card-text>
        </div>
        
      </v-col>

    </v-row>
  </v-container>
</template>

<style>
.overflow-y-auto {
  max-height: 62vh;
  min-height: 62vh;
}

.wrap-word {
  word-wrap: break-word;
  word-break: keep-all;
}

.menu-button {
  min-height: 100px;
}

.orders {
  margin-bottom: 20px;
}

</style>

<script>
import Header from '@/components/server/Header.vue'
// import {currentOrder} from '~/static/temp-data'

export default {
  layout: 'server',
  components: {
    Header
  },
  data() {
    return {
      tab: 1,
      windowTab: 1,
      totalPrice: 2,
      currentOrder: [],
      tableData: [],
      headers: [
        {text: 'Item', value: 'menu_item'},
        {text: 'Price', value: 'food_price'}

      ]
    };
  },
  mounted: function() {
      this.getMenu();
      for (this.i; this.i < this.currentOrder.length; this.i++) {
              this.totalPrice += parseFloat(this.currentOrder[this.i].food_price);
          }
          this.totalPrice = parseFloat(this.totalPrice).toFixed(2); 
    },
    methods: {

        async translatePage(target) {
          console.log("START - Translate page");
          //const body = { text: document.documentElement.innerHTML, target };
          const body = {text: 'Only work no play makes johnny goes crazy.', target};
          try {
            const response = await this.$axios.post('/translate', body);
            document.documentElement.innerHTML = response.data;
          } catch (error) {
            console.error(error);
          }
        },
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
            localStorage.setItem('currentOrder', JSON.stringify(this.currentOrder));
            this.totalPrice = this.computedTotalPrice;
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
        },
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