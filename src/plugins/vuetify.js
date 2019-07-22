import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import 'vuetify/src/stylus/app.styl'

Vue.use(Vuetify, {
  iconfont: 'fa' || 'md',
  theme: {
    primary: '#3cd1c2',
    secondary: '#373B5F',
    success: '#3cd1c2',
    alternate: '#5969FF',
    info: '#ffaa2c',
    error: '#f83e70'
  }
})
