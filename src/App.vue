<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  mpType: "app",
  onLaunch() {
    // 在这里需要判断是否token 如果存在直接跳转到首页
    const token = uni.getStorageSync("my_token");
    if (token) {
      // uni.reLaunch({
      //   url: "/pages/home/index"
      // });
    }
  },
  onShow() {},
  onHide() {}
});
</script>

<style>
/*每个页面公共css */
page {
  background-color: #f8f8f8;
}
</style>
