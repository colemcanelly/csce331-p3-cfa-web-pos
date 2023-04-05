<template>
    <v-app>
    <v-container>
        <div class="chick-fil-a-theme">
      <div class="column-selectors">
        <v-combobox v-model="ingredient" :items="ingredients" label="Ingredient" />
        <v-text-field v-model="threshold" label="Threshold" />
        <v-text-field v-model="supply_quantity" label="Supply Quantity" />
      </div>
      <v-data-table :headers="headers" :items="tableData" />
    </div>
</v-container>
  </v-app>
  </template>
  
  <script>
  import { VDataTable, VCombobox, VTextField, VSelect } from 'vuetify/lib'
  
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
        ingredient: null,
        threshold: null,
        supply_quantity:null,
        ingredients: ['Buns', 'Chicken', 'Pickles'],
        tableData: [
          { ingredient: 'Buns', threshold: '100', supply_quantity: '400'},
          { ingredient: 'Chicken', threshold: '250', supply_quantity: '500'},
          { ingredient: 'Pickles', threshold: '150', supply_quantity: '300' },
        ],
        headers: [
          { text: 'Ingredient', value: 'ingredient' },
          { text: 'Threshold', value: 'threshold' },
          { text: 'Supply Quantity', value: 'supply_quantity' },
        ]
      }
    }
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
      
    .column-selectors {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

  </style>
  
  
  
  
