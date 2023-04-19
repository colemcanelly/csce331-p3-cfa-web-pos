<template>
    <v-card>
      <v-card-title>
        {{ title }}
        <v-divider v-if="!mobile" class="mx-4" inset vertical></v-divider>
      <v-spacer v-else></v-spacer>
        <v-btn
              color="primary"  
              outlined
              @click="generate"
            >
              Generate
              <v-icon>mdi-check-bold</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
<v-row>
    <v-col
      cols="12"
      sm="2"
    >
      <v-menu
        ref="menuStart"
        v-model="menuStart"
        :close-on-content-click="false"
        :return-value.sync="startDate"
        transition="scale-transition"
        offset-y
        min-width="auto"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="startDate"
            label="Start Date"
            prepend-icon="mdi-calendar"
            readonly
            v-bind="attrs"
            v-on="on"
            clearable
          ></v-text-field>
        </template>
        <v-date-picker
          v-model="startDate"
          no-title
          scrollable
        >
          <v-spacer></v-spacer>
          <v-btn
            text
            color="primary"
            @click="menuStart = false"
          >
            Cancel
          </v-btn>
          <v-btn
            text
            color="primary"
            @click="$refs.menuStart.save(startDate)"
          >
            OK
          </v-btn>
        </v-date-picker>
      </v-menu>
    </v-col>

    <v-col
      cols="12"
      sm="2"
    >
      <v-menu
        ref="menuEnd"
        v-model="menuEnd"
        :close-on-content-click="false"
        :return-value.sync="endDate"
        transition="scale-transition"
        offset-y
        min-width="auto"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="endDate"
            label="End Date"
            prepend-icon="mdi-calendar"
            readonly
            v-bind="attrs"
            v-on="on"
            clearable
          ></v-text-field>
        </template>
        <v-date-picker
          v-model="endDate"
          no-title
          scrollable
        >
          <v-spacer></v-spacer>
          <v-btn
            text
            color="primary"
            @click="menuEnd = false"
          >
            Cancel
          </v-btn>
          <v-btn
            text
            color="primary"
            @click="$refs.menuEnd.save(endDate)"
          >
            OK
          </v-btn>
        </v-date-picker>
        
      </v-menu>
      
    </v-col>
    <v-col
          cols="6"
          sm="2"
        >
          <v-text-field
            v-model="startTime"
            label="Start Time"
            clearable
          ></v-text-field>
        </v-col>
        <v-col
          cols="6"
          sm="2"
        >
          <v-text-field
            v-model="endTime"
            label="End Time"
            clearable
          ></v-text-field>
        </v-col>
        <v-col
        cols="12"
          sm="4">
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
        </v-col>
  </v-row>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="desserts"
        :search="search"
      ></v-data-table>
    </v-card>
  </template>

  <script>
  // Need `headers`, query, and other info passed in
    export default {
        
      props: {
        headers: Array,
        title: String,
        table: String,
      },
      data: () => ({
        return {
            : '',
        },
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
          date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      menu: false,
      modal: false,
      menu2: false,
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
        this.getSalesTable();
        this.onResize();
      },
  
      beforeDestroy: function () {
        window.removeEventListener('resize', this.onResize)
      },
  
      methods: {
        async getSalesTable () {
            const orderData = {
                start_date: this.startDate,
                end_date: this.endDate,
                start_time: this.startTime,
                end_time:this.endTime
            };
            try {
              const response = await this.$axios.post('/sales-report', orderData);
              console.log(response);
              //this.tableData = response.data
              //this.tableData = response.data;
            }
         catch (err) {
            console.log("ERROR");
            console.log(err);
          }
        },
  
        generate (item) {
          this.edited_index = this.table_data.indexOf(item)
          this.edited_item = Object.assign({}, item)
          this.dialog = true
        },
  
        onResize() {
          this.windowWidth = window.innerWidth;
        }
      },
    }
  </script>