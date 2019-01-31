import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import chatService from '@/components/chatService/index'
import layout from '@/components/layout'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/HelloWorld',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/',
      name: 'layout',
      redirect: '/layout/chatService', // 重定向
      meta: {
        'icon': 'file text icon'
      },
      component: layout,
      children: [
        {
          path: '/layout/chatService',
          name: 'chatService',
          component: chatService
        }
      ]
    }
  ]
})
