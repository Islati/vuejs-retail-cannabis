<template>
  <v-container class="d-flex justify-center">
    <v-row class="justify-center">
      <v-col sm="5">
        <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="submit">
          <v-card>
            <v-card-title class="text-center">Register</v-card-title>
            <v-card-text>
              <v-row v-if="errorMessage.length > 0" justify="center">
                <v-alert type="error">
                  {{ errorMessage }}
                </v-alert>
              </v-row>

              <v-row>
                <v-col sm="6">
                  <v-text-field v-model="firstName" :rules="firstNameRules" label="First Name" required
                                clearable></v-text-field>
                </v-col>

                <v-col sm="6">
                  <v-text-field v-model="lastName" :rules="lastNameRules" label="Last Name" required
                                clearable></v-text-field>
                </v-col>
              </v-row>
              <v-row>
              </v-row>
              <v-row>
                <v-col sm="12">
                  <v-text-field v-model="email" :rules="emailRules" label="Email" required clearable></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col sm="12">
                  <v-text-field v-model="phone" :rules="phoneRules" label="Phone Number" required
                                clearable></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col sm="12">
                  <v-text-field v-model="password" :rules="passwordRules" label="Password" required></v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col sm="6" offset="3" class="justify-center">
                  <v-row>
                    <span>Select your Date of Birth</span>
                  </v-row>
                  <v-row>
                    <v-date-picker v-mode="birthDate"></v-date-picker>
                  </v-row>
                </v-col>
              </v-row>
            </v-card-text>

            <v-card-actions>
              <v-btn outlined rounded text color="success" type="submit">Complete Registration</v-btn>
              <v-spacer></v-spacer>
              <v-btn outlined rounded link to="/login" color="primary" type="button">Return to Login</v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

import {validationMixin} from 'vuelidate';

import {required, minLength, email} from "vuelidate/lib/validators";
import {calculateAgeInYears} from "@/utils";

const axios = require('axios').default;

export default {
  name: "Login",

  data: () => ({
    valid: true,
    birthDate: new Date().toISOString().substr(0,10),
    firstName: "",
    firstNameRules: [
      v => !!v || "Your first name is required.",
    ],
    lastName: "",
    lastNameRules: [
      v => !!v || "Your last name is required."
    ],
    phone: "",
    phoneRules: [
      v => !!v || "Your phone # is required",
      // eslint-disable-next-line no-control-regex
      v => /^\d{10}$/.test(v) || "Phone number is invalid"
    ],
    password: "",
    passwordRules: [
      v => !!v || "Password is required",
      v => (v && v.length >= 8) || "Password must be atleast 8 characters"
    ],
    errorMessage: "",
    email: "",
    emailRules: [
      v => !!v || "Your email is required",
      v => /.+@.+\..+/.test(v) || 'Email must be valid',
    ],
  }),
  mixins: [validationMixin],
  validations: {
    firstName: {
      required
    },
    lastName: {
      required
    },
    email: {
      required,
      email
    },
    password: {
      required,
      minLength: minLength(8)
    }
  },
  methods: {
    validate: function () {
      return this.$refs.form.validate();
    },
    submit: function (e) {

      if (!this.validate()) {
        e.preventDefault();
        return;
      }

      if (calculateAgeInYears(new Date(this.$data.birthDate)) < 19) {
        this.errorMessage = "You must be 19 years of age to register.";
        e.preventDefault();
        return;
      }

      let vm = this;

      axios({
        url: 'http://localhost:5000/auth/register/',
        method: 'POST',
        responseType: 'json',
        headers: {
          'Content-Type': 'application/json'
        },
        data: JSON.stringify({
          first_name: vm.$data.firstName,
          last_name: vm.$data.lastName,
          email: vm.$data.email,
          password: vm.$data.password
        })
      }).then(response => {
        let json = response.data;

        //todo check response status.

        if (json['status'] !== 'success') {
          this.errorMessage = json['message'];
          return;
        }

        let auth = json['payload']['auth'];
        vm.$store.commit('setAuthToken', auth);

        vm.$router.push({path: "/home"});
      })

      e.preventDefault();
    }
  }

}
</script>

<style scoped>

</style>