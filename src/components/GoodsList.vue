<template>
  <div id="goodslist">
    <div class="search-box">
      <div class="search-condition">

        <el-row :gutter="25">
          <el-col :span="6">
            <div class="search-main">
              <span class="search-text">名称</span>
              <el-input placeholder="按名称搜索" class="search-input" v-model="search.title"></el-input>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="search-main">
              <span class="search-text">商品货号</span>
              <el-input placeholder="按商品货号搜索" class="search-input" v-model="search.merchant_code"></el-input>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="search-main">
              <span class="search-text">款式</span>
              <el-select class="search-input" v-model="search.kuanshi_id">
                <el-option value="" label="全部"></el-option>
                <el-option v-for="item in kuanshiList" :value="item.id" :label="item.name" :key="item.id"></el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="search-main">
              <span class="search-text">状态</span>
              <el-select class="search-input" v-model=" search.active">
                <el-option label="全部" value=""></el-option>
                <el-option label="上架" :value="true"></el-option>
                <el-option label="下架" :value="false"></el-option>
              </el-select>
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
        <el-button cricle type="primary" @click="getGoodsList()">查询</el-button>
        <el-button cricle type="primary" @click="to_address( '/add/goods')">
          新增商品
        </el-button>
      </div>
    </div>
    <div class="search-table">
      <el-table :data="tableData" stripe style="width:100%;" align="center">
        <el-table-column align="center" label="封面图">
          <template slot-scope="scope">
              <img :src="scope.row.cover_img" style="width:100px; height:100px;" alt="">
          </template>
        </el-table-column>
        <el-table-column align="center" prop="title" label="名称"></el-table-column>
        <el-table-column align="center" label="套系">
          <template slot-scope="scope">
            <span v-for="item in seriesList" :key="item.id" v-if="item.id == scope.row.series"> {{item.name}} </span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="kuanshi_name" label="款式"></el-table-column>
        <el-table-column align="center" prop="merchant_code" label="商品货号"></el-table-column>
        <el-table-column align="center" label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.active">上架</span>
            <span v-else>下架</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button @click.native.prevent="to_goods(scope.$index, tableData)" type="text" size="small">编辑商品</el-button>
            <el-button @click.native.prevent="delete_goods(scope.$index, tableData)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination @current-change="handleCurrentChange" :current-page.sync="search.page" :page-size="search.size" layout="prev, pager, next, jumper" :page-count="total_page">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import router from "../router/index.js";

export default {
  name: "goodslist",
  created() {
    this.getGoodsList();
    this.load_kuanshi();
    this.load_series();
  },
  methods: {
    async handleCurrentChange(val) {
      this.search.page = val;
      this.getGoodsList();
    },
    async load_kuanshi() {
      let result = await this.$axios.get(`/admin/kuanshi`);
      if (result.data.status != 0) return;
      this.kuanshiList = result.data.data;
    },
    to_address(link) {
      router.push(link);
    },
    async delete_goods(index, rows) {
      let confirmed = await this.$confirm("确定要删除吗?", "注意", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      });
      let resp = await this.$axios.delete(`/admin/goods/${rows[index].id}`);
      if (resp.data.status != 0) {
        return;
      }
      rows.splice(index, 1);
    },
    to_sku(index, rows) {
      let data = { name: "sku", params: { goods_id: rows[index].id } };
      router.push(data);
    },
    to_goods(index, rows) {
      let data = { name: "goods_detail", params: { goods_id: rows[index].id } };
      router.push(data);
    },
    async load_series() {
      let resp = await this.$axios.get("/admin/series");
      let respData = resp.data;
      if (respData.status == 0) {
        this.seriesList = respData.data;
      }
    },
    async getGoodsList() {
      let resp2 = await this.$axios.get("/admin/goods", {
        params: this.search
      });
      let respData = resp2.data;
      if (respData.status == 0) {
        this.tableData = respData.data.list;
        this.total_page = respData.data.total_page;
        this.count = respData.data.count;
      }
    }
  },
  data() {
    return {
      search: { page: 1 },
      tableData: [],
      seriesList: [],
      kuanshiList: [],
      total_page: 0,
      count: 0
    };
  }
};
</script>

<!-- Add"scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
</style>
