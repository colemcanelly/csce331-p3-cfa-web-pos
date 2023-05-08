<template>
  <v-row class="overflow-scroll">
      <v-col>

        <div class="d-flex justify-center">
          <v-btn
            color="primary"
            outlined
            x-large
            @click="getXReport"
          >
            Generate X Report
            <v-icon>mdi-check-bold</v-icon>
          </v-btn>
        </div>
        <v-spacer> </v-spacer>
          <div class="d-flex justify-center">
          <v-btn
            color="primary"
            outlined
            x-large
            @click="getZReport"
          >
            Generate Z Report
            <v-icon>mdi-check-bold</v-icon>
          </v-btn>
        </div>
          <v-row>
            <v-col cols="12">
                <v-card>
                  <v-card-title style="font-size: 30px;">{{ reportType }}</v-card-title>
                </v-card>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6">
                <v-card>
                  <v-card-text style="font-size:25px; ">
                    This report covers all sales since 
                    <br>
                    <br>
                    {{ startString }}
                    <br>
                    <br>
                    {{ endDate  }} , {{ endTime }}
                  </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="6">
                <v-card>
                  <v-card-text style="font-size:25px; ">
                    Sales:
                    <br>
                    <br>
                    ${{  numSales }}
                  </v-card-text>
                </v-card>
            </v-col>
          </v-row>
      </v-col>
  </v-row>
</template>

<script>
import Header from '@/components/server/Header.vue'
// import { time } from 'console';
export default {
name: 'xzReportPage',
layout: 'report',
components: {
  Header
},
data() {
    return {
      tableData: [],
      report_type: "",
      start_date: new Date(),
      end_date: new Date(),
      start_time: "",
      end_time: "",
      sales: 0.0,
      to: "",
  }
},
methods: {
  /** 
   * Gets all necessary items to compute an x report
   * @return {void}
   */
    async getXReport() {
      try {
        const response = await this.$axios.get('/x-report');
        // this.tableData = response.data;
        this.start_date = new Date(undefined);
        this.start_time = "";
        this.end_date = new Date(response.data.end_date.order_date);
        this.end_time = response.data.end_time.order_time;
        this.sales = response.data.sales.sum;
        this.report_type = "X-Report";
        this.to = "";
      }
      catch (err) {
                console.log("ERROR");
                console.log(err);
      }
    },
    /**
   * retrieves all items necessary to produce a z report
   */
    async getZReport() {
      try {
        const response = await this.$axios.get('/z-report');
        this.tableData = response.data;
        console.log(this.tableData);
        this.report_type = "Z-Report";
        this.start_date = new Date(response.data.start_date.order_date);
        this.end_date = new Date(response.data.end_date.order_date);
        this.start_time = response.data.start_time.order_time;
        this.end_time = response.data.end_time.order_time;
        this.sales = response.data.sales.sum;
        this.to = "to";
      }
      catch (err) {
                console.log("ERROR");
                console.log(err);
      }
    },
  },
   /**
   * most likely not needed
   */
  mounted() {
    this.report_type = this.report_type;
    this.start_date = this.start_date;
    this.end_date = this.end_date;
    this.sales = this.sales;
    this.start_time = this.start_time;
    this.end_time = this.end_time;
  },
   /**
   * returns all necessary items that will be display in a formatted manner
   */
  computed: {
        reportType() { return this.report_type; },
        endDate() { return this.end_date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }); },
        startDate() { return this.start_date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })},
        numSales() { if (this.sales == null) {
          return "0.00";
        } 
        else {
          return this.sales.toFixed(2);
        }
      },
        startTime() { return this.start_time; },
        endTime() { return this.end_time; },
        startString() { 
          if (this.report_type == "Z-Report") {
            var full_string;
            full_string = this.startDate + " at " + this.startTime + "\n to \n";
            return full_string;
          }
          else {
            return "";
          }
        }
  },
}

</script>

