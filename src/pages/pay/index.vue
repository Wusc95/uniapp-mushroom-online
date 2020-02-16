<template>
  <view class="pay-container">
    <view class="order-info">
      <image :src="cover_image_url" />
      <view class="name">
        <text>{{title}}</text>
        <text>永久观看</text>
      </view>
      <text class="price">{{price}}</text>
    </view>
    <view class="pay-style">
      <view>支付方式</view>
      <view class="wx-pay">
        <image src="/static/images/wx_pay_logo@2x.png" alt />
        <view class="name">
          <text>微信支付</text>
          <text>微信安全支付</text>
        </view>
        <image class="select-image" src="/static/images/selected@2x.png" alt />
      </view>
    </view>
    <text class="tip">注：该订单不支持退款、提交订单则表示您同意《用户付款协议》</text>
    <view class="bottom">
      <view class="content">
        <text>实付金额</text>
        <text>￥{{price}}</text>
        <image @click="orderAndPay" class="pay" src="/static/images/wx_pay@2x.png" alt />
      </view>
    </view>
  </view>
</template>

<script>
import Vue from "vue";
import { instance } from "../../utlis/http.js";
export default Vue.extend({
  data() {
    return {
      cover_image_url: null,
      id: null,
      price: null,
      title: null
    };
  },
  methods: {
    // 创建订单并完成支付
    async orderAndPay() {
      // 创建订单
      const res = await instance({
        url: "order/create",
        method: "POST",
        data: {
          course_id: this.id,
          price: this.price
        }
      });
      if (res.data.status === 0) {
        // 模拟支付
        this.pay(res.data.order_id);
        // 模拟微信支付
        // this.wxpay();
      }
    },
    // 模拟支付
    async pay(order_id) {
      // 发送请求，修改数据库的订单支付状态
      const res = await instance({
        url: "order/pay",
        method: "POST",
        data: {
          order_id: order_id
        }
      });
      if (res.data.status === 0) {
        uni.showToast({
          title: res.data.message,
          icon: "success",
          duration: 1000,
          complete: () => {
            setTimeout(() => {
              uni.navigateBack({
                delta: 1
              });
            }, 1000);
          }
        });
      }
    },
    // 模拟微信支付
    wxpay() {}
  },
  onLoad(option) {
    (this.cover_image_url = option.cover_image_url),
      (this.id = option.id),
      (this.price = option.price),
      (this.title = option.title);
  }
});
</script>

<style lang="less" scoped>
.pay-container {
  height: 100%;
  width: 750rpx;
  .order-info {
    background-color: #ffffff;
    display: flex;
    width: 750rpx;
    height: 272rpx;
    align-items: center;
    border-bottom: 1px solid #f6f6f6;
    image {
      padding-left: 32rpx;
      width: 300rpx;
      height: 200rpx;
    }
    .name {
      align-self: flex-start;
      margin-top: 30rpx;
      margin-left: 30rpx;
      flex: 1;
      text:nth-child(1) {
        margin-top: 20rpx;
        color: #343434;
        font-size: 19px;
        display: block;
        font-weight: bolod;
      }
      text:nth-child(2) {
        margin-top: 20rpx;
        color: #a8a8a8;
        font-size: 12px;
      }
    }
    .price {
      align-self: flex-end;
      margin-bottom: 30rpx;
      color: #ee3939;
      font-size: 16px;
      font-weight: bold;
      padding-right: 32rpx;
    }
  }
  .pay-style {
    width: 750rpx;
    height: 410rpx;
    background-color: #ffffff;
    view:nth-child(1) {
      padding-left: 32rpx;
      height: 100rpx;
      line-height: 100rpx;
      border-bottom: 1px solid#F6F6F6;
      color: #343434;
      font-size: 16px;
    }
    .wx-pay {
      height: 200rpx;
      align-items: center;
      display: flex;
      // justify-content: space-between;
      image:nth-child(1) {
        padding-left: 32rpx;
        width: 38rpx;
        height: 34rpx;
      }
      .select-image {
        width: 36rpx;
        height: 36rpx;
        align-content: flex-end;
        padding-right: 32rpx;
      }
      .name {
        flex: 1;
        margin-left: 40rpx;
        text:nth-child(1) {
          color: #333333;
          display: block;
          font-size: 16px;
        }
        text:nth-child(2) {
          color: #a8a8a8;
          font-size: 11px;
          margin-top: 10rpx;
        }
      }
    }
  }
  .tip {
    position: absolute;
    color: #dbdbdb;
    width: 750rpx;
    text-align: center;
    font-size: 10px;
    bottom: 280rpx;
  }
  .bottom {
    width: 750rpx;
    height: 214rpx;
    position: fixed;
    bottom: 0;
    .content {
      align-items: center;
      display: flex;
      height: 214rpx;
      background-color: #fff;
      text:nth-child(1) {
        padding-left: 32rpx;
        color: #a2a2a2;
        font-size: 12px;
      }
      text:nth-child(2) {
        color: #ee3939;
        font-size: 20px;
        margin-left: 20rpx;
        font-weight: bold;
      }
      .pay {
        margin-left: 80rpx;
        width: 328rpx;
        height: 92rpx;
      }
    }
  }
}
</style>