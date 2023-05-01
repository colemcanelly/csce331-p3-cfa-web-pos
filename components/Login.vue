<template id="app">
  <v-app>
    <v-dialog
      v-model="dialog"
      persistent
      max-width="600px"
      min-width="360px"
      overlay-color="white"
      overlay-opacity="100"
    >
      <div>
        <v-tabs v-model="tab" icons-and-text color="primary" background-color="" grow>
          <v-tabs-slider color="primary"></v-tabs-slider>
          <v-tab v-for="(tab, index) in tabs" :key="index">
            {{tab.name}}
            <!-- <v-btn block outlied text background-color="primary"> {{ tab.name }}</v-btn> -->
            <!-- <v-icon large>{{ tab.icon }}</v-icon>
            <div class="caption py-1">{{ tab.name }}</div> -->
          </v-tab>
          <v-tab-item>
            <v-card class="px-4">
              <v-card-text>
                <v-form ref="loginForm" v-model="valid" lazy-validation>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field v-model="loginEmail" :prepend-icon="'mdi-account'" :rules="loginEmailRules" label="E-mail" required>
                      </v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field v-model="loginPassword" :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                        :rules="[rules.required, rules.min]" :type="show1 ? 'text' : 'password'" name="input-10-1"
                        label="Password" hint="At least 8 characters" counter
                        @click:append="show1 = !show1">
                        <template v-slot:prepend>
                          <v-icon>mdi-lock</v-icon>
                        </template>
                      </v-text-field>
                    </v-col>
                    <v-col class="d-flex pb-1" cols="12" sm="3" xsm="12" align-end>
                      <v-btn x-large block :disabled="!valid" color="primary" @click="validate"> Login </v-btn>
                    </v-col>
                    <v-col class="d-flex pt-1" cols="12" sm="3" xsm="12" align-end>
                      <v-btn x-large outlined block color="primary">
                        <v-icon right>mdi-google</v-icon>
                        <v-spacer></v-spacer>
                        <span class="pa-2 align-self-center">Google</span>
                        <v-spacer></v-spacer>
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item>
            <v-card class="px-4">
              <v-card-text>
                <v-form ref="registerForm" v-model="valid" lazy-validation>
                  <v-row>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field v-model="firstName" :rules="[rules.required]" label="First Name" maxlength="20"
                        required></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field v-model="lastName" :rules="[rules.required]" label="Last Name" maxlength="20"
                        required></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field v-model="email" :rules="emailRules" label="E-mail" required></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field v-model="password" :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                        :rules="[rules.required, rules.min]" :type="show1 ? 'text' : 'password'" name="input-10-1"
                        label="Password" hint="At least 8 characters" counter
                        @click:append="show1 = !show1"></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field block v-model="verify" :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                        :rules="[rules.required, passwordMatch]" :type="show1 ? 'text' : 'password'" name="input-10-1"
                        label="Confirm Password" counter @click:append="show1 = !show1"></v-text-field>
                    </v-col>
                    <v-spacer></v-spacer>
                    <v-col class="d-flex ml-auto" cols="12" sm="3" xsm="12">
                      <v-btn x-large block :disabled="!valid" color="primary" @click="validate">Register</v-btn>
                    </v-col>
                  </v-row>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs>
      </div>
    </v-dialog>
  </v-app>
</template>


<script>
export default {
  computed: {
    passwordMatch() {
      return () => this.password === this.verify || "Password must match";
    }
  },
  methods: {
    async login () {
      try {
        // console.log(`Logging in as ${this.loginEmail}, with pw = ${this.loginPassword}`);
        const response = await this.$axios.post(`/login`, {
          auth: {
            username: this.loginEmail,
            password: this.loginPassword
          }
        });
        this.$router.push(response.data);
      } catch (err) {
        console.log("LOGIN ERROR");
        console.log(err);
      }
    },

    validate() {
      if (this.$refs.loginForm.validate()) this.login();     // Submit to login API
      else this.register();
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    }
  },
  data: () => ({
    dialog: true,
    tab: 0,
    tabs: [
      { name: "Login", icon: "mdi-account" },
      { name: "Register", icon: "mdi-account-outline" }
    ],
    valid: true,

    firstName: "",
    lastName: "",
    email: "",
    password: "",
    verify: "",
    loginPassword: "",
    loginEmail: "",
    loginEmailRules: [
      v => !!v || "Required",
      v => /.+@.+\..+/.test(v) || "E-mail must be valid"
    ],
    emailRules: [
      v => !!v || "Required",
      v => /.+@.+\..+/.test(v) || "E-mail must be valid"
    ],

    show1: false,
    rules: {
      required: value => !!value || "Required.",
      min: v => (v && v.length >= 6) || "Min 8 characters"
    }
  })
}
</script>