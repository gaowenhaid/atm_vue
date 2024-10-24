import { createRouter, createWebHashHistory } from 'vue-router'
import homePage from '../views/homePage/index.vue'
import Fail from '../views/Fail/index.vue'
import inputConfirm from '../views/inputConfirm/inputConfirm.vue'  // 输入确认号
import useCar from '../views/useCar/useCar.vue'  // 用车
import checkHotel from '../views/checkHotel/checkHotel.vue'  // 选择酒店
import inputHotelName from '../views/inputHotelName/inputHotelName.vue'  // 选择酒店
import weChart from '../views/weChart/weChart.vue'  // 扫码
import FaceRecognition from '../views/faceRecognition/index.vue' // 人脸识别
const routes = [
  {
    path: '/',
    name: 'homePage',
    component: homePage
  },
  {
    path: '/Fail',
    name: 'Fail',
    component: Fail
  },
  {
    path: '/inputConfirm',
    name: 'inputConfirm',
    component: inputConfirm
  },
  {
    path: '/useCar',
    name: 'useCar',
    component: useCar
  },
  {
    path: '/checkHotel',
    name: 'checkHotel',
    component: checkHotel
  },
  {
    path: '/inputHotelName',
    name: 'inputHotelName',
    component: inputHotelName
  },
  {
    path: '/weChart',
    name: 'weChart',
    component: weChart
  },
  {
    path: '/faceRecognition',
    name: 'faceRecognition',
    component: FaceRecognition
  },
]
const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.length === 0) { //匹配前往的路由不存在
    from.name ? next({
      name: from.name
    }) : next('/'); //判断此跳转路由的来源路由是否存在，存在的情况跳转到来源路由，否则跳转到404页面
  } else {
    next(); //如果匹配到正确跳转
  }
});

export default router
