<template>
  <div id="login_page">
    <div id="content">
      <div style="height:150px;"></div>
      <div id="login_wrap">
        <img class="img" src="../../src/assets/login2/logo.png" alt="">
        <div class="login-input-box">
          <form>
            <input class="bg-user inputs" autocomplete="off" v-model="user.username" type="text" placeholder="请输入用户">
            <input class="bg-password inputs" autocomplete="off" v-model="user.password" @keyup.enter="login" type="password" placeholder="请输入密码">
          </form>
            <div class="sure_button" @click="login">登录</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import router from "../router/index.js";

  export default {
    data() {
      return {
        loginState: false,
        labelPosition: "right",
        user: {
          username: "",
          password: ""
        }
      };
    },
    methods: {
      async login() {
        let formData = {
          username: this.user.username,
          password: this.user.password
        };
        let resp = await this.$axios.post("/admin/login", formData);
        if(resp.data.status != 0) return;
        let respData = resp.data.data;
        window.sessionStorage.id = respData.admin_id;
        window.sessionStorage.token = respData.token;
        router.push("/");
      }
    }
  };
</script>

<!-- Add "scoped" attribute to limit CßSS to this component only -->
<style lang="less" scoped>
  #login_page {
    width: 100%;
    height: 100%;
    #login_header {
      height: 60px;
      background-color: white;
      img {
        height: 30px;
        margin: 10px;
        margin-left: 20%;
      }
    }
    #content {
      position: relative;
      background-image: url(../assets/login2/b.png);
      background-repeat: no-repeat;
      background-position: cover;
      height: 100%;
      width: 100%;
      #login_wrap {
        position: absolute;
        top: 40%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 20px 50px 50px 50px;

        img {
          display: block;
          width: 352px;
          height: auto;
          margin: auto;
        }
        .login-input-box {
          margin-top: 60px;
          padding: 60px;
          background: rgba(255, 255, 255, 0.6);
          border-radius: 20px;
          box-shadow: 0px 0px 50px rgba(0, 0, 0, 0.1);
        }
      }
    }
  }
  .bg-user {
    background-image: url("../assets/login2/icon_acc.png") !important;
    background-repeat: no-repeat !important;
    background-position: 8px 10px !important;
  }
  .bg-password {
    background-image: url("../assets/login2/icon_lock.png") !important;
    background-repeat: no-repeat !important;
    background-position: 8px 10px !important;
  }
  .inputs {
    display: block;
    margin: 30px auto;
    padding: 12px 0 12px 48px;
    border: 1px solid rgb(235, 185, 150);
    width: 360px;
    outline: none;
    border-radius: 10px;
    height: 48px;
    font-size: 18px;
    line-height: 48px;
    color: rgb(235, 145, 75);
    background: rgb(245, 240, 230);
  }
  .sure_button {
    width: 360px;
    height: 60px;
    color: white;
    font-weight: bold;
    text-align: center;
    background: rgb(245, 180, 125);
    border-radius: 30px;
    font-size: 20px;
    margin: 48px auto 0 auto;
    cursor: pointer;
    line-height: 60px;
  }
  input:-webkit-autofill,
   textarea:-webkit-autofill,
  select:-webkit-autofill  {
    background-color: rgb(250, 255, 189);
    background-image: none;
    color: rgb(215, 175, 145);
  }
  ::-webkit-input-placeholder {
    color: rgb(215, 175, 145);
  }
</style>