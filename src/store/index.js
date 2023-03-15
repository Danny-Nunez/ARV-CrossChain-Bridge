import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

const debug = process.env.NODE_ENV !== "production";

export const store = new Vuex.Store({
  strict: debug,

  // straight forward way to implement state storage
  // inspired from delivery.ordereat.co codebase
  state: {
    walletData: null,
    snackbar: {
      show: false,
      variant: 'success',
      message: ''
    },
    settings: {
      darkMode: false,
      currentETHUSDPrice: 1,
      currentBNBUSDPrice: 1,
    }
  },
  mutations: {
    updateSnackBar(state, payload) {
      const { show, variant, message } = payload;
      state.snackbar.show = show;
      state.snackbar.variant = variant ?? state.snackbar.variant;
      state.snackbar.message = message;

      // setTimeout(() => this.updateSnackBar(state, false), 6000);

    },
    updateWallet(state, payload) {
      state.walletData = payload;
    },
    switchTheme(state, payload) {
      state.settings.darkMode = payload
    },
    updateSettings(state, payload) {
      state.settings = { ...state.settings, ...payload }
    }
  }
});

