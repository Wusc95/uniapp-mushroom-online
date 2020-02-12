<template>
  <view class="contain">
    <view class="bg_star">
      <image v-for="item in 5" :key="item" src="/static/images/star_empty@2x.png" mode />
    </view>
    <view class="star">
      <image v-for="item in getStar" :key="item" src="/static/images/star_fill@2x.png" mode />
    </view>
  </view>
</template>

<script>
import Vue from 'vue'
export default Vue.extend({
    props:{
        getStar:{
            type:Number,
            default:0
        }
    },
    data() {
        return {
            
        }
    },
})
</script>

<style lang="less" scoped>
.contain {
  position: relative;
  .bg_star,.star{
      display: flex;
      align-items: center;
      float: left;
      image {
          width: 33px;
          height: 31px;;
      }
  }
  .star {
      position: absolute;
      top: 0;
      left: 0;
  }
}
</style>