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
              v-if="field.text !== 'Actions'"
              :key="index"
              cols="12" sm="6" md="4"
            >
              <template v-if="field.value == 'menu_cat'">
                <v-autocomplete
                  v-model="edited_item[field.value]"
                  :label="field.text"
                  :items="categories"
                  required
                ></v-autocomplete>
              </template>
              <!-- <template v-else-if="field.value == 'combo'">
                <v-autocomplete
                v-model="edited_item[field.value]"
                  :label="field.text"
                  :items="combos"
                  required
                ></v-autocomplete>
              </template> -->
              <template v-else>
                <v-text-field
                  v-model="edited_item[field.value]"
                  :label="field.text"
                  required
                ></v-text-field>
              </template>
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
            :items="supplyIngredients"
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
        <div v-if="errorMessage">
          <v-snackbar v-model="snackbar">
          <span v-if="errorMessage">{{ errorMessage }}</span>
          <v-btn color="error" text @click="snackbar = false">
            Close
          </v-btn>
        </v-snackbar>
        </div>
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
    <div v-if="errorMessage">
            <v-snackbar v-model="snackbar">
            <span v-if="errorMessage">{{ errorMessage }}</span>
            <v-btn color="error" text @click="snackbar = false">
              Close
            </v-btn>
          </v-snackbar>
          </div>
  </v-card>
</template>

<script>
// Need `headers`, query, and other info passed in
  export default {
    data: () => ({
      title: "Menu",
      headers: [
        { text: 'Item Name', value: 'menu_item', },
          { text: 'Price ($)', value: 'food_price' },
          { text: 'Combo (T/F)', value: 'combo' },
          { text: 'Category', value: 'menu_cat' },
      ],
      ingredientHeaders:[
        { text: 'Ingredient', value: 'ingredient' },
        { text: 'Quantity', value: 'portion_count' },
      ],
      categories:[
          'main',
          'breakfast',
          'dessert',
          'drink',
          'condiment',
          'seasonal',
      ],
      combos:[
        'true',
        'false'
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
      supplyIngredients:[],
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
      errorMessage:'',
      snackbar:false


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
  /**

 * Generates a query for getting the ingredients from the supply


 * @author Ryan Paul 

 * @return {void}

 */
      async getSupply () {
              try {
                // console.log("Getting table");
                const response = await this.$axios.post(`/supplyIngredient`);
                this.supplyIngredients = response.data;
                // console.log(this.table_data);
              } catch (err) {
                console.log("ERROR getTable()");
                console.log(err);
              }
            },
/**

 * Generates a query for getting the menu item, price, combo, and cateogry from the menu


 * @author Ryan Paul 

 * @return {void}

 */
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
/**
 * This function adds two numbers.
 * @param {number} a - The first number.
 * @param {number} b - The second number.
 * @returns {number} - The sum of the two numbers.
 */
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
/**

 * Generates a query for deleting the menu item, ingredient, and portion quantity from the recipes


 * @author Ryan Paul 
* @param item - the whole ingredient item consisting of the ingredient items
 * @return {void}

 */
      async deleteDBIng ( item ) {
        try {
          console.log(item);
          const response = await this.$axios.delete(`/recipes`, { data: item });
          console.log("deleted;",response);
        } catch (err) { 
          console.log("ERROR deleteDBIng()");
          console.log(err);
        }
      },
/**

 * Generates a query for making a new menu item in the menu


 * @author Ryan Paul 
* @param item - the whole menu item consisting of the menu items
 * @return {void}

 */
      async newDBItem ( item ) {
        try {
          const response = await this.$axios.post(`/menu`, item);
          console.log(response);
        } catch (err) { 
          console.log("ERROR newDBItem()");
          console.log(err);
        }
      },
/**

 * Generates a query for making the ingredients for a menu item in the recipes


 * @author Ryan Paul 
* @param item - the whole ingredient item consisting of the ingredient items
 * @return {void}

 */
      async newDBIng ( item ) {
        try {
          console.log("NewDB: ",item);
          const response = await this.$axios.post(`/recipes`, item);
          console.log(response);
        } catch (err) { 
          console.log("ERROR newDBIng()");
          console.log(err);
        }
      },
/**

 * Generates a query for updating the menu item in the menu


 * @author Ryan Paul 
* @param item - the whole menu item consisting of the menu items

 * @return {void}

 */      
      async updateDBItem ( item ) {
        try {
          const response = await this.$axios.put(`/menu`, item);
          console.log(response);
        } catch (err) { 
          console.log("ERROR updateDBItem()");
          console.log(err);
        }
      },
/**

 * Generates a query for updating the ingredient item in the recipe


 * @author Ryan Paul 
* @param item - the whole ingredient item consisting of the ingredient items

 * @return {void}

 */    
      async updateDBIng ( item ) {
        try {
          const response = await this.$axios.put(`/recipes`, item);
          console.log(response);
        } catch (err) { 
          console.log("ERROR updateDBIng()");
          console.log(err);
        }
      },
/**

 * Generates a query for getting the ingredient item in the recipe


 * @author Ryan Paul 

 * @return {void}

 */
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
/**

 * Generates a query for getting all the ingredient based on the specific menu item


 * @author Ryan Paul 

 * @return {void}

 */
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
    /**

 * Function that combines getting the ingredients in recipe and supply


 * @author Ryan Paul 

 * @return {void}

 */
    async getIngredientsAndAllIngredients() {
      await this.getIngredients();
      await this.getAllIngredients();
      await this.getSupply();
    },
    /**

 * Function that changes the ingredient based on which one is selected when adding an ingredient


 * @author Ryan Paul 

 * @return {void}

 */

    onIngredientChange(newValue) {
      // set selectedIngredient to null if newValue is not in allIngredients
      this.selectedIngredient = this.supplyIngredients.includes(newValue) ? newValue : null;
    },
    /**

 * Function that saves the ingredient after editing it 


 * @author Ryan Paul 

 * @return {void}

 */
    saveIngredient() {
      if (this.editMode) {
        this.saveEditedIngredient();
      } else {
        this.saveNewIngredient();
      }
    },
    /**

 * Function that allows for the edited changes for an ingredient to be saved


 * @author Ryan Paul 
  * @param - ingredient items of current menu item
 * @return {void}

 */
    editIngredients(item) {
      this.editMode = true;
      this.editedIngredient = Object.assign({}, item);
      console.log(this.editedIngredient);
      this.edited_ing_index = this.ingredients.indexOf(item);
      console.log(this.edited_ing_index);
      this.editDialog = true;
    },
        /**

 * Function that allows to add a new ingredient to the menu items


 * @author Ryan Paul 

 * @return {void}

 */
    addNewIngredient() {
      this.editMode = false;
      this.editedIngredient = {
        name: '',
        quantity: ''
      };
      this.editDialog = true;
    },
            /**

 * Function that allows to add a save a new ingredient once the add button is clicked


 * @author Ryan Paul 

 * @return {void}

 */
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
      console.log("Combo",this.edited_item.combo)
      try {
        const currIngredient = {
          menu_item: this.edited_item.menu_item,
          ingredient: this.editedIngredient[this.ingredientHeaders[0].value],
          portion_count: this.editedIngredient[this.ingredientHeaders[1].value]
        };
        console.log(typeof currIngredient);
        console.log(currIngredient.menu_item," ", currIngredient.ingredient," ",currIngredient.portion_count);
        if (currIngredient.portion_count <= 0 || isNaN(currIngredient.portion_count)) {
          throw new Error("Quantity must be a positive number");
        } else {
          this.newDBIng(currIngredient);
          this.ingredients.push(currIngredient); // add new ingredient to ingredients array
          this.closeIngDelete();
        }
      } catch (error) {
        console.error(error);
        this.errorMessage = error.message; // set the error message
        this.snackbar = true; // show the snackbar
      }
    },
       /**

 * Function that allows to save an edit on a new ingredient once the save button is clicked


 * @author Ryan Paul 

 * @return {void}

 */
    saveEditedIngredient() {
      this.editDialog = false;
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
          if (currIngredient.portion_count <= 0 || isNaN(currIngredient.portion_count)) {
            throw new Error("Quantity must be a positive number");
          }
          else{
            this.updateDBIng(currIngredient)
            Object.assign(this.ingredients[this.edited_ing_index], this.editedIngredient);
            this.closeIngDelete();
          }
        } catch (error) {
          console.error(error);
          this.errorMessage = error.message; // set the error message
          this.snackbar = true; // show the snackbar
        }
    },
     /**

 * Function that allows the dialog to close when clicking close


 * @author Ryan Paul 

 * @return {void}

 */
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
         /**

 * Function that allows the edited Item to be stored


 * @author Ryan Paul 

 * @return {void}

 */
      editItem (item) {
        this.edited_index = this.table_data.indexOf(item);
        console.log(this.edited_index);
        this.edited_item = Object.assign({}, item);
        console.log(this.edited_item);
        this.dialog = true;
      },
         /**

 * Function that allows an Item to be deleted


 * @author Ryan Paul 

 * @return {void}

 */
      deleteItem (item) {
        this.edited_index = this.table_data.indexOf(item);
        this.edited_item = Object.assign({}, item);
        this.dialogDelete = true;
      },

               /**

 * Function that allows an ingredient to be deleted


 * @author Ryan Paul 

 * @return {void}

 */
      deleteIng (item) {
        this.edited_ing_index = this.ingredients.indexOf(item);
        this.editedIngredient = Object.assign({}, item);
        this.dialogIngDelete = true;
      },
         /**

 * Function that warns the user before a delete and actualy runs the delete query for menu items


 * @author Ryan Paul 

 * @return {void}

 */
      deleteItemConfirm () {
        // Delete an item               NEED AXIOS HERE
        const deletedItem = {
          menu_item: this.edited_item.menu_item,
        };
        this.deleteDBItem(deletedItem);
        this.table_data.splice(this.edited_index, 1)
        this.closeDelete();
      },
         /**

 * Function that warns the user before a delete and actualy runs the delete query for ingredients


 * @author Ryan Paul 

 * @return {void}

 */
      deleteIngConfirm(){
        const deleteIngr = {
          menu_item: this.edited_item.menu_item,
          ingredient: this.editedIngredient[this.ingredientHeaders[0].value],
        };
        this.deleteDBIng(deleteIngr);
        this.ingredients.splice(this.edited_ing_index, 1)
        this.closeIngDelete();
      },
         /**

 * Function that closes the dialog 


 * @author Ryan Paul 

 * @return {void}

 */
      close () {
        this.dialog = false;
        this.$nextTick(() => {
          this.edited_item = Object.assign({}, this.default_item);
          this.edited_index = -1;
        })
      },
         /**

 * Function that closes the dialog for delete button for menu 


 * @author Ryan Paul 

 * @return {void}

 */
      closeDelete () {
        this.dialogDelete = false;
        this.$nextTick(() => {
          this.edited_item = Object.assign({}, this.default_item);
          this.edited_index = -1;
        })
      },
               /**

 * Function that closes the dialog for delete button for ingredients


 * @author Ryan Paul 

 * @return {void}

 */
      closeIngDelete () {
        this.dialogIngDelete = false;
        this.$nextTick(() => {
          this.editedIngredient = Object.assign({}, this.default_item);
          this.edited_ing_index = -1;
        })
      },
         /**

 * Function that saves everything that is written in the edit/new item


 * @author Ryan Paul 

 * @return {void}

 */
      save () {
        try {
          if (this.edited_item.food_price <= 0 || isNaN(this.edited_item.food_price)) {
            throw new Error("Price must be a positive number");
          }
          else{
            if (this.edited_index > -1) {
              // Editing Current item       NEED AXIOS HERE
              this.updateDBItem(this.edited_item);
              Object.assign(this.table_data[this.edited_index], this.edited_item);
            } else {
              // Creating new item          NEED AXIOS HERE
              this.newDBItem(this.edited_item);
              this.table_data.push(this.edited_item);
            }
          }
        } catch (error) {
          console.error(error);
          this.errorMessage = error.message; // set the error message
          this.snackbar = true; // show the snackbar
        }
        this.close();
      },
               /**

 * Function that allows for resize and adjsts page width

 * @author Ryan Paul 

 * @return {void}

 */

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