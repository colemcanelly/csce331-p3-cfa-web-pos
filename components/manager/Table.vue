<template>
  <v-card>
    <v-card-title class="primary--text">
      {{ title }}
      <v-divider v-if="!mobile" class="mx-4" inset vertical></v-divider>
      <v-spacer v-else></v-spacer>
      <v-dialog v-model="dialog"
      persistent
      hide-overlay
      transition="dialog-bottom-transition">
  <template v-slot:activator="{ on, attrs }">
    <v-btn
      color="primary"
      v-bind="attrs"
      v-on="on"
      outlined
      @click="getIngredients"
    >
      New Item
      <v-icon>mdi-plus</v-icon>
    </v-btn>
  </template>
  <v-card>
        <v-toolbar
          dark
          color="primary"
        >
          <v-btn
            icon
            dark
            @click="close"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Menu Item</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn
              dark
              text
              @click="save"
            >
              Save
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
  <v-form ref="form" @submit.prevent="submit">
        <v-container>
          <v-row>
            <v-col 
              v-for="(field, index) in headers"
              v-if="field.text != 'Actions'"
              :key="index"
              cols="12" sm="6" md="4"
            >
              <v-text-field v-model="edited_item[field.value]" :label="field.text" required ></v-text-field>
          <!-- {{ console.log(index) }} -->
            </v-col>
          </v-row>
          <v-row>
          <v-col cols="12">
            <v-card>
              <v-card-title>
                Ingredients
              </v-card-title>
            <v-data-table
              :headers="ingredientHeaders"
              :items = "ingredients"
              :search="search"
            >
          </v-data-table>
        </v-card>
          </v-col>
        </v-row>
        </v-container>
  </v-form>
</v-card>

</v-dialog>
      <v-spacer v-show="!mobile"></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table
      :headers="headers.concat({text: 'Actions', value: 'actions', sortable: false})"
      :items="table_data"
      :search="search"
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
        <v-icon small class="mr-2" @click="editItem(item); getIngredients()">mdi-pencil</v-icon>
        <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="getTable">Reset</v-btn>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
// Need `headers`, query, and other info passed in
  export default {
    data: () => ({
      title: "Menu",
      headers: [
        { text: 'Item Name', value: 'menu_item', sortable: false },
          { text: 'Price ($)', value: 'food_price' },
          { text: 'Combo (T/F)', value: 'combo' },
          { text: 'Category', value: 'menu_cat' },
      ],
      ingredientHeaders:[
        { text: 'Ingredient', value: 'ingredient' },
      ],
      search: '',
      windowWidth: null,
      dialog: false,
      dialogDelete: false,
      table_data: [],
      edited_index: -1,
      default_item: Object.freeze({
        name: null,
        calories: null,
        fat: null,
        carbs: null,
        protein: null,
      }),
      edited_item: {
        name: null,
        calories: null,
        fat: null,
        carbs: null,
        protein: null,
      },
      items: ['Apple', 'Banana', 'Cherry', 'Durian', 'Eggplant'],
      ingredients:[]
    }),

    computed: {
      formTitle () {
        return this.edited_index === -1 ? 'New Item' : 'Edit Item'
      },
      mobile() { return this.windowWidth <= 600; }
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
      dialogDelete (val) {
        val || this.closeDelete()
      },
    },

    created: function () {
      // this.initialize()
    },

    mounted: function () {
      this.$nextTick(() => {
        window.addEventListener('resize', this.onResize);
      });
      this.getTable();
      this.onResize();
      this.getIngredients();
    },

    beforeDestroy: function () {
      window.removeEventListener('resize', this.onResize)
    },

    methods: {
    submit() {
      // HANDLE FORM SUBMISSION HERE
    },
    save() {
      // HANDLE SAVE ACTION HERE
    },
    close() {
      // HANDLE CANCEL ACTION HERE
    },
    openIngredientDialog() { // NEW METHOD
      this.ingredientDialog = true;
    },
    // printItemName() {
    //   console.log(this.edited_item[menu_item]);
    // },
    logFieldText(fieldText) {
    console.log(fieldText);
  },
  
      async getTable () {
        try {
          // console.log("Getting table");
          const response = await this.$axios.get(`/menu`);
          this.table_data = response.data;
          // console.log(this.table_data);
        } catch (err) {
          console.log("ERROR getTable()");
          console.log(err);
        }
      },

      async deleteDBItem ( item ) {
        try {
          console.log(item);
          const response = await this.$axios.delete(`/menu`, { data: item });
          console.log(response);
        } catch (err) { 
          console.log("ERROR deleteDBItem()");
          console.log(err);
        }
      },

      async newDBItem ( item ) {
        try {
          const response = await this.$axios.post(`/menu`, item);
          console.log(response);
        } catch (err) { 
          console.log("ERROR newDBItem()");
          console.log(err);
        }
      },
      
      async updateDBItem ( item ) {
        try {
          const response = await this.$axios.put(`/menu`, item);
          console.log(response);
        } catch (err) { 
          console.log("ERROR updateDBItem()");
          console.log(err);
        }
      },

      async getIngredients() {
      try {
        // console.log(this.edited_item.menu_item);
        const menuItem = {
          menu_item: this.edited_item.menu_item
        };
        // console.log("Menu Item", menuItem);
        const response = await this.$axios.post("/itemRecipe",menuItem);
        // console.log(response);
        this.ingredients = response.data;
        console.log(this.ingredients[2])
      } catch (err) {
        console.log(this.edited_item.menu_item);
        console.log("ERROR getIngredients()");
        console.log(err);
      }
    },

      editItem (item) {
        this.edited_index = this.table_data.indexOf(item);
        this.edited_item = Object.assign({}, item);
        this.dialog = true;
      },

      deleteItem (item) {
        this.edited_index = this.table_data.indexOf(item);
        this.edited_item = Object.assign({}, item);
        this.dialogDelete = true;
      },

      deleteItemConfirm () {
        // Delete an item               NEED AXIOS HERE
        this.deleteDBItem(this.table_data[this.edited_index]);
        this.table_data.splice(this.edited_index, 1)
        this.closeDelete();
      },

      close () {
        this.dialog = false;
        this.$nextTick(() => {
          this.edited_item = Object.assign({}, this.default_item);
          this.edited_index = -1;
        })
      },

      closeDelete () {
        this.dialogDelete = false;
        this.$nextTick(() => {
          this.edited_item = Object.assign({}, this.default_item);
          this.edited_index = -1;
        })
      },

      save () {
        if (this.edited_index > -1) {
          // Editing Current item       NEED AXIOS HERE
          this.updateDBItem(this.edited_item);
          Object.assign(this.table_data[this.edited_index], this.edited_item);
          console.log("Edited Item= ", this.edited_item.menu_item)
        } else {
          // Creating new item          NEED AXIOS HERE
          this.newDBItem(this.edited_item);
          this.table_data.push(this.edited_item);
        }
        this.close();
      },

      onResize() {
        this.windowWidth = window.innerWidth;
      }
    },
  }
</script>