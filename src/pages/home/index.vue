<template>
<view class="home-container">
	<!-- 搜索框 -->
	<search-bar tips='请输入学科关键字'/>
	<!-- 轮播图 -->
	<swiper autoplay circular indicator-active-color="#fff" interval="3000">
		<navigator :url="'/pages/course-details/index?id='+item.course_id" v-for="item in swipers" :key="item.id">
			<swiper-item>
				<image :src="item.img_url"></image>
			</swiper-item>
		</navigator>
	</swiper>
	<!-- 推荐课程 -->
	<view>
		<view class="tips">
			<text class="tip">推荐课程</text>
			<image @click="goToCoursePage" src="/static/images/arrow@2x.png" alt="" />
		</view>
		<scroll-view scroll-x class="course-container">
			<navigator :url="'/pages/course-details/index?id='+item.relation_id" class="course-item" v-for="item in courses" :key="item.id">
				<image :src="item.icon" alt="" />
			</navigator>
		</scroll-view>
	</view>
	<!-- 热门视频 -->
	<view>
		<view class="tips">
			<text class="tip">热门视频</text>
			<image @click="goToCourseDetail(3)" src="/static/images/arrow@2x.png" alt="" />
		</view>
		<view class="hot-video">
			<navigator :url="'/pages/course-details/index?id='+item.course_id" class="video-item" v-for="item in videos" :key="item.id">
				<image :src="item.cover_photo_url" alt="" />
				<text class="title">{{item.name}}</text>
				<text class="subtitle">{{item.view_count}}人已观看</text>
			</navigator>
		</view>
	</view>
</view>
</template>

<script lang="ts">
import Vue from "vue";
import { instance } from "../../utlis/http.js";
import searchBar from '../../components/searchBar.vue'
export default Vue.extend({
  data() {
    return {
      // 轮播图数据
      swipers: [],
      // 推荐课程
      courses: [],
      // 热门视屏
      videos: []
    };
  },
  onLoad() {
    // 获取轮播图数据
    this.getSwipersData();
    // 获取课程数据
    this.getCoursesData();
    // 获取热门视屏数据
    this.getVideosData();
  },
  methods: {
	// 跳转到推荐课程页面 tabBar 课程
	goToCoursePage(){
		uni.switchTab({
			url:'/pages/course/index'
		})
	},
	// 跳转到课程详情页  id = 3 是创意手绘板课程
	goToCourseDetail(id){
		uni.navigateTo({
			url:'/pages/course-details/index?id='+id
		})
	},
    async getSwipersData() {
      let res = await instance({ url: "home/swipers" });
      if (res.data.status === 0) {
        this.swipers = res.data.message;
      }
    },
    async getCoursesData() {
      let res = await instance({ url: "home/course" });
      if (res.data.status === 0) {
        this.courses = res.data.message;
      }
    },
    async getVideosData() {
      let res = await instance({ url: "home/video" });
      if (res.data.status === 0) {
        this.videos = res.data.message;
      }
    }
  },
  components:{
	  searchBar
  }
});
</script>

<style lang="less" scoped>
.home-container {
  padding: 20rpx;
  background-color: #fff;
}
swiper {
  width: 100%;
  height: 342rpx;
  swiper-item {
    width: 100%;
    height: 100%;
  }
  image {
    width: 100%;
    height: 100%;
  }
}
.tips {
  height: 120rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  text {
    font-size: 36rpx;
    font-weight: 700;
    color: #212121;
  }
  image {
    width: 48rpx;
    height: 48rpx;
  }
}
.course-container {
  height: 170rpx;
  white-space: nowrap;
  .course-item {
    width: 296rpx;
    height: 168rpx;
    display: inline-block;
    margin-right: 32rpx;
    image {
      width: 100%;
      height: 100%;
    }
  }
}
.hot-video {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  .video-item {
    width: 340prx;
    image {
      width: 340rpx;
      height: 210rpx;
      border-radius: 12rpx;
    }
    .title {
	  display: block;
      margin-top: 15rpx;
      color: #262626;
      font-size: 26rpx;
    }
    .subtitle {
	  display: block;
      margin-top: 15rpx;
      margin-bottom: 15rpx;
      color: #959595;
      font-size: 18rpx;
    }
  }
}
</style>