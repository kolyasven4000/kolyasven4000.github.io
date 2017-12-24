import Vue from 'vue'
import Router from 'vue-router'
import CustomComponents from '@/components/CustomComponents'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: CustomComponents
    }
  ]
})
