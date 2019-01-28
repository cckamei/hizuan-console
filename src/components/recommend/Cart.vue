<template>
  <div id="cart">
    <div class="search-box search-tab">
      <div class="search-condition">
        <el-row :gutter="25">
          <el-col :span="6">
            <div class="search-main">
              <span class="search-text">推荐编号</span>
              <el-input placeholder="按推荐编号搜索" class="search-input" v-model="search.sort_id"></el-input>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="search-main">
              <span class="search-text">推荐内容</span>
              <el-input placeholder="按推荐内容搜索" class="search-input" v-model="search.content"></el-input>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="search-main">
              <span class="search-text">状态</span>
              <el-select class="search-input" v-model="search.active">
                <el-option label="全部" value=""></el-option>
                <el-option label="启用" :value="true"></el-option>
                <el-option label="禁用" :value="false"></el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="search-main" style="visibility: hidden">
              <span class="search-text">推荐内容</span>
              <el-input placeholder="按推荐内容搜索" class="search-input" v-model="search.content"></el-input>
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
        <el-button cricle type="primary" @click="load_cart_recommend()">查询</el-button>
        <el-button cricle type="primary" @click="add_line">新增购物车推荐</el-button>
      </div>
    </div>
    <div class="search-table search-tab">
      <el-table :data="tableData" stripe align="center">
        <el-table-column label="推荐编号" align="center" prop="sort_id">
        </el-table-column>

        <el-table-column label="推荐内容" align="center" prop="content.name">
        </el-table-column>
        <el-table-column label="创建日期" align="center" prop="created_at"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button v-if="scope.row.active" @click.native.prevent="inactive_cart_recommend(scope.$index, tableData)" type="text" size="small">当前启用</el-button>
            <el-button v-else @click.native.prevent="active_cart_recommend(scope.$index, tableData)" type="text" size="small">当前禁用</el-button>
            <el-button @click.native.prevent="edit_cart_recommend(scope.$index, tableData)" type="text" size="small">编辑</el-button>
            <el-button @click.native.prevent="delete_cart_recommend(scope.$index, tableData)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination @current-change="handleCurrentChange" :current-page.sync="search.page" :page-size="search.size" layout="prev, pager, next, jumper" :page-count="total_page">
      </el-pagination>
    </div>
    <el-dialog title="编辑套系推荐" :visible.sync="dialogShow" width="25%">
      <el-form label-width="120px">
        <el-form-item label="推荐编号:">
          <el-input-number class="added-input" v-model="added.sort_id"></el-input-number>
        </el-form-item>
        <el-form-item label="推荐内容:">
          <template slot-scope="scope">
            <el-select class="added-input" v-model="added.goods_id">
              <el-option-group v-for="group in group_goods" :label="group.series_name" :key="group.series_id">
                <el-option v-for="item in group.goods" :label="item.title" :key="item.goods_id" :value="item.goods_id"></el-option>
              </el-option-group>
            </el-select>
          </template>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="sureAdd()">确定</el-button>
      <el-button @click="noAdd()">取消</el-button>
    </el-dialog>

  </div>
</template>

<script>
  import Vue from "vue";
  import { UPLOAD_IMG_URL } from "../../global.js";

  const QS = require("qs");

  export default {
    name: "HomeBanner",
    data() {
      return {
        group_goods: [],
        dialogShow: false,
        search: {},
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
      this.load_cart_recommend();
    },
    methods: {
      async active_cart_recommend(index, rows) {
        let bid = rows[index].id;
        let result = await this.$axios.post(`/admin/cart_recommend/${bid}`, {
          active: true
        });
        if(result.data.status != 0) return;
        Vue.set(rows[index], "active", true);
        this.$message("修改成功");
      },
      async inactive_cart_recommend(index, rows) {
        let bid = rows[index].id;
        let result = await this.$axios.post(`/admin/cart_recommend/${bid}`, {
          active: false
        });
        if(result.data.status != 0) return;
        Vue.set(rows[index], "active", false);
        this.$message("修改成功");
      },
      handleUploadSuccess(response, file, fileList) {
        let image = response.data.url;
        if(image) {
          Vue.set(this.added, "image", image);
        }
      },
      async load_group_goods() {
        let result = await this.$axios.get("/admin/group_goods/");
        if(result.data.status != 0) return;
        this.group_goods = result.data.data;
      },
      async handleCurrentChange(val) {
        this.search.page = val;
        this.get_cart_recommends();
      },
      async sureAdd() {
        let cart_recommendId = this.added.id;
        let cart_recommend = this.added;
        if(this.added.id) {
          let result = await this.$axios.post(
            `/admin/cart_recommend/${cart_recommendId}`,
            cart_recommend
          );
          if(result.data.status != 0) return;
          this.added = {};
          this.$message("修改成功");
          this.dialogShow = false;
          this.load_cart_recommend();
        } else {
          let result = await this.$axios.post(
            "/admin/cart_recommend",
            cart_recommend
          );
          if(result.data.status != 0) return;
          this.added = {};
          this.$message("新增成功");
          this.dialogShow = false;
          this.load_cart_recommend();
        }
      },
      noAdd() {
        this.dialogShow = false;
        this.added = {};
      },
      async edit_cart_recommend(index, row) {
        let cart_recommend = row[index];
        let cart_recommend_id = cart_recommend.id;
        this.added = JSON.parse(JSON.stringify(cart_recommend));
        this.added.goods_id = this.added.content.id;
        this.dialogShow = true;
      },
      add_line() {
        this.added = {};
        this.dialogShow = true;
      },
      async delete_cart_recommend(index, rows) {
        let confirmed = await this.$confirm("确定要删除吗？", "请确认", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        });
        if(confirmed != "confirm") {
          return;
        }
        let cart_recommend_id = rows[index].id;
        if(cart_recommend_id) {
          let resp = await this.$axios.delete(
            `/admin/cart_recommend/${cart_recommend_id}/`
          );
          rows.splice(index, 1);
        } else {
          rows.splice(index, 1);
        }
        this.$message("删除成功");
      },
      async load_cart_recommend() {
        let params = this.search;
        let resp = await this.$axios.get("/admin/cart_recommend/", {
          params: params
        });
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
    width: 80%;
  }
  .el-form-item {
    text-align: left;
  }
</style>
