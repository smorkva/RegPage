/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');

window.Vue = require('vue').default;

import Vuelidate from 'vuelidate'
window.Vue.use(Vuelidate)
import vSelect from 'vue-select'

/**
 * The following block of code may be used to automatically register your
 * Vue components. It will recursively scan this directory for the Vue
 * components and automatically register them with their "basename".
 *
 * Eg. ./components/ExampleComponent.vue -> <example-component></example-component>
 */

// const files = require.context('./', true, /\.vue$/i)
// files.keys().map(key => Vue.component(key.split('/').pop().split('.')[0], files(key).default))

Vue.component('register-component', require('./components/RegisterComponent.vue').default);
Vue.component('v-select', vSelect);

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */
 Vue.directive('mask', {
    inserted: function (el, binding) {
        var mask = binding.value,
            first = mask.indexOf('_'),
            fieldsL = mask.replace(/[^_]/gm, '').length,
            clean = mask.replace(/[^0-9_]/gm, ''),
            indexes = []
            
        for(var i = 0; i < clean.length; i++){
          if(!isNaN(clean[i])){
            indexes.push(i)
          }
        }
        
        el.value = mask
        el.clean = mask.replace(/[^0-9]/gm, '')
        
        function maskIt(event, start){
          var value = el.value,
              filtred = value.replace(/[^0-9]/gm, ''),
              result = ''
          
          if(value.length < first){
            value = mask + value
            filtred = value.replace(/[^0-9]/gm, '')
          }
          
          for(var i = 0; i < filtred.length; i++){
            if(indexes.indexOf(i) == -1){
              result += filtred[i]
            }
          }
          
          value = ''
          var cursor = 0
          
          for(var i = 0; i < mask.length; i++){
            if(mask[i] == '_' && result){
              value += result[0]
              result = result.slice(1)
              cursor = i + 1
    
            }else{
              value += mask[i]
            }
          }
     
          if(cursor < first){
            cursor = first
          }
          
          el.value = value
          
          el.clean = el.value.replace(/[^0-9]/gm, '')
          
          el.setSelectionRange(cursor,cursor)
        }
        
        el.addEventListener('focus', function(event){
          event.preventDefault()
        })
        
        el.addEventListener('click', function(event){
          event.preventDefault()
          var start = el.value.indexOf('_')
          
          if(start == -1){
            start = el.value.length
          }
          
          el.setSelectionRange(start,start)
          
        })
        
        el.addEventListener('paste', function(event){
          var start = el.selectionStart
          
          if(start < first){
            el.value = '_' + el.value
          }
        })
        
        el.addEventListener('input', function(event){
          var start = el.selectionStart      
          maskIt(event, start)
        })
    }
});

const app = new Vue({
    el: '#app',
});
