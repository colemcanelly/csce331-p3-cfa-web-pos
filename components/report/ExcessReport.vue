<template>
  <v-card>
    <v-card-title>
      {{ title }}
      <v-divider v-if="!mobile" class="mx-4" inset vertical></v-divider>
    <v-spacer v-else></v-spacer>
      <v-btn
            color="primary"  
            outlined
            @click="generate(startDate)"
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
</v-row>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="table_data"
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
  data() {
    return {
      startDate: new Date().toISOString().substr(0, 10),
      menuStart: false,
      search: '',
    windowWidth: null,
    table_data: [],
    start_date: null ,
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
    }
    
  },

  computed: {
    formTitle() {
      return this.edited_index === -1 ? 'New Item' : 'Edit Item'
    },
    mobile() { return this.windowWidth <= 600; }
  },

  watch: {
  },

  created: function () {
    // this.initialize()
  },

  // mounted: function () {
  //   this.$nextTick(() => {
  //     window.addEventListener('resize', this.onResize);
  //   });
  //   this.getSalesTable();
  //   this.onResize();
  // },

  beforeDestroy: function () {
    window.removeEventListener('resize', this.onResize)
  },

  methods: {
    async getExcessTable(startDate) {
      
      if (!startDate) {
        console.log('ERROR: startDate is undefined');
        return;
      }

      const Data = {
        date: startDate,
      };
      try {
        console.log(Data);
        const response = await this.$axios.post('/excess-report', Data);
        this.table_data = response.data;
        console.log(response);
        //this.tableData = response.data
        
      }
      catch (err) {
        console.log("ERROR when generating");
        console.log(err);
      }
    },

    async generate(startDate) {
      if (!this.startDate) {
        console.error('Start date is not defined')
        return
      }
      console.log("GENERATING");
      await this.getExcessTable(startDate);
      // this.edited_index = this.table_data.indexOf(item)
      // this.edited_item = Object.assign({}, item)
      // this.dialog = true
    },

    onResize() {
      this.windowWidth = window.innerWidth;
    }
  },
}
</script>