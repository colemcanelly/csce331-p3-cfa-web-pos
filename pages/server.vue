<template>
  <v-container>
    <v-row>
      <v-col cols="8">
        <v-card>
          <v-tabs v-model="tab" color="deep-purple-accent-4" align-tabs="center">
            <v-tab :value="1">Combo</v-tab>
            <v-tab :value="2">Entrees</v-tab>
            <v-tab :value="3">Sides</v-tab>
            <v-tab :value="4">Drinks</v-tab>
            <v-tab :value="5">Seasonal</v-tab>
          </v-tabs>
          <v-window v-model="windowTab" class="overflow-y-auto">
            <v-window-item v-for="n in 5" :key="n" :value="n">
              <v-container fluid>
                <v-row>
                  <v-col v-for="i in 6" :key="i" cols="12" md="4">
                    <v-btn>
                      Hi
                    </v-btn>
                    <v-btn>
                      Hi
                    </v-btn>
                    <v-btn>
                      Hi
                    </v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </v-window-item>
          </v-window>
        </v-card>
      </v-col>
      <v-col cols="4">
        <v-card class="overflow-y-auto">
          <p>Order</p>
        </v-card>
      </v-col>

    </v-row>
  </v-container>
</template>

<style>
.overflow-y-auto {
  max-height: 50vh;
}
</style>

<script>
export default {
  layout: 'server',
  data() {
    return {
      tab: 1,
      windowTab: 1
    };
  }
};
</script>