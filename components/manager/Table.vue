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
      @click="getIngredientsAndAllIngredients"
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

  <template>
  <v-container>
    <v-btn color="primary" @click= addNewIngredient()>Add Ingredient</v-btn>
    
    <v-data-table
      :headers="ingredientHeaders.concat({text: 'Actions', value: 'actions', sortable: false})"
      :items="ingredients"
      hide-default-footer
    >
      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" @click="editIngredients(item)">mdi-pencil</v-icon>
        <v-icon small @click="deleteIng(item)">mdi-delete</v-icon>
      </template>
    </v-data-table>

    <v-dialog v-model="editDialog" max-width="500px">
      <v-card>
        <v-card-title>{{ editMode ? 'Edit Ingredient' : 'Add Ingredient' }}</v-card-title>
        <v-card-text>
          <template v-if="!editMode">
            <!-- <v-text-field  v-if="showIng"  label="New Ingredient" v-model="editedIngredient[ingredientHeaders[0].value]" :disabled="addOrEdit"/> -->
          <!-- <template v-if="!editMode"> -->
          <v-autocomplete
            v-model="editedIngredient[ingredientHeaders[0].value]"
            :items="allIngredients"
            item-text="ingredient"
            label="Ingredient"
            clearable
            hide-no-data
            @change="onIngredientChange"
            :item-disabled="item => ingredients.some(i => i.ingredient === item.ingredient)"
          >
        </v-autocomplete>
      </template>
      <template>
          <v-text-field label="Quantity" v-model="editedIngredient[ingredientHeaders[1].value]" />
        </template>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeEditDialog">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="saveIngredient">
            {{ editMode ? 'Save' : 'Add' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
        <!-- Delete Item -->
        <v-dialog v-model="dialogIngDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h6">Are you sure you want to delete this item?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeIngDelete">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="deleteIngConfirm">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
  </v-container>
</template>
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
            <v-card-title class="text-h6">Are you sure you want to delete this item?</v-card-title>
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
        <v-icon small class="mr-2" @click="editItem(item); getIngredientsAndAllIngredients()">mdi-pencil</v-icon>
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
        { text: 'Quantity', value: 'portion_count' },
      ],
      search: '',
      windowWidth: null,
      dialog: false,
      dialogDelete: false,
      dialogIngDelete: false,
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
        },
      ingredients:[],
      allIngredients:[],
      items: [
          'Programming',
          'Design',
          'Vue',
          'Vuetify',
        ],
      //   editDialog: false,
      // editedIngredient: {},
      editDialog: false,
      editMode: false,
      editedIngredient: {
      },
      edited_ing_index:-1,
      ingredientName1: '',
      ingredientName2: '',
      ingredientQuantity:'',
      // showIng: false,
      newIngredients:[],


    }),

    computed: {
      formTitle () {
        return this.edited_index === -1 ? 'New Item' : 'Edit Item'
      },
      mobile() { return this.windowWidth <= 600; },
      addOrEdit() {
        return this.editMode;
      },
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
      dialogDelete (val) {
        val || this.closeDelete()
      },
      dialogIngDelete (val){
        val || this.closeIngDelete()
      },
      // dialogIngDelete (val) {
      //   val || this.closeIngDelete()
      // },
      editDialog (val){
        val || this.closeEditDialog()
      }
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

      async deleteDBIng ( item ) {
        try {
          console.log(item);
          const response = await this.$axios.delete(`/itemRecipe`, { data: item });
          console.log("deleted;",response);
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

      async newDBIng ( item ) {
        try {
          console.log("NewDB: ",item);
          const response = await this.$axios.post(`/itemRecipe`, item);
          console.log(response);
        } catch (err) { 
          console.log("ERROR newDBIng()");
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

      async updateDBIng ( item ) {
        try {
          const response = await this.$axios.put(`/itemRecipe`, item);
          console.log(response);
        } catch (err) { 
          console.log("ERROR updateDBIng()");
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
        const response = await this.$axios.post("/itemIngredients",menuItem);
        // console.log(response);
        this.ingredients = response.data;
      } catch (err) {
        console.log(this.edited_item.menu_item);
        console.log("ERROR getIngredients()");
        console.log(err);
      }
    },

    async getAllIngredients(){
      try {
        // console.log("Menu Item", menuItem);
        const response = await this.$axios.post("/ingredients");
        // console.log(response);
        this.allIngredients = response.data;
      } catch (err) {
        console.log(this.edited_item.menu_item);
        console.log("ERROR getIngredients()");
        console.log(err);
      }
    },
    async getIngredientsAndAllIngredients() {
      await this.getIngredients();
      await this.getAllIngredients();
    },
    onIngredientChange(newValue) {
      // set selectedIngredient to null if newValue is not in allIngredients
      this.selectedIngredient = this.allIngredients.includes(newValue) ? newValue : null;
    },

    saveIngredient() {
      if (this.editMode) {
        this.saveEditedIngredient();
      } else {
        this.saveNewIngredient();
      }
    },

    editIngredients(item) {
      this.editMode = true;
      this.editedIngredient = Object.assign({}, item);
      console.log(this.editedIngredient);
      this.edited_ing_index = this.ingredients.indexOf(item);
      console.log(this.edited_ing_index);
      this.editDialog = true;
    },
    addNewIngredient() {
      this.editMode = false;
      this.editedIngredient = {
        name: '',
        quantity: ''
      };
      this.editDialog = true;
    },
    saveNewIngredient() {
        this.editDialog = false;
        if (this.edited_index > -1) {
          // Editing Current item       NEED AXIOS HERE
          this.updateDBItem(this.edited_item);
          Object.assign(this.table_data[this.edited_index], this.edited_item);
          this.updateDBIng(this.edited_item)
          console.log("Edited Item= ", this.edited_item.menu_item)
        } else {
          // Creating new item          NEED AXIOS HERE
          this.newDBItem(this.edited_item);
          this.table_data.push(this.edited_item);
        }
        try {
          const currIngredient = {
            menu_item: this.edited_item.menu_item,
            ingredient: this.editedIngredient[this.ingredientHeaders[0].value],
            portion_count: this.editedIngredient[this.ingredientHeaders[1].value]
          };
          console.log(typeof currIngredient);
          console.log(currIngredient.menu_item," ", currIngredient.ingredient," ",currIngredient.portion_count);
          this.newDBIng(currIngredient);
          this.ingredients.push(currIngredient); // add new ingredient to ingredients array
          this.closeIngDelete();
        } catch (error) {
          console.error(error);
        }
      },
    saveEditedIngredient() {
      console.log("saveEditedIngredient called");
      // this.editDialog = true;
      this.editMode = true;
        if (this.edited_index > -1) {
          // Editing Current item       NEED AXIOS HERE
          this.updateDBItem(this.edited_item);
          Object.assign(this.table_data[this.edited_index], this.edited_item);
          console.log("Edited Item= ", this.edited_item.menu_item);
        } else {
          // Creating new item          NEED AXIOS HERE
          this.newDBItem(this.edited_item);
        }
        try {
          const currIngredient = {
            menu_item: this.edited_item.menu_item,
            ingredient: this.editedIngredient[this.ingredientHeaders[0].value],
            portion_count: this.editedIngredient[this.ingredientHeaders[1].value]
          };
          console.log("Edited:", currIngredient.portion_count);
          this.updateDBIng(currIngredient)
          Object.assign(this.ingredients[this.edited_ing_index], this.editedIngredient);
          this.closeIngDelete();
        } catch (error) {
          console.error(error);
        }
    },
    closeEditDialog() {
      this.editDialog = false;
      this.$nextTick(() => {
          this.editedIngredient = Object.assign({}, this.default_item);
          this.edited_ing_index = -1;
        })
    },
    // deleteIngredients(item) {
    //   // Find the index of the item to delete
    //   const index = this.ingredients.findIndex(
    //     (ingredient) => ingredient.id === item.id
    //   );
    //   // Remove the item from the ingredients array
    //   this.ingredients.splice(index, 1);
    // },
      editItem (item) {
        this.edited_index = this.table_data.indexOf(item);
        console.log(this.edited_index);
        this.edited_item = Object.assign({}, item);
        console.log(this.edited_item);
        this.dialog = true;
      },

      deleteItem (item) {
        this.edited_index = this.table_data.indexOf(item);
        this.edited_item = Object.assign({}, item);
        this.dialogDelete = true;
      },

      deleteIng (item) {
        this.edited_ing_index = this.ingredients.indexOf(item);
        this.editedIngredient = Object.assign({}, item);
        this.dialogIngDelete = true;
      },

      deleteItemConfirm () {
        // Delete an item               NEED AXIOS HERE
        this.deleteDBItem(this.table_data[this.edited_index]);
        this.table_data.splice(this.edited_index, 1)
        this.closeDelete();
      },

      deleteIngConfirm(){
        const deleteIngr = {
          menu_item: this.edited_item.menu_item,
          ingredient: this.editedIngredient[this.ingredientHeaders[0].value],
        };
        this.deleteDBIng(deleteIngr);
        this.ingredients.splice(this.edited_ing_index, 1)
        this.closeIngDelete();
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
      closeIngDelete () {
        this.dialogIngDelete = false;
        this.$nextTick(() => {
          this.editedIngredient = Object.assign({}, this.default_item);
          this.edited_ing_index = -1;
        })
      },

      save () {
        if (this.edited_index > -1) {
          // Editing Current item       NEED AXIOS HERE
          this.updateDBItem(this.edited_item);
          Object.assign(this.table_data[this.edited_index], this.edited_item);
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
<style>
  .save-btn {
    width: 80px; /* adjust the width as needed */
    margin-left: 5px; /* add a margin for spacing */
  }
  .readonly-field {
  background-color: #f2f2f2;
  color: #777;
}
</style>