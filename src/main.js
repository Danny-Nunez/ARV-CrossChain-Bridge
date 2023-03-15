
import vuetify from './plugins/vuetify'
import { store } from "./store"
import App from './App.vue'
import Vue from 'vue'
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import 'vuetify/dist/vuetify.min.js';

// router setup
import router from './routes/router'
import * as network from "./network.js";
import './index.css';



Vue.config.productionTip = false
Vue.use(Vuetify);

const opts = {
  theme: {
      dark: true, // set dark mode by default
  },
};

export default new Vuetify(opts);

new Vue({
  vuetify,
  store: store,
  router: router,
  el: '#app',
 
  render: h => h(App)
}).$mount('#app');


const token = store.getters.userToken
console.log(token)
if (token) {
  network.setAxiosHeaders({"Authorization": "Token "+token, "Content-Type": 'application/json'})
}


Array.prototype.shuffle = function() {
  var i = this.length, j, temp;
  if ( i == 0 ) return this;
  while ( --i ) {
     j = Math.floor( Math.random() * ( i + 1 ) );
     temp = this[i];
     this[i] = this[j];
     this[j] = temp;
  }
  return this;
}
