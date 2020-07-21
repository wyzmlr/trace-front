import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: {
      title: "网络寻踪"
    }
  }
];

/**
 * 重写路由的push方法
 */
const routerPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error => error);
};

const router = new VueRouter({
  routes
});
//修改title
router.beforeEach((to, from, next) => {
  to.meta.title && (document.title = to.meta.title);
  next();
});
export default router;
