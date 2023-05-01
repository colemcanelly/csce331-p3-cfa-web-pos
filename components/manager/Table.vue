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
    <!-- <v-col cols="12">
      <v-combobox
  label="Ingredients"
  :items="ingredients"
  multiple
  chips
  item-text="ingredient"
  item-value="ingredient"
  v-model="ingredients"
>
<template v-slot:item="{ item }">
  <v-chip>
    {{ item.ingredient }}
    <v-text-field
      v-model="item.editedPortionCount"
      type="number"
      min="0"
      class="ml-2"
      style="width: 30px"
    ></v-text-field>
    <v-btn class="save-btn" color="primary" text @click="savePortionCount(item)">Save</v-btn>
  </v-chip>
</template>
  <template v-slot:selection="{ item }">
    <v-chip>
      {{ item.ingredient }}
      <span v-if="item.portion_count">: {{ item.portion_count }}</span>
    </v-chip>
  </template>
</v-combobox>
    </v-col> --> 
                <!-- <v-col>
                  <v-dialog
                  v-model="dialog"
                  hide-overlay
                  transition="dialog-bottom-transition">
                    <v-btn>
                      Update
                    </v-btn>
                    <v-card>

                    </v-card>
                  </v-dialog>
                </v-col> -->
                <template>
  <v-container>
    <v-btn color="primary" @click= addNewIngredient()>Add New Ingredient</v-btn>
    
    <v-data-table
      :headers="ingredientHeaders.concat({text: 'Actions', value: 'actions', sortable: false})"
      :items="ingredients"
      hide-default-footer
    >
      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" @click="editIngredients(item)">mdi-pencil</v-icon>
        <v-icon small @click="deleteIngredients(item)">mdi-delete</v-icon>
      </template>
    </v-data-table>

    <v-dialog v-model="editDialog" max-width="500px">
      <v-card>
        <v-card-title>{{ editMode ? 'Edit Ingredient' : 'Add New Ingredient' }}</v-card-title>
        <v-card-text>
          <v-autocomplete
            v-model="editedIngredient.ingredient"
            :items="allIngredients"
            label="Ingredient"
            clearable
            hide-no-data
            return-object
            @change="onIngredientChange"
          >
        </v-autocomplete>
          <v-text-field label="Name" v-model="editedIngredient.ingredient" :disabled="isNameDisabled"/>
          <v-text-field label="Quantity" v-model="editedIngredient.portion_count" />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeEditDialog">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="editMode ? saveEditedIngredient : saveNewIngredient">
            {{ editMode ? 'Save' : 'Add' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
        <!-- Delete Item -->
        <v-dialog v-model="dialogIngDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
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
        name: '',
        quantity: ''
      },
      edited_ing_index:-1
    }),

    computed: {
      formTitle () {
        return this.edited_index === -1 ? 'New Item' : 'Edit Item'
      },
      mobile() { return this.windowWidth <= 600; },
      isNameDisabled() {
        return this.editMode;
      }
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
      dialogDelete (val) {
        val || this.closeDelete()
      },
      dialogIngDelete (val) {
        val || this.closeIngDelete()
      },
      editDialog (val){

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

      async newDBIng ( item ) {
        try {
          const response = await this.$axios.post(`/itemRecipe`, item);
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

      async updateDBIng ( item ) {
        try {
          const response = await this.$axios.put(`/itemRecipe`, item);
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
        console.log(this.ingredients)
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
        console.log(this.allIngredients)
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
    savePortionCount(item) {
    // find the index of the item in the ingredients array
    const index = this.ingredients.findIndex(ingredient => ingredient.id === item.id);

    // update the portion_count property of the item
    this.ingredients[index].portion_count = this.item.portion_count;
  },
  // editIngredients(item) {
  //     // Copy the item to the editedIngredient object
  //     this.editedIngredient = Object.assign({}, item);
  //     // Open the edit dialog
  //     this.editDialog = true;
  //   },
  //   closeEditDialog() {
  //     // Close the edit dialog and reset the editedIngredient object
  //     this.editDialog = false;
  //     this.editedIngredient = {};
  //   },
  //   saveEditedIngredient() {
  //     // Update the ingredient in the ingredients array with the new values
  //     const index = this.ingredients.findIndex(
  //       (ingredient) => ingredient.id === this.editedIngredient.id
  //     );
  //     this.$set(this.ingredients, index, this.editedIngredient);
  //     // Close the edit dialog and reset the editedIngredient object
  //     this.editDialog = false;
  //     this.editedIngredient = {};
  //   },
  editIngredients(item) {
      this.editMode = true;
      this.editedIngredient = Object.assign({}, item);
      this.edited_ing_index = this.ingredients.indexOf(item);
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
      // implementation for saving a new ingredient
    },
    saveEditedIngredient() {
      // implementation for saving an edited ingredient
    },
    closeEditDialog() {
      this.editDialog = false;
    },
    deleteIngredients(item) {
      // Find the index of the item to delete
      const index = this.ingredients.findIndex(
        (ingredient) => ingredient.id === item.id
      );
      // Remove the item from the ingredients array
      this.ingredients.splice(index, 1);
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

      deleteIng (item) {
        this.edited_index = this.table_data.indexOf(item);
        this.edited_item = Object.assign({}, item);
        this.dialogIngDelete = true;
      },

      deleteItemConfirm () {
        // Delete an item               NEED AXIOS HERE
        this.deleteDBItem(this.table_data[this.edited_index]);
        this.table_data.splice(this.edited_index, 1)
        this.closeDelete();
      },

      deleteIngConfirm(){
        this.deleteDBIng(this.ingredients[this.edited_index]);
        this.ingredients.splice(this.edited_index, 1)
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
      closeIngDelete () {
        this.dialogIngDelete = false;
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

      save () {
        if (this.edited_ing_index > -1) {
          // Editing Current item       NEED AXIOS HERE
          this.updateDBIng(this.edited_item);
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