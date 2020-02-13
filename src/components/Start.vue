<template>
  <view class="contain">
    <view class="bg_star">
      <image v-for="(item,index) in 5" :key="item" @click="star(index)"  src="/static/images/star_empty@2x.png" mode />
    </view>
    <view class="star">
      <image
        v-for="(item,index) in score"
        :key="item"
        @click="star(index)"
        src="/static/images/star_fill@2x.png"
        mode
      />
    </view>
  </view>
</template>

<script>
import Vue from "vue";
export default Vue.extend({
  props: {
    score: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      myScore:0
    };
  },
  methods: {
    star(index) {
        this.$emit("changeScore",index+1)
    }
  },
  created() {
    this.myScore = this.score;
  }
});
</script>

<style lang="less" scoped>
.contain {
  position: relative;
  .bg_star,
  .star {
    display: flex;
    align-items: center;
    float: left;
    image {
      width: 38rpx;
      height: 36rpx;
    }
  }
  .star {
    position: absolute;
    top: 0;
    left: 0;
  }
}
</style>