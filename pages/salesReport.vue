<template>
    <v-app>
    <v-container>
      <div class="chick-fil-a-theme">
        <div class="column-selectors">
            <v-menu ref="menu" v-model="menu" :close-on-content-click="false" :return-value.sync="date"
                transition="scale-transition"
                offset-y
                min-width="auto"
                >
                <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                    v-model="date"
                    label="Start Date"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    ></v-text-field>
                </template>
            <v-date-picker v-model="date" no-title scrollable>
                <v-spacer> </v-spacer>
                <v-btn text color="primary"  @click="menu = false">
                    Cancel
                </v-btn>
                <v-btn text color="primary" @click="$refs.menu.save(date)">
                    OK
                </v-btn>
            </v-date-picker>
        </v-menu>
        <v-menu ref="menu2" v-model="menu2" :close-on-content-click="false" :return-value.sync="date"
                transition="scale-transition"
                offset-y
                min-width="auto"
                >
                <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                    v-model="date"
                    label="End Date"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    ></v-text-field>
                </template>
            <v-date-picker v-model="date2" no-title scrollable>
                <v-spacer> </v-spacer>
                <v-btn text color="primary"  @click="menu2 = false">
                    Cancel
                </v-btn>
                <v-btn text color="primary" @click="$refs.menu2.save(date2)">
                    OK
                </v-btn>
            </v-date-picker>
        </v-menu>
        <v-spacer></v-spacer>
        <v-text-field v-model="startTime" label="Start Time" />
        <v-spacer></v-spacer>
        <v-text-field v-model="endTime" label="End Time" />


        </div>
        <v-data-table
          :headers="headers"
          :items="tableData"
        />
      </div>
    </v-container>
  </v-app>
  </template>
  
  <script>
  import { VDataTable, VCombobox, VTextField, VSelect } from 'vuetify/lib';
  
  export default {
    layout: 'manager',
    components: {
      VDataTable,
      VCombobox,
      VTextField,
      VSelect
    },
    data () {
      return {
        menuItem: null,
        menuPrice: null,
        combo: null,
        category: null,
        categories: ['Entree', 'Side', 'Beverage'],
        comboOptions: [
          { text: 'True', value: true },
          { text: 'False', value: false }
        ],
        // tableData: [
        //   { menuItem: 'Hamburger', menuPrice: '$5.00', combo: false, category: 'Entree' },
        //   { menuItem: 'French Fries', menuPrice: '$2.50', combo: true, category: 'Side' },
        //   { menuItem: 'Soft Drink', menuPrice: '$1.50', combo: true, category: 'Beverage' },
        // ],
        tableData: [{}],
        headers: [
          { text: 'Menu Item', value: 'menu_item' },
          { text: 'Menu Price', value: 'food_price' },
          { text: 'Combo', value: 'combo' },
          { text: 'Category', value: 'menu_cat' },
        ]
      }
    },
    
    /* Cole McAnelly's changes:
        `mounted` - runs after the component is created and mounted on the page
        `methods` - Added getMenu to fetch the menu, and possibly add refresh in the future
        `computed` - same as `data` but they are computed and *constantly* updated
    */
    mounted: function() {
      this.getSalesReport();
    },
    methods: {
      async getSalesReport () {
        try {
          const response = await this.$axios.get('/sales-report');
          this.tableData = response.data;
        } catch (err) {
          console.log("ERROR");
          console.log(err);
        }
      }

    },
    computed: {
      menuItems() { return this.tableData.map( _ => _.menuItem ); }
    },
  }
  </script>
  
  
  
  
  <style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Didact+Gothic&display=swap');
  body{
    font-family: 'Didact Gothic', sans-serif;
  }
  .chick-fil-a-theme {
    background-color: #E51636;
    color: #FFFFFF;
    font-weight: 300;
    font-family: 'Didact Gothic', sans-serif;
    /* width: calc(100% - 10px); */
    margin:0;

  }
  .menuName label{
    padding: 0 10px;
  }
    .column-selectors {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    /* .column-selectors v-combobox {
      width: 200px;
      padding: 10px;
      padding-left: 10px;
    } */
  </style>
  
  
  
  
