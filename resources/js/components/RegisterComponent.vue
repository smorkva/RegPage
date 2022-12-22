<template>
  <form method="POST" action="#" @submit.prevent="register">
    
    <div class="row mb-3">
        <label for="name" class="col-form-label">Full name</label>
        <input type="hidden" name="_token" v-model="$data._token" />
        <div class="">
            <input 
              v-model.lazy="$v.name.$model"
              name="name"
              type="text"
              class="form-control"
              :class="{'is-invalid': $v.name.$error}"
              autocomplete="name" autofocus
            />
            <span class="invalid-feedback" v-if="!$v.name.required" role="alert">
              <strong>Required field</strong>
            </span>
            <span class="invalid-feedback" v-if="!$v.name.maxLength" role="alert">
              <strong>Max length 255 symbols</strong>
            </span>
        </div>
    </div>

    <div class="row mb-3">
        <label for="name" class="col-form-label">Country</label>

        <div class="country-selector">
          <v-select 
            v-model="$v.country.$model" 
            :class="{'is-invalid': $v.country.$error}"
            :options="countries" 
            label="name"
          />
          <div class="flag">{{ flag }}</div>
          <span class="invalid-feedback" v-if="!$v.country.required" role="alert">
            <strong>Required field</strong>
          </span>
        </div>
    </div>

    <div class="row mb-3">
        <label for="name" class="col-form-label">Phone number</label>

        <div class="phone-input">
          <div class="prefix">{{ phoneCode }}</div>
          <input 
            v-model.lazy="$v.phone.$model"
            type="text"
            name="phone"
            class="form-control"
            :class="{'is-invalid': $v.phone.$error}"
            autocomplete="name" autofocus
            :disabled="!country"
            v-mask="'__ ___-__-__'"
          />
          <span class="invalid-feedback" v-if="!$v.phone.required" role="alert">
            <strong>Required field</strong>
          </span>
          <span class="invalid-feedback" v-if="!$v.phone.maxLength" role="alert">
            <strong>Max length 15 symbols</strong>
          </span>
        </div>
    </div>

    <div class="row mb-3">
        <label for="email" class="col-form-label">Email</label>

        <div class="">
          <input 
            id="email" 
            v-model.lazy="$v.email.$model"
            type="email" 
            name="email"
            class="form-control" 
            :class="{'is-invalid': $v.email.$error || !emailUnique}"
            autocomplete="email">
          <span class="invalid-feedback" v-if="!$v.email.required" role="alert">
            <strong>Required field</strong>
          </span>
          <span class="invalid-feedback" v-if="!$v.email.maxLength" role="alert">
              <strong>Max length 255 symbols</strong>
            </span>
            <span class="invalid-feedback" v-if="!$v.email.email" role="alert">
            <strong>Inout valid e-mail</strong>
          </span>
          <span class="invalid-feedback" v-if="!emailUnique" role="alert">
            <strong>The email has already been taken.</strong>
          </span>
          
        </div>
    </div>

    <div class="row mb-0">
        <div class="">
            <button 
              type="submit" 
              :disabled="requestState"
              class="btn btn-primary"
            >Register</button>
        </div>
    </div>
  </form>
</template>
<script>
import { required, maxLength, email } from 'vuelidate/lib/validators'
import axios from 'axios'
let tekenEmail = '';
const checkEmail = (em) => (em === tekenEmail) && tekenEmail;

export default {
  props: {
    action: String,
  },
  mounted() {
    this.$data._token = document.querySelector('meta[name="csrf-token"]').content;
    axios.get('/countries.json')
      .then(res => {
        this.countries = res.data
      })
  },
  computed: {
    emailUnique() {
      return !this.emailTeken || this.emailTeken != this.email
    },
    flag() {
      return this.country?.flag ?? ''
    },
    phoneCode() {
      return this.country?.idd ?? ''
    }
  },
  validations: {
    name: {
      required,
      maxLength: maxLength(255),
    },
    phone: {
      required,
      maxLength: maxLength(15)
    },
    country: {
      required,
    },
    email: {
      required,
      maxLength: maxLength(255),
      email,
    }
  },
  data() {
    return {
      _token: '',
      email: 'smorkva@gmail.com',
      name: 'test',
      phone: '',
      country: null,
      requestState: false,
      emailTeken: '',
      countries: [],
    }
  },
  methods:{
    register() {
      this.$v.$touch()
      if (this.$v.$invalid || !this.emailUnique) {
        // alert('Check form')
        return false;
      } else {
        this.$data.requestState = true
        const _token = document.querySelector('meta[name="csrf-token"]').content;
        const formData = { 
          _token, 
          name: this.name, 
          email: this.email,
          country: this.country.name,
          phone: this.country.idd + this.phone,
        };

        //console.log('click reguster', this.action, formData)

        axios.post(this.action, formData)
          .then(_ => {
            window.location.reload()
          }).catch(err => {
            const data = err.response.data;
            const emailError = data.errors?.email;
            if(emailError?.includes('The email has already been taken.')) {
              this.emailTeken = this.email.trim();
            }
            
            this.$data.requestState = false
          })

        return false;
      }
    }
  }
}
</script>
