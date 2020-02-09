<template>
  <view class="phone-login-container">
    <text class="phone-validate">手机号验证</text>
    <text class="subtitle">用于及时获取课程最新信息</text>
    <view class="content">
      <input class="phone" v-model="loginForm.phone" placeholder="请输入手机号" type="number" />
      <view class="get_vcode" @click="getVcode">{{ showVcode }}</view>
      <input class="vcode" v-model="loginForm.vcode" placeholder="请输入验证码" type="number" />
    </view>
    <view class="phone-login">
      <img @click="phoneLogin" src="/static/images/phone_login@2x.png" />
    </view>
  </view>
</template>
<script>
import Vue from "vue";
import {instance} from '../../utlis/http.js'
export default Vue.extend({
  data() {
    return {
      loginForm: {
        phone: "17704051019",
        vcode: ""
      },
      // 获取验证码按钮显示的文字
      showVcode: "获取验证码",
      // 是否正在倒计时
      isCountDown:false,
      // 倒计时秒数
      count:10,
      // 计时器
      timer:-1

    };
  },
  methods: {
    // 获取验证码
    async getVcode() {
      // 判断手机号是否合法
      if (this.loginForm.phone.trim().length === 0) {
        uni.showToast({
          title: "手机号不能为空",
          icon: "none",
          duration: 2000
        });
        return;
      }

      var req = /^1[3456789][0-9]{9}$/
      if(!req.test(this.loginForm.phone)){
          uni.showToast({
              title: '手机号不合法',
              icon:'none',
              duration: 500
          });
          return;
      }
      //倒计时
      // 判断是否正在倒计时,如果上次正在倒计时，直接返回
      if(this.isCountDown) return;
      this.timer = setInterval(()=>{
          this.isCountDown = true;
          if(this.count<=1){
              clearInterval(this.timer);
              this.isCountDown=false;
              this.showVcode="获取验证码";
              this.count=10;

              return;
          }
          this.count--;
          this.showVcode=this.count+'s后获取';
      },1000);
      // 发送请求获取验证码
      let res = await instance({
          url:'user/vcode',
          data:{
              phone:this.loginForm.phone
          },
          method:'GET',
          tips:'',
          isLogin:true,
      });

      console.log(res);
      if(res.data.status === 0){
          uni.showToast({
              title: res.data.vcode+'',
              icon:'none',
              duration: 2000
          });
      }
    },
    // 手机号登陆
    async phoneLogin() {
        // 判断验证码是否合法
      // console.log(this.loginForm.phone.trim().length);
      let res = await instance({
          url:'user/login',
          method:'POST',
          data:{
              phone:this.loginForm.phone,
              vcode:this.loginForm.vcode
          },
          isLogin:true,
          tips:'登陆中...'
      });
      if(res.data.status === 0){
          uni.showToast({
              title: '登陆成功',
              icon:'none',
              duration: 2000
          });
          // 把token保存到本地
          uni.setStorageSync("my_token",res.data.token);

          // 跳转到首页
          uni.reLaunch({
               url: '/pages/home/index'
          });
      }else{
          uni.showToast({
              title: '服务器请求出错，请稍后重试',
              icon:'none',
              duration: 2000
          });
      }
      // console.log(res);
    }
  },
  onUnload(){
      clearInterval(this.timer)
  }
});
</script>

<style lang="less" scoped>
.phone-login-container {
  padding: 0rpx 68rpx;
  .phone-validate {
    margin-top: 100rpx;
    color: #393939;
    font-size: 43px;
  }
  .subtitle {
    display: block;
    margin-top: 20rpx;
    color: #a8a8a8;
    font-size: 30rpx;
  }
  .content {
    margin-top: 150rpx;
    height: 250rpx;
    position: relative;
    .phone {
      height: 100rpx;
      font-size: 15px;
      // background-color: green;
      position: relative;
      &::after {
        content: "";
        position: absolute;
        background-color: #e9e9e9;
        left: 0;
        right: 0;
        height: 1px;
        bottom: 1px;
      }
    }
    .get_vcode {
      position: absolute;
      right: 0;
      top: 20rpx;
      width: 164rpx;
      height: 56rpx;
      text-align: center;
      line-height: 56rpx;
      font-size: 24rpx;
      color: #a8a8a8;
      border: 1px solid rgba(168, 168, 168, 1);
      border-radius: 20px;
      z-index: 2;
    }
    .vcode {
      margin-top: 30px;
      height: 100rpx;
      font-size: 15px;
      position: relative;
      &::after {
        content: "";
        position: absolute;
        background-color: #e9e9e9;
        left: 0;
        right: 0;
        height: 1px;
        bottom: 1px;
      }
    }
  }
  .phone-login {
    margin-top: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      width: 568rpx;
      height: 98rpx;
    }
  }
}
</style>