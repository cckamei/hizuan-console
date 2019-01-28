<template>
  <div id="report_goods">
    <div class="search-box">
      <div class="search-condition">
        <el-row :gutter="25">
          <el-col :span="6">
            <div class="search-main">
              <span class="search-text">分销商姓名</span>
              <el-input class="search-input" placeholder="按分销姓名搜索" v-model="search.user_name"></el-input>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="search-main">
              <span class="search-text">分销商账号</span>
              <el-input class="search-input" placeholder="按分销账号搜索" v-model="search.user_id"></el-input>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="search-main">
              <span class="search-text">商品货号</span>
              <el-input class="search-input" placeholder="按商品货号搜索" v-model="search.merchant_code"></el-input>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="search-main">
              <span class="search-text">商品编号</span>
              <el-input class="search-input" placeholder="按商品编号搜索" v-model="search.sku_merchant_code"></el-input>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="search-main">
              <span class="search-text">用户卡号</span>
              <el-input class="search-input" placeholder="按用户卡号搜索" v-model="search.user_vip"></el-input>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="search-main">
              <span class="search-text">订单编号</span>
              <el-input class="search-input" placeholder="按订单编号搜索" v-model="search.order_id"></el-input>
            </div>
          </el-col>
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
        <el-button cricle type="primary">查询</el-button>

      </div>
    </div>
    <div class="search-table">
      <el-table :data="tableData" stripe align="center">
        <el-table-column align="center" label="订单编号" prop="order_id"></el-table-column>
        <el-table-column align="center" label="成交时间" prop="pay_time"></el-table-column>
        <el-table-column align="center" label="用户卡号" prop="user_vip"></el-table-column>
        <el-table-column align="center" label="商品货号" prop="merchant_code"></el-table-column>
        <el-table-column align="center" label="商品编号(SKU)" prop="sku_merchant_code"></el-table-column>
        <el-table-column align="center" label="公司模号" prop="mode_code"></el-table-column>
        <el-table-column align="center" label="分销商账号" prop="user_id"></el-table-column>
        <el-table-column align="center" label="分销商姓名" prop="user_name"></el-table-column>
        <el-table-column align="center" label="提成金额" prop="money"></el-table-column>
      </el-table>
      <el-pagination @current-change="handleCurrentChange" :current-page.sync="search.page" :page-size="search.size" layout="prev, pager, next, jumper" :page-count="total_page">
      </el-pagination>
    </div>

  </div>
</template>

<script>
import router from "../../router/index.js";

export default {
  name: "DisTichengReport",
  created() {
    this.loadData();
  },
  methods: {
    async handleCurrentChange(val) {
      this.search.page = val;
      this.loadData();
    },
    async loadData() {
      let search = this.search;
      let result = await this.$axios.get("/admin/report/dis_ticheng", {
        params: search
      });
      if (result.data.status != 0) return;
      this.count = result.data.data.count;
      this.total_page = result.data.data.total_page;
      this.tableData = result.data.data.list;
      console.log(this.tableData);
    }
  },
  data() {
    return {
      imgShow: false,
      added: {},
      search: { page: 1 },
      tableData: [],
      count: 0,
      total_page: 0
    };
  }
};
</script>

<style scoped>
.search-input {
  width: 200px;
}
</style>


