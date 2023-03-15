import Vue from 'vue';
import Vuetify, { VSnackbar, VBtn, VIcon } from 'vuetify/lib';

Vue.use(Vuetify, {
  components: {
    VSnackbar,
    VBtn,
    VIcon
  }
});

const theme = {
  dark: true,
  themes: {
    light: {
      background: '#fff',
      primary: '#b918f4',
      secondary: '#007af6',
      accent: '#8c9eff',
      error: '#FF6868',
    },
    dark: {
      background: '#000',
      primary: '#b918f4',
      secondary: '#007af6',
      accent: '#8c9eff',
      error: '#FF6868',
    },
  },
};

let vuetify = new Vuetify({
  theme,
  icons: {
    iconfont: 'mdi',
    values: {
      custom: { // name of our custom icon
      },
    },
  },
});

export default vuetify;
