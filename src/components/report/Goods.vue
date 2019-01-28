<template>
  <div id="report_goods">
    <div class="search-box">
      <div class="search-condition">
        <el-row :gutter="25">
          <el-col :span="6">
            <div class="search-main">
              <span class="search-text">产品货号</span>
              <el-input class="search-input" placeholder="按产品货号搜索" v-model="search.merchant_code"></el-input>
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
          <el-col :span="6">
            <div class="search-main" style="visibility:hidden;">
              <span class="search-text">产品货号</span>
              <el-input class="search-input"></el-input>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="search-btn"></div>
    </div>
    <div class="search-table">
      <el-table :data="tableData" align="center">
        <el-table-column align="center" label="商品货号" prop="merchant_code"></el-table-column>
        <el-table-column align="center" label="商品图片">
          <template slot-scope="scope">
            <el-button @click="showImg(scope.row)" type="text">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" label="订单数量" prop="order_count"></el-table-column>
        <el-table-column align="center" label="净订单数量" prop="clear_order_count"></el-table-column>
        <el-table-column align="center" label="退款订单数量" prop="refund_order_count"></el-table-column>
        <el-table-column align="center" label="商品销售数量" prop="goods_count"></el-table-column>
        <el-table-column align="center" label="净商品销售数量" prop="clear_goods_count"></el-table-column>
        <el-table-column align="center" label="退款商品数量" prop="refund_goods_count"></el-table-column>
        <el-table-column align="center" label="销售总金额" prop="money"></el-table-column>
        <el-table-column align="center" label="净销售总金额" prop="clear_money"></el-table-column>
        <el-table-column align="center" label="退款总金额" prop="refund_money"></el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="kuaixiao(scope.row)">款销分析</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog :visible.sync=imgShow>
        <img :src="added.img" alt="">
      </el-dialog>
    </div>

  </div>
</template>

<script>
  import router from "../../router/index.js";

  export default {
    name: "GoodsReport",
    created() {
      this.loadData();
    },
    methods: {
      showImg(row) {
        this.added = { img: row.image };
        this.imgShow = true;
      },
      kuaixiao(row) {
        this.$router.push({
          name: "report_goods_kuanxiao",
          params: { merchant_code: row.merchant_code }
        });
      },
      async loadData() {
        let search = this.search;
        let result = await this.$axios.get("/admin/report/goods", {
          params: search
        });
        if(result.data.status != 0) return;
        (this.count = result.data.data.count),
          (this.total_page = result.data.data.total_page);
        this.tableData = result.data.data.list;
      }
    },
    data() {
      return {
        imgShow: false,
        added: {},
        search: {},
        tableData: [],
        count: 0,
        total_page: 0
      };
    }
  };
</script>

<style scoped>
</style>


