<template>
    <v-app>
      <v-navigation-drawer
        v-model="drawer"
        :clipped="clipped"
        :fixed="fixed"
        app
      >
        <v-list>
          <v-list-item
            v-for="(item, index) in items"
            :key="index"
            :to="item.to"
          >
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>
              {{ item.title }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
      <v-app-bar app>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title>Manager Dashboard</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn to="/managerMenu">Menu</v-btn>
        <v-btn to="/managerInventory">Inventory</v-btn>
      </v-app-bar>
      <v-main>
        <router-view />
      </v-main>
    </v-app>
    
  </template>
  
  <script>
  export default {
    data: () => ({
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-chart-bubble',
          title: 'Menu',
          to: '/managerMenu'
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Manager Inventory',
          to: '/managerInventory'
        }
      ]
    })
  }
  </script>
  <style>

</style>