<template>
  <div>
    <v-navigation-drawer v-model="drawer" app class="cfa-red-lighten-4" active color="primary">
        <v-list>
          <v-list-item
            v-for="(item, i) in items"
            :key="i"
            :to="item.to"
            router
            exact
          >
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
    </v-navigation-drawer>
    <v-app-bar app class="cfa-red-lighten-4">
      <!-- LEFT HAMBURGER -->
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <!-- THIS IS THE PAGE TITLE -->
      <v-toolbar-title>{{ title }}</v-toolbar-title>
    </v-app-bar>
  </div>
</template>

<script>
export default {
  data () {
    return {
      drawer: false,
      items: [
        {
          icon: 'mdi-chart-bubble',
          title: 'Info',
          to: '/'
        },
        {
          icon: 'mdi-apps',
          title: 'Landing',
          to: '/landing'
        },
        {
          icon: 'mdi-silverware-fork-knife',
          title: 'Customer',
          to: '/customer/categories'
        },
        {
          icon: 'mdi-account',
          title: 'Server',
          to: '/server'
        },
        {
          icon: 'mdi-cash-multiple',
          title: 'Manager',
          to: '/managerMenu'
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Chick-Fil-A Point of Sales'
    }
  }
}
</script>
