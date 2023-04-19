<template>
  <v-card>
    <v-card-title class="primary--text">
      {{ title }}
      <v-divider v-if="!mobile" class="mx-4" inset vertical></v-divider>
      <v-spacer v-else></v-spacer>
      <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary"
              v-bind="attrs"
              v-on="on"
              outlined
            >
              New Item
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>
            <v-card-text>
              <!-- FORM cole todo sprint 3 -->
              <v-form ref="form" @submit.prevent="sumbit">
                <v-container>
                  <v-row>
                    <v-col 
                      v-for="(field, index) in headers"
                      v-if="field.text != 'Actions'"
                      :key="index"
                      cols="12" sm="6" md="4"
                    >
                      <v-text-field v-model="edited_item[field.value]" :label="field.text" required></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-form>
              <!-- END FORM -->
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue darken-1"
                text
                @click="close"
              >
                Cancel
              </v-btn>
              <v-btn
                color="blue darken-1"
                text
                @click="save"
              >
                Save
              </v-btn>
            </v-card-actions>
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
        <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
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
    props: {
      headers: Array,
      title: String,
      table: String
      // table: {
      //   type: String,
      //   validator(value) { return ['menu', 'supply'].includes(value); }
      // }
    },
    data: () => ({
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
    },

    beforeDestroy: function () {
      window.removeEventListener('resize', this.onResize)
    },

    methods: {
      async getTable () {
        try {
          // console.log("Getting table");
          const response = await this.$axios.get(`/${this.table}`);
          this.table_data = response.data;
        } catch (err) {
          console.log("ERROR getTable()");
          console.log(err);
        }
      },

      async deleteDBItem ( item ) {
        try {
          console.log(item);
          const response = await this.$axios.delete(`/${this.table}`, { data: item });
          console.log(response);
        } catch (err) { 
          console.log("ERROR deleteDBItem()");
          console.log(err);
        }
      },

      async newDBItem ( item ) {
        try {
          const response = await this.$axios.post(`/${this.table}`, item);
          console.log(response);
        } catch (err) { 
          console.log("ERROR newDBItem()");
          console.log(err);
        }
      },
      
      async updateDBItem ( item ) {
        try {
          const response = await this.$axios.put(`/${this.table}`, item);
          console.log(response);
        } catch (err) { 
          console.log("ERROR updateDBItem()");
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