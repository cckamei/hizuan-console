<template>
    <el-tabs type="border-card" v-model="activeRecommendTab" @tab-click="handleTabClick">
        <el-tab-pane label="首页轮播" name="1">
            <HomeBanner></HomeBanner>
        </el-tab-pane>
        <el-tab-pane label="首页条幅" name="2">
            <HomeSlide></HomeSlide>
        </el-tab-pane>
        <el-tab-pane label="套系推荐" name="3">
            <Series></Series>
        </el-tab-pane>
        <el-tab-pane label="购物车推荐" name="4">
            <Cart></Cart>
        </el-tab-pane>
    </el-tabs>
</template>
<script>
import HomeBanner from "./recommend/HomeBanner";
import HomeSlide from "./recommend/HomeSlide";
import Series from "./recommend/Series";
import Cart from "./recommend/Cart";

export default {
  methods: {
    handleTabClick(tab) {
      window.sessionStorage.activeRecommendTab = tab.name;
    }
  },
  created() {
    let activeTab = window.sessionStorage.activeRecommendTab;
    if (activeTab) this.activeRecommendTab = activeTab;
  },
  data() {
    return {
      activeRecommendTab: "1"
    };
  },
  components: {
    HomeBanner: HomeBanner,
    HomeSlide: HomeSlide,
    Series: Series,
    Cart: Cart
  }
};
</script>
<style>
</style>
