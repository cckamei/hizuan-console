<template>
  <div id="coupon">
    <div class="search-box">
      <div class="search-condition">
        <el-row :gutter="25">
          <el-col :span="6">
            <div class="search-main">
              <span class="search-text">优惠券名称</span>
              <el-input class="search-input" v-model="search.name" placeholder="按优惠券名称搜索"></el-input>
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
        <el-button cricle type="primary" @click="get_coupons()">查询</el-button>
        <el-button cricle type="primary" @click="add_line">新增优惠券</el-button>
      </div>
    </div>
    <div class="search-table">
      <el-table :data="tableData" stripe align="center">
        <el-table-column label="优惠券名称" align="center" prop="name">
        </el-table-column>

        <el-table-column label="金额" align="center">
          <template slot-scope="scope">
            满{{scope.row.all_money}}减{{scope.row.discount_money}}
          </template>
        </el-table-column>
        <el-table-column label="创建日期" align="center" prop="created_at">
        </el-table-column>
        <el-table-column label="有效期" align="center">
          <template slot-scope="scope">
            {{scope.row.start}} 至 {{scope.row.end}}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button @click.native.prevent="edit_coupon(scope.$index, tableData)" type="text" size="small">编辑</el-button>
            <el-button @click.native.prevent="delete_coupon(scope.$index, tableData)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination @current-change="handleCurrentChange" :current-page.sync="search.page" :page-size="search.size" layout="prev, pager, next, jumper" :page-count="total_page">
      </el-pagination>
    </div>
    <el-dialog title="编辑优惠券" :visible.sync="dialogShow" width="35%">
      <el-form label-width="120px">
        <el-form-item label="优惠券名称:">
          <el-input class="added-input" v-model="added.name"></el-input>
        </el-form-item>
        <el-form-item label="活动每满">
          <el-input-number :step="100" class="added-input" v-model="added.all_money"></el-input-number>
        </el-form-item>
        <el-form-item label="减">
          <el-input-number :step="10" class="added-input" v-model="added.discount_money"></el-input-number>
        </el-form-item>
        <el-form-item label="有效期:">
          <el-date-picker format="yyyy年MM月dd日" value-format="yyyy-MM-dd" v-model="added.start" type="date" placeholder="选择日期" class="added-input">
          </el-date-picker>
          <span style="margin: 0 8px">至</span>
          <el-date-picker format="yyyy年MM月dd日" value-format="yyyy-MM-dd" v-model="added.end" type="date" placeholder="选择日期" class="added-input">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <el-button cricle type="primary" @click="sureAdd()">确定</el-button>
      <el-button cricle @click="noAdd()">取消</el-button>
    </el-dialog>

  </div>
</template>

<script>
  import router from "../router/index.js";
  import Vue from "vue";

  const QS = require("qs");

  export default {
    data() {
      return {
        group_goods: [],
        dialogShow: false,
        search: {
          page: 1,
          size: 15
        },
        added: {},
        tableData: [],
        count: 0,
        total_page: 0
      };
    },
    created() {
      // this.search = this.$route.query;
    },
    mounted() {
      this.load_group_goods();
      this.get_coupons();
    },
    methods: {
      async load_group_goods() {
        let result = await this.$axios.get("/admin/group_goods/");
        if(result.data.status != 0) return;
        this.group_goods = result.data.data;
      },
      async handleCurrentChange(val) {
        this.search.page = val;
        this.get_coupons();
      },
      async sureAdd() {
        let couponId = this.added.id;
        let coupon = this.added;
        if(this.added.id) {
          let result = await this.$axios.post(
            `/admin/coupon/${couponId}`,
            coupon
          );
          if(result.data.status != 0) return;
          this.added = {};
          this.$message("修改成功");
          this.dialogShow = false;
          this.get_coupons();
        } else {
          let result = await this.$axios.post("/admin/coupon", coupon);
          if(result.data.status != 0) return;
          this.added = {};
          this.$message("新增成功");
          this.dialogShow = false;
          this.get_coupons();
        }
      },
      handleChange(value) { },
      noAdd() {
        this.dialogShow = false;
        this.added = {};
      },
      async edit_coupon(index, row) {
        let coupon = row[index];
        let coupon_id = coupon.id;
        this.added = JSON.parse(JSON.stringify(coupon));
        this.dialogShow = true;
      },
      add_line() {
        this.added = {};
        this.dialogShow = true;
      },
      async delete_coupon(index, rows) {
        let confirmed = await this.$confirm("确定要删除吗？", "请确认", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        });
        if(confirmed != "confirm") {
          return;
        }
        let coupon_id = rows[index].id;
        if(coupon_id) {
          let resp = await this.$axios.delete(`/admin/coupon/${coupon_id}/`);
          rows.splice(index, 1);
        } else {
          rows.splice(index, 1);
        }
        this.$message("删除成功");
      },
      async get_coupons() {
        let params = this.search;
        let resp = await this.$axios.get("/admin/coupon/", { params: params });
        let respData = resp.data;
        if(respData.status != 0) return;
        this.tableData = respData.data.list;
        this.total_page = respData.data.total_page;
        this.count = respData.data.count;
      }
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
    width: 40%;
  }
  .el-form-item {
    text-align: left;
  }
</style>
