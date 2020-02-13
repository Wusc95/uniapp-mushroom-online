<template>
  <view class="course-detail-container" v-if="courseDetails">
    <!--封面图-->
    <view v-if="!isPlaying" class="cover_image">
      <image :src="courseDetails.course.cover_image_url" mode />
      <view class="play">
        <image @click="play" src="/static/images/play@2x.png" mode />
        <text>播放课程简介</text>
      </view>
    </view>
    <view v-else class="course_video">
      <video id="videoId" autoplay="true" controls :src="courseDetails.course.course_video_url"></video>
    </view>
    <!-- 2.0 简介 -->
    <view class="introduction">
      <view class="title-price">
        <text>{{courseDetails.course.title}}</text>
        <text>￥{{courseDetails.course.price}}.00</text>
      </view>
      <text class="introduce">{{courseDetails.course.introduction}}</text>
      <view class="star">
        <!-- Start子组件 -->
        <start :score="courseDetails.course.score" @changeScore="changeScore"></start>
        <text>{{courseDetails.course.study_count}}人在学</text>
      </view>
      <view class="study-share">
        <image @click="goToStudy" src="/static/images/start_study@2x.png" alt />
        <button open-type="share" plain class="share-button"></button>
      </view>
    </view>
    <!-- tabBar -->
    <view class="catalog">
      <view class="head">
        <text
          v-for="(item,index) in menu"
          :key="index"
          @click="toggleSelect(index)"
          :class="[activeIndex === index?'active':'']"
        >{{item}}</text>
      </view>
      <view class="body">
        <view class="catelog-container" v-if="activeIndex === 0">
          <text v-for="(item,index) in courseDetails.videos" :key="index">{{item.id}}.{{item.name}}</text>
          <text v-if="!courseDetails.videos">courseDetails.videos</text>
        </view>
        <view class="lecturer-container" v-else-if="activeIndex === 1">
          <view v-if="courseDetails.lecturer" class="info">
            <image :src="courseDetails.lecturer.avatar" alt />
            <view class="name-follow">
              <text>{{courseDetails.lecturer.name}}</text>
              <text>关注人数：{{courseDetails.lecturer.follow_count}}</text>
            </view>
            <text
              @click="followOrUnFollow(courseDetails.lecturer)"
              :class="[courseDetails.lecturer.is_follow === 0 ? 'unfollow' : 'follow']"
            >{{courseDetails.lecturer.is_follow === 0 ? '关注' : '已关注'}}</text>
          </view>
          <view v-if="courseDetails.lecturer" class="introduce">
            <text>{{courseDetails.lecturer.introduction}}</text>
          </view>
          <text style="color:#636363;font-size:15px;" v-if="!courseDetails.lecturer">暂无讲师简介哦~</text>
        </view>
        <view class="comment-container" v-else-if="activeIndex === 2">
          <view class="comment-item" v-for="(item,index) in courseDetails.comments" :key="index">
            <view class="info">
              <image :src="item.avatar" />
              <view class="nickname-content">
                <view class="nickname">
                  <view style="margin-top:12rpx;">{{item.nickname}}</view>&nbsp;&nbsp;
                  <view style="margin-left:20rpx">
                    <start :score="item.score" />
                  </view>
                </view>
                <view>{{item.content}}</view>
              </view>
            </view>
            <view class="star">
              <image
                @click="likeOrUnLike(item,index)"
                :src="item.is_like === 1 ? '/static/images/like_normal@2x.png' : '/static/images/like_highlight@2x.png'"
              />
            </view>
            <text class="time">{{item.comment_time}}</text>
          </view>

          <text
            style="color:#636363;font-size:15px;padding:38rpx;"
            v-if="!courseDetails.comments"
          >暂无评论哦，请学习之后再评价~</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang='ts'>
import Vue from "vue";
import { instance } from "../../utlis/http.js";
import start from "../../components/Start.vue";
export default Vue.extend({
  components: {
    start
  },
  data() {
    return {
      courseId: null,
      courseDetails: null,
      isPlaying: false,
      menu: ["目录", "讲师介绍", "评价"],
      activeIndex: 0, // 按钮的索引
      isLike:1 // 是否点赞 1不点赞2点赞
    };
  },
  onLoad(options) {
    console.log(options);
    this.courseId = options.id;
  },
  onShareAppMessage(res) {
    console.log(res);
    return {
      title: `${this.course_detail.course.title}`,
      path: "/pages/home/index"
    };
  },
  onShow() {
    this.getCourseDetails();
  },
  methods: {
    // 获取课程详情
    async getCourseDetails() {
      const res = await instance({
        url: `course/${this.courseId}`
      });
      if (res.data.status === 0) {
        this.courseDetails = res.data.message;
        this.menu[2] = `评价(${res.data.message.commentTotal})`;
      } else {
        uni.showToast({
          title: "服务器出错，请稍后重试",
          icon: "none",
          duration: 2000
        });
      }
    },
    // 点击播放视屏
    play() {
      this.isPlaying = true;
      // 手动播放
      // setTimeout(() => {
      //   uni.createVideoContext("videoId").play();
      // }, 200);
    },
    // 跳转到学习页面
    goToStudy(id) {
      uni.navigateTo({
        url: `/pages/play/index?id=${this.courseId}`
      });
    },
    // 修改星星的数据
    changeScore(value) {
      this.courseDetails.course.score = value;
      console.log(value);
    },
    // tab的选中事件
    toggleSelect(index) {
      this.activeIndex = index;
    },
    // 是否关注作者
    async followOrUnFollow(lecturer) {
      switch (lecturer.is_follow) {
        case 0: // 如果等于0是未关注状态，发送请求改为关注状态1
          const res1 = await instance({
            url: "lecturer/follow",
            data: {
              lecturer_id: lecturer.id
            },
            method: "POST"
          });
          if (res1.data.status === 0) {
            this.courseDetails.lecturer.is_follow = 1;
            uni.showToast({
              title: res1.data.message,
              icon: "none",
              duration: 2000
            });
          }
          break;
        case 1:
          const res2 = await instance({
            url: "lecturer/unfollow",
            data: {
              lecturer_id: lecturer.id
            },
            method: "POST"
          });
          if (res2.data.status === 0) {
            this.courseDetails.lecturer.is_follow = 0;
            uni.showToast({
              title: res2.data.message,
              icon: "none",
              duration: 2000
            });
          }
          break;
        default:
          break;
      }
    },
    // 评论是否点赞
    async likeOrUnLike(item,index) {
      if(item.is_like === 1){
        this.isLike = 2
      }else{
        this.isLike = 1
      }
      const res = await instance({
        url:'comment/like',
        data:{
          comment_id:item.id,
          is_like:this.isLike
        },
        method:'POST'
      })
      if(res.data.status === 0){
        console.log(this.courseDetails.comments[index].is_like)
        if(item.is_like === 1){
          this.courseDetails.comments[index].is_like = 2
        }else{
          this.courseDetails.comments[index].is_like = 1
        }
      }
    }
  }
});
</script>
<style lang="less" scoped>
.course-detail-container {
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
    position: relative;
    .play {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      position: absolute;
      image {
        width: 164rpx;
        height: 164rpx;
      }
      text {
        margin-top: 10rpx;
        color: #e9e9e9;
        font-size: 30rpx;
      }
    }
  }
  .course_video {
    width: 750rpx;
    height: 434rpx;
    video {
      width: 750rpx;
      height: 434rpx;
    }
  }
  .introduction {
    z-index: 3;
    position: absolute;
    margin-top: 0rpx;
    border-radius: 16px 16px 0px 0px;
    left: 0;
    right: 0;
    height: 452rpx;
    background-color: #ffffff;
    padding: 20rpx 30rpx;
    .title-price {
      margin-top: 20rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      text:nth-child(1) {
        font-size: 24px;
        color: #343434;
        font-weight: Bold;
      }
      text:nth-child(2) {
        font-size: 22px;
        color: #ee3939;
      }
    }
    .introduce {
      color: #818181;
      font-size: 12px;
      margin-top: 100rpx;
    }
    .star {
      display: flex;
      margin-top: 20rpx;
      text {
        height: 50rpx;
        line-height: 50rpx;
        margin-left: 20rpx;
        font-size: 12px;
        color: #fe8e38;
      }
    }
    .study-share {
      margin-top: 42rpx;
      margin-bottom: 52rpx;
      image:nth-child(1) {
        width: 568rpx;
        height: 92rpx;
      }
      .share-button {
        border: none;
        width: 92rpx;
        height: 92rpx;
        background-color: #fff;
        border-radius: 10rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        float: right;
        background-image: url(../../static/images/share@2x.png);
        background-repeat: no-repeat;
        background-size: 34rpx 34rpx;
        background-position: 30rpx 30rpx;
      }
    }
  }
  .catalog {
    margin-top: 520rpx;
    // position: absolute;
    z-index: 5;
    width: 750rpx;
    // height: 582rpx;
    background-color: #ffffff;
    .head {
      height: 120rpx;
      background-color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #f5f5f5;
      text {
        text-align: center;
        color: #a8a8a8;
        font-size: 14px;
        height: 120rpx;
        line-height: 120rpx;
        flex: 1;
        position: relative;
      }
      .active {
        color: #333333;
        font-weight: bold;
        &::after {
          content: "";
          position: absolute;
          left: 88rpx;
          bottom: 0px;
          width: 74rpx;
          height: 3px;
          background-color: #ff8e43;
        }
      }
    }
    .catelog-container {
      padding: 30rpx;
      height: 582rpx;
      text {
        background-color: #ffffff;
        color: #636363;
        font-size: 30rpx;
        height: 80rpx;
        line-height: 80rpx;
        display: block;
      }
    }
    .lecturer-container {
      padding: 30rpx;
      .info {
        height: 200rpx;
        display: flex;
        align-items: center;
        .name-follow {
          margin-left: 30rpx;
          display: flex;
          flex-direction: column;
          flex: 1;
          text:nth-child(1) {
            font-size: 34rpx;
            color: #333333;
          }
          text:nth-child(2) {
            font-size: 28rpx;
            margin-top: 15rpx;
            color: #a8a8a8;
          }
        }
        image {
          margin-left: 12rpx;
          width: 120rpx;
          height: 120rpx;
        }
        .unfollow {
          width: 136rpx;
          height: 52rpx;
          line-height: 52rpx;
          text-align: center;
          border: 1px solid #a8a8a8;
          border-radius: 26rpx;
          color: #a8a8a8;
          font-size: 28rpx;
        }
        .follow {
          width: 136rpx;
          height: 52rpx;
          line-height: 52rpx;
          text-align: center;
          border: 1px solid #a8a8a8;
          border-radius: 26rpx;
          color: #fff;
          background-color: #a8a8a8;
          font-size: 28rpx;
        }
      }
      .introduce {
        background-color: #ffffff;
        text {
          margin-left: 12rpx;
          font-size: 12px;
          font-family: PingFang SC;
          font-weight: 400;
          line-height: 20px;
          color: rgba(168, 168, 168, 1);
          opacity: 1;
        }
      }
    }
    .comment-item {
      background-color: #ffffff;
      padding: 30rpx;
      height: 180rpx;
      border-bottom: 2px solid #f1f1f1;
      .info {
        height: 120rpx;
        display: flex;
        align-items: center;
        image {
          margin-left: 6rpx;
          width: 96rpx;
          height: 96rpx;
          border-radius: 50%;
        }
        .nickname-content {
          flex: 1;
          margin-left: 30rpx;
          .nickname {
            color: #333333;
            font-size: 30rpx;
            font-weight: bold;
            align-items: center;
            display: flex;
            view {
              height: 100%;
              display: inline-block;
            }
          }
          view:nth-child(2) {
            margin-top: 16rpx;
            color: #a8a8a8;
            font-size: 12px;
          }
        }
        .time {
          color: #a8a8a8;
          font-size: 11px;
        }
      }
    }
    .star {
      image {
        margin-top: 30rpx;
        width: 44rpx;
        height: 44rpx;
        float: right;
        margin-right: 20rpx;
      }
      image:nth-child(0) {
        margin-right: 20rpx;
      }
    }
  }
}
</style>