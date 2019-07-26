import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: 'mdi',
  },
  theme: {
    light: true,
    themes: {
      light: {
        primary: '#3cd1c2',
        secondary: '#373B5F',
        success: '#3cd1c2',
        alternate: '#5969FF',
        info: '#ffaa2c',
        error: '#f83e70'
      }
    }
  }
});
