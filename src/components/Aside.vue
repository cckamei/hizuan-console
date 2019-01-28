<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-menu :show-timeout="200" background-color="#304156" text-color="#bfcbd9" active-text-color="#409EFF" :default-active="$route.path">
      <div class="alogo">
        <img class="logo" src="@/assets/logo.png" alt="">
      </div>
      <el-submenu index="0" v-if="perms.list.indexOf('0') > -1 || perms.is_admin">
        <template slot="title">
          <img src="../assets/hy.png" alt="">
          <span class="mar">会员</span>
        </template>
        <el-menu-item-group>
          <el-menu-item @click="to('/user')" index="/user">会员管理</el-menu-item>
        </el-menu-item-group>
      </el-submenu>

      <el-submenu index="1" v-if="perms.list.indexOf('1') > -1 || perms.is_admin">
        <template slot="title">
          <img src="../assets/sp.png" alt="">
          <span class="mar">商品</span>
        </template>
        <el-menu-item-group>
          <!-- 
                        <el-menu-item index="1-1">新增商品</el-menu-item>
                     -->

          <el-menu-item index="/goodslist" @click='to("/goodslist")'> 商品管理</el-menu-item>

          <el-menu-item index="/category" @click="to('/category')">套系管理</el-menu-item>

          <el-menu-item index="/kuanshi" @click="to('/kuanshi')">款式管理</el-menu-item>

          <!-- <el-menu-item index="1-2">
                    
                </el-menu-item> -->
        </el-menu-item-group>
      </el-submenu>

      <el-submenu index="3" v-if="perms.list.indexOf('3') > -1 || perms.is_admin">
        <template slot="title">
          <img src="../assets/dd.png" alt="">
          <span class="mar">订单</span>
        </template>
        <el-menu-item-group>

          <el-menu-item index="/order" @click="to('/order')">
            订单管理
          </el-menu-item>

        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="2" v-if="perms.list.indexOf('2') > -1 || perms.is_admin">
        <template slot="title">
          <img src="../assets/bb.png" alt="">
          <span class="mar">报表</span>
        </template>
        <el-menu-item-group>

          <el-menu-item index="/report/jiaoyi" @click="to('/report/jiaoyi')">交易统计
          </el-menu-item>

        </el-menu-item-group>
        <el-menu-item-group>

          <el-menu-item index="/report/goods" @click="to('/report/goods')">
            产品统计
          </el-menu-item>

        </el-menu-item-group>
        <el-menu-item-group>

          <el-menu-item index="/report/ticheng" @click="to('/report/ticheng')">
            提成统计
          </el-menu-item>

        </el-menu-item-group>
        <el-menu-item-group>

          <el-menu-item index="/report/dis_ticheng" @click="to('/report/dis_ticheng')">
            分销商提成统计
          </el-menu-item>

        </el-menu-item-group>

      </el-submenu>
      <el-submenu index="13" v-if="perms.list.indexOf('13') > -1 || perms.is_admin">
        <template slot="title">
          <img src="../assets/kf.png" alt="">
          <span class="mar">客服</span>
        </template>
        <el-menu-item-group>

          <el-menu-item index="/appoint" @click="to('/appoint')">
            预约管理
          </el-menu-item>

        </el-menu-item-group>
      </el-submenu>

      <el-submenu index="12" v-if="perms.list.indexOf('12') > -1 || perms.is_admin">
        <template slot="title">
          <img src="../assets/yx.png" alt="">
          <span class="mar">营销</span>
        </template>
        <el-menu-item-group>

          <el-menu-item index='/article' @click="to('/article')">
            文章管理
          </el-menu-item>

          <el-menu-item index='/recommend' @click="to('/recommend')">
            推荐管理
          </el-menu-item>

          <el-menu-item index='/huodong' @click="to('/huodong')">
            活动管理
          </el-menu-item>

          <el-menu-item index='/coupon' @click="to('/coupon')">
            优惠券管理
          </el-menu-item>

        </el-menu-item-group>
      </el-submenu>

      <el-submenu index="11" v-if="perms.list.indexOf('11') > -1 || perms.is_admin">
        <template slot="title">
          <img src="../assets/wl.png" alt="">
          <span class="mar">物流</span>
        </template>
        <el-menu-item-group>

          <el-menu-item index='/logitics' @click="to('/logitics')">
            物流管理
          </el-menu-item>

        </el-menu-item-group>
      </el-submenu>

      <el-submenu index="4" v-if="perms.list.indexOf('4') > -1 || perms.is_admin">
        <template slot="title">
          <img src="../assets/zd.png" alt="">
          <span class="mar">终端</span>
        </template>
        <el-menu-item-group>

          <el-menu-item index='/area' @click="to('/area')">
            大区管理
          </el-menu-item>

          <el-menu-item index='/store' @click="to('/store')">
            门店管理
          </el-menu-item>

          <el-menu-item index='/storehouse' @click="to('storehouse')">
            仓库管理
          </el-menu-item>

          <!-- <el-menu-item index='4-2'>
                    
                </el-menu-item> -->
        </el-menu-item-group>
      </el-submenu>

      <el-submenu index="7" v-if="perms.list.indexOf('7') > -1 || perms.is_admin">
        <template slot="title">
          <img src="../assets/xt.png" alt="">
          <span class="mar">系统</span>
        </template>
        <el-menu-item-group>

          <el-menu-item index='/admin' @click="to('/admin')">
            账户管理
          </el-menu-item>

          <el-menu-item index='/role' @click="to('/role')">
            权限管理
          </el-menu-item>

        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </el-scrollbar>
</template>

<script>
  export default {
    name: "Aside",
    props: {
      defaultOpeneds: [1, 2]
    },
    data() {
      return {
        perms: { list: [], is_admin: false }
      };
    },
    created() {
      this.loadPerms();
    },
    methods: {
      to(address) {
        let _from = this.$route.path;
        console.log(_from, address);
        if(_from == address) {
          this.$router.go(0);
        }
        this.$router.push(address);
      },
      async loadPerms() {
        let result = await this.$axios.get("/admin/permissions/index/");
        let respData = result.data;
        if(respData.status != 0) return;
        this.perms = respData.data;
      },
      goActiveManage: function() {
        this.$router.push("/activeManage");
      },
      goActiveRecommend: function() {
        this.$router.push("/activeRecommend");
      },
      goActivePopup: function() {
        this.$router.push("/activePopup");
      }
    }
  };
</script>
<style scoped lang="less">
  .alogo {
    width: 200px;
    height: 50px;
    background-color: rgba(247, 248, 250, 1);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .el-menu-item {
    font-size: 12px;
  }
  .mar {
    margin-left: 8px;
  }
</style>

