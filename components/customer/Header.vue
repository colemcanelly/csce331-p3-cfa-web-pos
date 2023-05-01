<!-- CUSTOMER HEADER -->
<template>
    <v-container class="pa-0 text-center cfa-red-lighten-4 elevation-1">
        <v-row no-gutters>
            <v-col class="text-center my-1">
                <v-card to="/" flat class="rounded-0 cfa-red-lighten-4">
                    <img :src="image" :alt="title" width="28%">
                </v-card>
            </v-col>
        </v-row>
        <v-divider></v-divider>
        <v-row no-gutters>
            <v-col>
                <v-card flat class="mx-1 rounded-0 cfa-red-lighten-4">{{ name }}</v-card>
            </v-col>
            <v-divider vertical></v-divider>
            <v-col>
                <v-card flat class="mx-1 rounded-0 cfa-red-lighten-4">{{ location }}</v-card>
            </v-col>
        </v-row>
        <v-divider></v-divider>
    </v-container>
</template>

<script>
export default {
    computed: {
        name() {
            return this.$cookies.get('fname');
        }

    },
    data: () => ({
        title: "Chick-Fil-A",
        image: "/cfa-logo.svg",
        location: "Location"
    })
}
</script>