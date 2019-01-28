import Vue from 'vue';
import Router from 'vue-router';
import Login from '@/components/Login';
import Goodslist from '@/components/Goodslist';
import Goods from '@/components/Goods';
import Category from '@/components/Category';
import Kuanshi from '@/components/Kuanshi';
import SkuList from '@/components/SkuList';
import Store from '@/components/Store';
import Storehouse from '@/components/Storehouse';
import Area from '@/components/Area';
import Tag from '@/components/Tag';
import Order from '@/components/Order';
import Home from '@/components/Home';
import Logitics from '@/components/Logitics';
import Article from '@/components/Article';
import Huodong from '@/components/Huodong';
import Coupon from '@/components/Coupon';
import Tuijian from '@/components/Tuijian';
import User from '@/components/User';
import Role from '@/components/role';
import Admin from '@/components/admin';
import Appoint from '@/components/Appoint';
import JiaoyiReport from '@/components/report/Jiaoyi.vue';
import GoodsReport from '@/components/report/Goods.vue';
import GoodsKuanxiaoReport from '@/components/report/GoodsKuanxiao.vue';
import TichengReport from '@/components/report/Ticheng.vue';
import TichengKuanxiaoReport from '@/components/report/TichengKuanxiao.vue';
import DisTichengReport from '@/components/report/DisTicheng.vue';
import notFound from '@/components/404.vue';
import NoAccess from '@/components/403.vue';

Vue.use(Router);

const route = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        title: '首页'
      }
    },
    {
      path: '/report/goods',
      name: 'report_goods',
      component: GoodsReport,
      meta: {
        title: '报表',
        secoundTap: '产品统计'
      }
    },
    {
      path: '/report/goods/:merchant_code',
      name: 'report_goods_kuanxiao',
      component: GoodsKuanxiaoReport,
      meta: {
        title: '报表',
        secoundTap: '产品统计',
        thired: '款销分析'
      }
    },
    {
      path: '/report/ticheng',
      name: 'report_ticheng',
      component: TichengReport,
      meta: {
        title: '报表',
        secoundTap: '提成统计'
      }
    },
    {
      path: '/report/ticheng/:merchant_code',
      name: 'report_ticheng_kuanxiao',
      component: TichengKuanxiaoReport,
      meta: {
        title: '报表',
        secoundTap: '提成统计',
        thired: '款销分析'
      }
    },
    {
      path: '/report/dis_ticheng',
      name: 'dis_ticheng',
      component: DisTichengReport,
      meta: {
        title: '报表',
        secoundTap: '分销提成统计'
      }
    },
    {
      path: '/report/jiaoyi',
      name: 'report_jioayi',
      component: JiaoyiReport,
      meta: {
        title: '报表',
        secoundTap: '交易统计'
      }
    },
    {
      path: '/admin',
      name: 'admin',
      component: Admin,
      meta: {
        title: '系统',
        secoundTap: '账户管理'
      }
    },
    {
      path: '/appoint',
      name: 'appoint',
      component: Appoint,
      meta: {
        title: '客服',
        secoundTap: '预约管理'
      }
    },
    {
      path: '/role',
      name: 'role',
      component: Role,
      meta: {
        title: '系统',
        secoundTap: '权限管理'
      }
    },
    {
      path: '/recommend',
      name: 'tuijian',
      component: Tuijian,
      meta: {
        title: '营销',
        secoundTap: '推荐管理'
      }
    },
    {
      path: '/user',
      name: 'user',
      component: User,
      meta: {
        title: '会员',
        secoundTap: '会员管理'
      }
    },
    {
      path: '/coupon',
      name: 'coupon',
      component: Coupon,
      meta: {
        title: '营销',
        secoundTap: '优惠券管理'
      }
    },
    {
      path: '/huodong',
      name: 'huodong',
      component: Huodong,
      meta: {
        title: '营销',
        secoundTap: '活动管理'
      }
    },
    {
      path: '/article',
      name: 'article',
      component: Article,
      meta: {
        title: '营销',
        secoundTap: '文章管理'
      }
    },
    {
      path: '/logitics',
      name: 'logitics',
      component: Logitics,
      meta: {
        title: '物流',
        secoundTap: '物流管理'
      }
    },
    {
      path: '/order',
      name: 'order',
      component: Order,
      meta: {
        title: '订单',
        secoundTap: '订单管理'
      }
    },
    {
      path: '/tag',
      name: 'tag',
      component: Tag
    },
    {
      path: '/store',
      name: 'store',
      component: Store,
      meta: {
        title: '终端',
        secoundTap: '门店管理'
      }
    },
    {
      path: '/storehouse',
      name: 'storehourse',
      component: Storehouse,
      meta: {
        title: '终端',
        secoundTap: '仓库管理'
      }
    },
    {
      path: '/area',
      name: 'area',
      component: Area,
      meta: {
        title: '终端',
        secoundTap: '大区管理'
      }
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/goodslist',
      name: 'goodslist',
      component: Goodslist,
      meta: {
        title: '商品',
        secoundTap: '商品管理'
      }
    },
    {
      path: '/add/goods',
      name: 'add_goods',
      component: Goods,
      meta: {
        title: '商品',
        secoundTap: '商品管理'
      }
    },
    {
      path: '/goods/:goods_id',
      name: 'goods_detail',
      component: Goods,
      meta: {
        title: '商品',
        secoundTap: '商品管理'
      }
    },
    {
      path: '/category',
      name: 'category',
      component: Category,
      meta: {
        title: '商品',
        secoundTap: '套系管理'
      }
    },
    {
      path: '/kuanshi',
      name: 'kuanshi',
      component: Kuanshi,
      meta: {
        title: '商品',
        secoundTap: '款式管理'
      }
    },
    {
      path: '/sku/:goods_id',
      name: 'sku',
      component: SkuList
    },
    { path: '/404', name: 'notFound', component: notFound },
    { path: '/403', name: 'NoAccess', component: NoAccess }
  ]
});

route.beforeEach((to, from, next) => {
  if (to.path != '/login') {
    let token = window.sessionStorage.token;
    if (!token) {
      next({
        path: '/login'
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default route;
