<template>
  <div id="report_ticheng">
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
        </el-row>
      </div>
      <div class="search-btn"></div>
    </div>
    <div class="search-table">
      <el-table :data="tableData" stripe align="center">
        <el-table-column align="center" label="商品货号" prop="_id"></el-table-column>
        <el-table-column align="center" label="商品图片">
          <template slot-scope="scope">
            <el-button @click="showImg(scope.row)" type="text">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" label="提成订单数量" prop="order_count"></el-table-column>
        <el-table-column align="center" label="提成商品数量" prop="goods_count"></el-table-column>
        <el-table-column align="center" label="提成金额" prop="money"></el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="kuanxiao(scope.row)">款销分析</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog :visible.sync=imgShow>
      <img :src="added.img" alt="">
    </el-dialog>

  </div>
</template>

<script>
  import router from "../../router/index.js";

  export default {
    name: "TichengReport",
    created() {
      this.loadData();
    },
    methods: {
      showImg(row) {
        this.added = { img: row.image };
        this.imgShow = true;
      },
      kuanxiao(row) {
        this.$router.push({
          name: "report_ticheng_kuanxiao",
          params: { merchant_code: row._id }
        });
      },
      async loadData() {
        let search = this.search;
        let result = await this.$axios.get("/admin/report/ticheng", {
          params: search
        });
        if(result.data.status != 0) return;
        this.tableData = result.data.data;
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


