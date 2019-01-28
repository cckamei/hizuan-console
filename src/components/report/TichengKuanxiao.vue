<template>
  <div id="report_goods_kuanxiao">
    <div class="search-box">
      <div class="search-condition">
        <el-row :gutter="25">
          <div v-if="is_diamond">
            <el-col :span="6">
              <div class="search-main">
                <span class="search-text">
                  主钻分数:
                </span>
                <el-select class="search-input" v-model="search.zhuzuanfenshu">
                  <el-option v-for="item in  zhuzuanfenshuList" :key="item" :label="item" :value="item"></el-option>
                </el-select>
              </div>
            </el-col>

            <el-col :span="6">
              <div class="search-main">
                <span class="search-text">
                  钻石净度:
                </span>
                <el-select class="search-input" v-model="search.zuanshijingdu">
                  <el-option v-for="item in  zuanshijingduList" :key="item" :label="item" :value="item"></el-option>
                </el-select>
              </div>
            </el-col>
          </div>
          <div v-else>

            <el-col :span="6">
              <div class="search-main">
                <span class="search-text">
                  主石名称:
                </span>
                <el-select class="search-input" v-model="search.zhushimingcheng">
                  <el-option v-for="item in  zhushimingchengList" :key="item" :label="item" :value="item"></el-option>
                </el-select>
              </div>
            </el-col>

            <el-col :span="6">
              <div class="search-main">
                <span class="search-text">
                  主石评级:
                </span>
                <el-select class="search-input" v-model="search.zhushipingji">
                  <el-option v-for="item in  zhushipingjiList" :key="item" :label="item" :value="item"></el-option>
                </el-select>
              </div>
            </el-col>

            <el-col :span="6">
              <div class="search-main">
                <span class="search-text">
                  颜色:
                </span>
                <el-select class="search-input" v-model="search.color">
                  <el-option v-for="item in  colorList" :key="item" :label="item" :value="item"></el-option>
                </el-select>
              </div>
            </el-col>

            <el-col :span="6">
              <div class="search-main">
                <span class="search-text">
                  规格:
                </span>
                <el-select class="search-input" v-model="search.guige">
                  <el-option v-for="item in  guigeList" :key="item" :label="item" :value="item"></el-option>
                </el-select>
              </div>
            </el-col>
          </div>

          <el-col :span="6">
            <div class="search-main">
              <span class="search-text">创建日期</span>
              <el-date-picker class="search-input" format="yyyy年MM月dd日" value-format="yyyy-MM-dd" v-model="search.start" type="date" placeholder="选择日期">
              </el-date-picker>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="search-main">
              <span class="search-text">至</span>
              <el-date-picker class="search-input" format="yyyy年MM月dd日" value-format="yyyy-MM-dd" v-model="search.end" type="date" placeholder="选择日期">
              </el-date-picker>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="search-btn">
        <el-button type="primary" @click="loadData()">查询</el-button>
      </div>
    </div>
    <div class="search-table">
      <el-table :data="tableData" stripe align="center">
        <el-table-column align="center" label="主钻分数" v-if="is_diamond" prop="zhuzuanfenshu"></el-table-column>
        <el-table-column align="center" v-if="is_diamond" label="钻石净度" prop="zuanshijingdu">
        </el-table-column>
        <el-table-column align="center" label="主石名称" v-if="!is_diamond" prop="zhushimingcheng"></el-table-column>
        <el-table-column align="center" v-if="!is_diamond" label="主石评级" prop="zhushipingji"></el-table-column>
        <el-table-column align="center" label="颜色" prop="color"></el-table-column>
        <el-table-column align="center" label="金颜色" prop="gold_color"></el-table-column>
        <el-table-column align="center" label="规格" prop="guige"></el-table-column>
        <el-table-column align="center" label="公司模号" prop="mode_code"></el-table-column>
        <el-table-column align="center" label="提成比数" prop="order_count"></el-table-column>
        <el-table-column align="center" label="提成金额" prop="money"></el-table-column>
      </el-table>
    </div>

  </div>
</template>

<script>
import router from "../../router/index.js";

export default {
  name: "TichengKuanxiaoReport",
  created() {
    this.loadData();
  },
  methods: {
    showImg(row) {
      this.added = { img: row.image };
      this.imgShow = true;
    },
    async loadData() {
      let search = this.search;
      let result = await this.$axios.get("/admin/report/kuanxiao_ticheng/", {
        params: search
      });
      if (result.data.status != 0) return;
      this.tableData = result.data.data;
      if (this.tableData.length > 0) {
        this.is_diamond = this.tableData[0].is_diamond;
      }
      let that = this;
      this.tableData.forEach(function(value, index) {
        that.zhuzuanfenshuList.push(value.zhuzuanfenshu);
        that.zhuzuanfenshuList = Array.from(new Set(that.zhuzuanfenshuList));
        that.zuanshijingduList.push(value.zuanshijingdu);
        that.zuanshijingduList = Array.from(new Set(that.zuanshijingduList));
        that.zhushimingchengList.push(value.zhushimingcheng);
        that.zhushimingchengList = Array.from(
          new Set(that.zhushimingchengList)
        );
        that.zhushipingjiList.push(value.zhushipingji);
        that.zhushipingjiList = Array.from(new Set(that.zhushipingjiList));
        that.colorList.push(value.color);
        that.colorList = Array.from(new Set(that.colorList));
        that.guigeList.push(value.guige);
        that.guigeList = Array.from(new Set(that.guigeList));
      });
    }
  },
  data() {
    return {
      is_diamond: false,
      merchant_code: this.$route.params.merchant_code,
      imgShow: false,
      added: {},
      search: {
        merchant_code: this.$route.params.merchant_code
      },
      tableData: [],
      zhuzuanfenshuList: [],
      zuanshijingduList: [],
      colorList: [],
      guigeList: [],
      zhushimingchengList: [],
      zhushipingjiList: []
    };
  }
};
</script>

<style scoped>
</style>


