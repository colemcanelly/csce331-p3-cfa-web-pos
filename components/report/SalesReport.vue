<template>
  <v-card>
    <v-card-title>
      {{ title }}
      <v-divider v-if="!mobile" class="mx-4" inset vertical></v-divider>
    <v-spacer v-else></v-spacer>
      <v-btn
            color="primary"  
            outlined
            @click="generate(startDate,endDate,startTime,endTime)"
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
          type="time"
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
            type="time"
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
      <v-col cols="12" sm="8" md="4">
        <v-card>
          <v-card-title class="text-center" v-if="total">
            total = {{ total.total_revenue.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) }}
          </v-card-title>
        </v-card>
      </v-col>
      

</v-row>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="table_data"
      :search="search"
    >
    <template v-slot:item.revenue="{ item }">
    {{ item.revenue.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) }}
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
    table: String,
  },
  data() {
    return {
      startDate: new Date().toISOString().substr(0, 10),
      endDate: new Date().toISOString().substr(0, 10),
      startTime: new Date().toLocaleTimeString('en-US', {hour12: false}),
      endTime: new Date().toLocaleTimeString('en-US', {hour12: false}),
      total: 0.00,
      menuStart: false,
      menuEnd: false,
      search: '',
      windowWidth: null,
      table_data: [],
      start_date: null ,
      edited_index: -1,

    edited_item: {
      fat: null,
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

  mounted: function () {
    this.$nextTick(() => {
      window.addEventListener('resize', this.onResize);
    });
    // this.getSalesTable();
    this.onResize();
  },

  beforeDestroy: function () {
    window.removeEventListener('resize', this.onResize)
  },

  methods: {
    async getSalesTable() {
      const orderData = {
        start_date: this.startDate,
        end_date: this.endDate,
        start_time: this.startTime,
        end_time: this.endTime
      };
      try {
        console.log("Submitting query")
        console.log(orderData)
        const response = await this.$axios.post('/sales-report', orderData);
        this.total = response.data.Total; // store the value of Total in a variable
        delete response.data.Total; // remove Total from the response data
        this.table_data = Object.entries(response.data).map(([name, data]) => ({
          name,
          revenue: data.total_revenue
        }));
        console.log("Table Data")
        console.log(this.table_data);

      }
      catch (err) {
        console.log("ERROR");
        console.log(err);
      }
    },

    async generate(startDate,endDate,startTime,endTime) {
      console.log(startDate);
      console.log(endDate);
      console.log(startTime);
      console.log(endTime);

      await this.getSalesTable(startDate,endDate,startTime,endTime);
      
    },

    onResize() {
      this.windowWidth = window.innerWidth;
    }
  },
}
</script>