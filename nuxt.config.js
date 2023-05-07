import colors from 'vuetify/es5/util/colors'

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: true,

  // Target: https://go.nuxtjs.dev/config-target
  target: 'server',

  // Server Middleware
  serverMiddleware: {
    '/api': '~/api'
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - cfa_project3',
    title: 'cfa_project3',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    '@nuxtjs/axios'
  ],
  
  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    'cookie-universal-nuxt',
    '@nuxtjs/auth-next'
  ],
  
  // Configure the axios module
  axios: {
    baseURL: '/api/'
  },

  // Auth module
  auth: {
    redirect: {
      login: '/login',
      logout: false,
      callback: '/api/googlelogin',
      home: '/login'
    },
    strategies: {
      google: {
        clientId: process.env.CLIENT_ID,
        codeChallengeMethod: '',
        responseType: 'token id_token',
      },
    }
  },
  router: {
    // middleware: ['auth']
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      themes: {
        light: {
          'cfa-red': '#dd0031',
          'cfa-red-lighten-1': colors.red.lighten1,
          'cfa-red-lighten-2': colors.red.lighten2,
          'cfa-red-lighten-3': colors.red.lighten3,
          'cfa-red-lighten-4': colors.red.lighten4,
          primary: '#dd0031',    // Links, etc
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        },
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    // For some reason Google OAuth needs this to work
    transpile: [
      'defu'
    ]  
  }
}
