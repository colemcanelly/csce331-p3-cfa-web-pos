<!-- CUSTOMER FOOTER -->
<template>
    <v-bottom-navigation v-model="value" active color="primary">
        <v-btn
            v-for="(item, i) in items"
            :key="i"
            :to="item.to"
            :value="item.label"
        >
            <v-icon>{{ item.icon }}</v-icon>
            <span>{{ item.label }}</span>
        </v-btn>
    </v-bottom-navigation>
</template>

<!-- ICONS: https://pictogrammers.com/library/mdi/ -->
<script>
export default {
    data: function() {
        return {
            items: [
                {
                icon: 'mdi-map-marker',
                label: 'Nearby',
                to: ''
                },
                {
                icon: 'mdi-silverware-fork-knife',
                label: 'Menu',
                to: ''
                },
                {
                icon: 'mdi-shopping',
                label: 'My Order',
                to: ''
                },
                {
                icon: 'mdi-account',
                label: 'Account',
                to: ''
                }
            ],
        }; 
    }
}
</script>