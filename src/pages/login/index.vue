<template>
  <view class="login-container">
    <image src="/static/images/logo@2x.png" class="logo" />
    <text class="title">蘑菇在线</text>
    <image src="/static/images/login_tips@2x.png" class="login-tips" />
    <button open-type="getUserInfo" @getuserinfo="wxLogin" plain class="wx-login-button">
      <image src="/static/images/wx_login@2x.png" class="wx-login-img" />
    </button>
    <text @click="phoneLogin" class="phone-login">手机号登录</text>
    <text class="bottom-tip">Copyright © 2019 蘑菇在线</text>
  </view>
</template>

<script lang='ts'>
import Vue from "vue";
import {instance} from '../../utlis/http.js'
export default Vue.extend({
  data() {
    return {};
  },
  methods: {
    // 微信授权登陆处理逻辑
    wxLogin(e: any) {
      //   console.log(e);
      // 如果用户拒绝，直接返回
      if (e.detail.errMsg == "getUserInfo:fail auth deny") return;

      // 解构头像和昵称
      let { avatarUrl: avatar, nickName: nickname } = e.detail.userInfo;

      // 获取登录的code
      uni.login({
        success: ({code})=>{
            // 发送请求进行微信授权登陆
            instance({
                url:'user/wxlogin',
                method:'POST',
                data:{
                    code,
                    avatar,
                    nickname
                },
                isLogin:true,
                tips:'授权登陆中...',
            }).then((res)=>{
                // console.log(res);
                if(res.data.status === 0){
                    // 把token保存到本地
                    uni.setStorageSync("my_token",res.data.token)
                    //跳转到首页
                    uni.reLaunch({
                        url:'/pages/home/index'
                    });
                }else {
                    uni.showToast({
                        title:'服务器错误，请稍后重试',
                        icon:'none',
                        duration:2000
                    });
                }
            })
        }
      });
      //   console.log(avatar,nickname)
    },
    // 手机号登陆
    phoneLogin() {
      uni.navigateTo({
          url:'/pages/phone-login/index'
      })
    }
  }
});
</script >
    
<style lang="less" scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  .logo {
    margin-top: 180rpx;
    width: 212rpx;
    height: 212rpx;
  }
  .title {
    color: #333333;
    font-size: 24px;
    margin-top: 20rpx;
  }
  .login-tips {
    margin-top: 30rpx;
    height: 34rpx;
    width: 292rpx;
    position: relative;
  }
  .wx-login-button {
    margin-top: 200rpx;
    width: 568rpx;
    height: 98rpx;
    padding: 0;
    border: none;
  }
  .wx-login-img {
    // margin-top:200rpx;
    width: 568rpx;
    height: 98rpx;
  }
  .phone-login {
    margin-top: 40rpx;
    color: #333333;
    font-size: 15px;
  }
  .bottom-tip {
    color: #a8a8a8;
    font-size: 10px;
    position: absolute;
    bottom: 40rpx;
  }
}
.wx-login-container {
  position: relative;
  .wx-login-tip1 {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 450rpx;
    padding-top: 50rpx;
    img {
      width: 198rpx;
      height: 198rpx;
    }
    p {
      color: #bebebe;
      margin-top: 50rpx;
      font-size: 13px;
    }
  }
  .wx-login-tip1-cover {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    height: 500rpx;
    background: rgba(0, 0, 0, 1);
    opacity: 0.16;
  }
}
</style>