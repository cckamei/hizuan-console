<template>
  <div id="app">
    <!-- <Login v-if="isLoginPage"></Login> -->
    <!-- 第二个登录页 -->
    <Login v-if="isLoginPage"></Login>
    <el-container v-else>
      <!-- <el-header>
        <Header></Header>
      </el-header> -->
      <el-container style="height:1000px">
        <el-aside width="200px" class="sidebar-container">
          <Aside></Aside>
        </el-aside>
        <el-container class="main-container">
          <Navbar/>
          <el-main>
            <router-view/>
          </el-main>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script>
  import Header from "@/components/Header.vue";
  import Aside from "@/components/Aside.vue";
  import Footer from "@/components/Footer.vue";
  import Login from "@/components/Login.vue";
  import Navbar from "@/components/Navbar.vue";
  export default {
    name: "App",
    components: {
      Header,
      Aside,
      Footer,
      Navbar,
      Login
    },
    computed: {
      isLoginPage() {
        let pathName = this.$route.name;
        return pathName == "login";
      }
    }
  };
</script>

<style lang="less">
  .el-header {
    background-color: #f1f1f1;
    color: #333;
  }

  .el-aside {
    font-size: 12px;
    background-color: #304156;
    color: #bfcbd9;
    text-align: center;
    height: 100%;
  }

  .el-main {
    color: #333;
    background-color: #f1f1f1;
    // background-color: rgba(247, 248, 250, 1);
    text-align: center;
    &::-webkit-scrollbar {
      width: 1px; /*高宽分别对应横竖滚动条的尺寸*/
      height: 4px;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 6px;
      -webkit-box-shadow: inset 0 0 5px rgba(247, 247, 247, 1);
      background: rgba(247, 247, 247, 1);
    }
    &::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 5px rgba(247, 247, 247, 1);
      border-radius: 0;
      background: rgba(247, 248, 250, 0.5);
    }
  }

  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }
  .h2-text {
    color: #70aeed;
    font-weight: normal;
    text-align: left;
  }
  .el-submenu__title {
    text-align: left;
  }
</style>
