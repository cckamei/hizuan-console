<template>
  <div id="jiaoyi">
    <div class="search-box">
      <div class="search-condition">
        <el-row :gutter="25">
          <el-col :span="6">
            <div class="search-main">
              <span class="search-text">套系名称</span>
              <el-input class="search-input" placeholder="按套系名称搜索" v-model="search.series_name"></el-input>
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
        <el-button type="primary" @click="loadData()">查询</el-button>
      </div>
    </div>
    <div class="search-table">
      <el-table :data="tableData" stripe align="center" show-summary>
        <el-table-column align="center" label="套系名称" prop="series_name"></el-table-column>
        <el-table-column align="center" label="订单数量" prop="order_count"></el-table-column>
        <el-table-column align="center" label="净订单数量" prop="clear_order_count"></el-table-column>
        <el-table-column align="center" label="退款订单数量" prop="refund_order_count"></el-table-column>
        <el-table-column align="center" label="商品销售数量" prop="goods_count"></el-table-column>
        <el-table-column align="center" label="净商品销售数量" prop="clear_goods_count">
        </el-table-column>
        <el-table-column align="center" label="退款商品数量" prop="refund_goods_count"></el-table-column>
        <el-table-column align="center" label="销售总金额" prop="money"></el-table-column>
        <el-table-column align="center" label="净销售总金额" prop="refund_money">
        </el-table-column>
        <el-table-column align="center" label="退款总金额" prop="refund_money"></el-table-column>
      </el-table>
    </div>

  </div>
</template>
<script>
  export default {
    name: "JiaoyiReport",
    created() {
      this.loadData();
    },
    methods: {
      async loadData() {
        let search = this.search;
        let result = await this.$axios.get("/admin/report/jiaoyi", {
          params: search
        });
        if(result.data.status != 0) return;
        this.tableData = result.data.data;
      }
    },
    data() {
      return {
        search: {},
        tableData: []
      };
    }
  };
</script>


<style scoped>
  #img_upload {
    position: fixed;
    width: 200px;
    height: 200px;
    display: none;
  }
  .el-header {
    background-color: #b3c0d1;
    color: #333;
    line-height: 60px;
  }

  .el-aside {
    color: #333;
  }
  .added-input {
    width: 80%;
  }
  .el-form-item {
    text-align: left;
  }
</style>

