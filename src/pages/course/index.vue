<template>
  <view>
    <course-list :courses="courses"></course-list>
  </view>
</template>

<script lang="ts">
import Vue from "vue";
import { instance } from "../../utlis/http.js";
import CoursesList from "../../components/CourseList.vue";
export default Vue.extend({
  data() {
    return {
      courses: []
    };
  },
  onLoad() {},
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
  components: {
    CoursesList
  }
});
</script>

<style>
</style>
