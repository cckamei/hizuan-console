<template>
  <div id="header">
    <a href="/goodslist">
      <img id="logo" src="@/assets/logo.png" alt="">
    </a>
    <el-button id="chpwd-btc" @click="chpwd" plain>
      <span>修改密码</span>
    </el-button>
    <el-button id="logout-btn" @click="logout" plain>
      <span>注 销</span>
    </el-button>
  </div>
</template>

<script>
  import router from "../router/index.js";
  export default {
    methods: {
      async chpwd() {

      },
      async logout() {
        // let resp = await this.$axios.post("/admin/logout");
        window.sessionStorage.clear();
        router.push("/login");
      }
    },
    data() {
      let nickname = window.sessionStorage.nickname || "";
      return {
        nickname: nickname
      };
    }
  };
</script>
    
<style lang="less" scoped>
  #header {
    #logo {
      margin-top: 15px;
      width: 166px;
      height: auto;
      margin-left: 30px;
    }

    button {
      display: block;
      float: right;
      margin-top: 10px;
      margin-right: 30px;
      width: 100px;
    }
  }
</style>
