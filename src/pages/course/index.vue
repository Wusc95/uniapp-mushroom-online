<template>
    <courses-list :courses="courses" />
</template>

<script lang="ts">
import Vue from "vue";
import { instance } from "../../utlis/http.js";
import CoursesList from "../../components/CourseList.vue";
export default Vue.extend({
  components: {
    CoursesList
  },
  data() {
    return {
      courses: []
    };
  },
  // onLoad() {
  //   this.getCourseData();
  // },
  onShow(){
    this.getCoursesData();
  },
  methods: {
    // 获取课程列表
    async getCoursesData() {
      let res = await instance({
        url: "course/list",
        tips: "数据加载中..."
      });
      if (res.data.status === 0) {
        this.courses = res.data.message;
      } else {
        uni.showToast({
          title: "服务器错误,请稍后重试",
          icon: "none",
          duration: 2000
        });
      }
    }
  },
  
});
</script>

<style >
	.content {
		text-align: center;
		height: 400upx;
	}
    .logo{
        height: 200upx;
        width: 200upx;
        margin-top: 200upx;
    }
	.title {
		font-size: 36upx;
		color: #8f8f94;
	}
</style>
