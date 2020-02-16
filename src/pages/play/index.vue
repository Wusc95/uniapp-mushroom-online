<template>
  <view class="play-container" v-if="courseDetails">
    <!-- 视屏 -->
    <view class="cover_image">
      <video @play="onPlayVideo" id="videoId" controls :src="playingUrl"></video>
    </view>
    <!-- 基本信息渲染 -->
    <view class="introduction">
      <view class="title-and-info">
        <text class="title">{{courseDetails.course.title}}</text>
        <view class="info">
          <text>{{courseDetails.course.study_count}}人学过</text>
          <!-- 通过计算属性的方式 -->
          <!-- <text>难度:{{level}}</text> -->
          <!-- 通过方法的方式 -->
          <!-- <text>难度:{{getLevel(course_detail.course.level)}}</text> -->
          <!-- 通过过滤器的方式 -->
          <text>难度:{{courseDetails.course.level | getLevel}}</text>
          <text>时长:{{courseDetails.course.course_duration}}</text>
        </view>
      </view>
      <view class="comment">
        <image @click="evaluate" src="/static/images/evaluate@2x.png" alt />
      </view>
    </view>
    <!-- 课程进度 -->
    <view class="course-progress">
      <view class="title">课程进度</view>
      <view class="catelog-container">
        <view
          @click="playOnVideo(index,item)"
          class="course-item"
          v-for="(item,index) in courseDetails.videos"
          :key="item.id"
        >
          <text :class="[videoIndex === index?'active':'']">{{item.id}}.{{item.name}}</text>
          <text v-if="item.is_study == 1" class="studied">已学习</text>
          <text v-else :class="['time',index === playIndex ? 'active' : '']">{{item.duration}}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import Vue from "vue";
import { instance } from "../../utlis/http.js";
export default Vue.extend({
  onLoad(option) {
    console.log(option.id);
    this.courseId = option.id;
  },
  data() {
    return {
      courseId: null, // 课程id
      courseDetails: null, // 课程内容
      playingUrl: null, // 播放url
      videoIndex: 0, // 索引
      isValidateRight: false //判断是否授权购买
    };
  },
  onShow() {
    this.getCoursePlayInfo();
  },
  methods: {
    // 获取播放课程的数据
    async getCoursePlayInfo() {
      const res = await instance({
        url: "course/play/" + this.courseId
      });
      if (res.data.status === 0) {
        this.courseDetails = res.data.message;
        this.playingUrl = res.data.message.videos[0].video_url;
      } else {
        uni.showToast({
          title: "服务器错误，请稍后重试",
          duration: 2000
        });
      }
    },
    // 判断level的水平
    getLevel(level) {
      if (!this.courseDetails) return null;
      switch (this.courseDetails.course.level) {
        case 1:
          return "初级";
          break;
        case 2:
          return "中级";
          break;
        case 3:
          return "高级";
          break;

        default:
          return "无级别";
          break;
      }
    },
    // 评价
    evaluate() {
      console.log("-----------评价--------------");
    },
    // 播放时触发的事件
    onPlayVideo() {
      if (!this.isValidateRight) {
        this.playOnVideo(0, this.courseDetails.videos[0]);
      }
    },
    // 索引切换，播放视屏
    async playOnVideo(index, item) {
      this.videoIndex = index;
      // 停止之前播放的视屏
      uni.createVideoContext("videoId").pause();
      // 去鉴权，如果支付了，则正常播放，如果没有，则提示要他跳转支付页面
      const isCanPlay = await this.validatePlayRight();
      if (isCanPlay) {
        this.playingUrl = item.video_url;
        // playingUrl 赋值后页面会重新渲染，渲染期间视屏播放不了
        setTimeout(() => {
          uni.createVideoContext("videoId").play();
        }, 200);
      } else {
        // 提示需要购买，然后跳转到购买页面
        uni.showModal({
          title: "提示",
          content: "您还没有购买，请先购买后，" + "\n" + "来播放哦~",
          confirmText: "去购买",
          confirmColor: "#ff9a29",
          success: res => {
            if (res.confirm) {
              uni.navigateTo({
                url: `/pages/pay/index?id=${this.courseId}&title=${this.courseDetails.course.title}
                            &price=${this.courseDetails.course.price}&cover_image_url=${this.courseDetails.course.cover_image_url}`
              });
            }
          }
        });
      }
    },
    // 判断是否购买课程
    async validatePlayRight() {
      // 获取订单信息
      const res = await instance({
        url: "order/info",
        data: {
          course_id: this.courseId
        }
      });
      if (res.data.status === 0) {
        if (res.data.message.pay_status === 0) {
          return Promise.resolve(false);
        } else {
          this.isValidateRight = true;
          return Promise.resolve(true);
        }
      } else {
        return Promise.resolve(false);
        uni.showToast({
          title: "服务器错误，请稍后重试",
          duration: 2000,
          icon: "none"
        });
      }
    }
  },
  computed: {
    level() {
      if (!this.courseDetails) return null;
      switch (this.courseDetails.course.level) {
        case 1:
          return "初级";
          break;
        case 2:
          return "中级";
          break;
        case 3:
          return "高级";
          break;

        default:
          return "无级别";
          break;
      }
    }
  },
  filters: {
    getLevel(level) {
      switch (level) {
        case 1: {
          return "初级";
          break;
        }

        case 2: {
          return "中级";
          break;
        }

        case 3: {
          return "高级";
          break;
        }

        default:
          return "无级别";
          break;
      }
    }
  }
});
</script>
<style lang="less" scoped>
.play-container {
  background-color: #efefef;
  position: relative;
  .cover_image {
    width: 750rpx;
    height: 434rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    image {
      width: 750rpx;
      height: 434rpx;
    }
    video {
      width: 750rpx;
      height: 434rpx;
    }
  }
  .introduction {
    z-index: 3;
    position: absolute;
    margin-top: -10rpx;
    border-radius: 16px 16px 0px 0px;
    border-bottom: 1px solid #f5f5f5;
    left: 0;
    right: 0;
    height: 192rpx;
    background-color: #ffffff;
    padding: 38rpx 32rpx;
    display: flex;
    align-items: center;
    .title-and-info {
      flex: 1;
      .title {
        color: #343434;
        font-size: 24px;
        font-weight: bold;
      }
      .info {
        margin-top: 12rpx;
        height: 34rpx;
        line-height: 34rpx;
        color: #818181;
        font-size: 12px;
        display: block;
        text {
          padding-right: 15rpx;
        }
        text:nth-child(2),
        text:nth-child(3) {
          padding-left: 15rpx;
        }
        text:nth-child(2) {
          position: relative;
          &::before {
            position: absolute;
            content: "";
            background-color: #ebebeb;
            left: 0rpx;
            width: 1px;
            top: 8rpx;
            height: 20rpx;
          }
          &::after {
            position: absolute;
            content: "";
            background-color: #ebebeb;
            right: 0rpx;
            width: 1px;
            top: 8rpx;
            height: 20rpx;
          }
        }
      }
    }
    .comment {
      margin-top: 32rpx;
      image {
        width: 198rpx;
        height: 80rpx;
      }
    }
  }
  .course-progress {
    margin-top: 222rpx;
    padding: 44rpx 32rpx;
    background-color: #fff;
    .title {
      color: #343434;
      font-size: 30rpx;
      font-family: PingFang SC;
      font-weight: 800;
    }
    .catelog-container {
      .course-item {
        display: flex;
        justify-content: space-between;
      }
      text {
        color: #636363;
        font-size: 30rpx;
        height: 80rpx;
        line-height: 80rpx;
      }
      .studied {
        float: right;
        margin-top: 16rpx;
        font-size: 10px;
        text-align: center;
        color: #aaaaaa;
        background-color: #f5f5f5;
        border-radius: 12rpx;
        width: 98rpx;
        height: 48rpx;
        line-height: 48rpx;
      }
      .time {
        float: right;
      }
      .active {
        color: #ff5e00;
      }
    }
  }
}
.comment-content {
  label {
    width: 100rpx;
  }
  textarea {
    width: 100%;
    height: 200rpx;
  }
}
</style>