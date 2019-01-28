<template>
  <div id="article">
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
        <el-button cricle type="primary" @click="get_articles()">查询</el-button>
        <el-button cricle type="primary" @click="add_line">新增文章</el-button>
      </div>
    </div>
    <div class="search-table">
      <el-table :data="tableData" stripe align="center">
        <el-table-column label="文章标题" align="center" prop="title">
        </el-table-column>

        <el-table-column label="文章链接" align="center" prop="url">
        </el-table-column>
        <el-table-column label="创建日期" align="center" prop="created_at">
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button @click.native.prevent="edit_article(scope.$index, tableData)" type="text" size="small">编辑</el-button>
            <el-button @click.native.prevent="delete_article(scope.$index, tableData)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination @current-change="handleCurrentChange" :current-page.sync="search.page" :page-size="search.size" layout="prev, pager, next, jumper" :page-count="total_page">
      </el-pagination>
    </div>
    <el-dialog title="编辑文章" :visible.sync="dialogShow" width="30%">
      <el-form label-width="120px">
        <el-form-item label="文章标题:">
          <el-input class="added-input" v-model="added.title"></el-input>
        </el-form-item>
        <el-form-item label="文章链接:">
          <el-input class="added-input" v-model="added.url"></el-input>
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
  import { regionData, CodeToText, TextToCode } from "element-china-area-data";

  const QS = require("qs");

  export default {
    data() {
      return {
        regionData: regionData,
        big_areas: [],
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
      this.get_articles();
    },
    methods: {
      async handleCurrentChange(val) {
        this.search.page = val;
        this.get_articles();
      },
      async sureAdd() {
        let articleId = this.added.id;
        let article = this.added;
        if(this.added.id) {
          let result = await this.$axios.post(
            `/admin/article/${articleId}`,
            article
          );
          if(result.data.status != 0) return;
          this.added = {};
          this.$message("修改成功");
          this.dialogShow = false;
          this.get_articles();
        } else {
          let result = await this.$axios.post("/admin/article", article);
          if(result.data.status != 0) return;
          this.added = {};
          this.$message("新增成功");
          this.dialogShow = false;
          this.get_articles();
        }
      },
      handleChange(value) { },
      noAdd() {
        this.dialogShow = false;
        this.added = {};
      },
      async edit_article(index, row) {
        let article = row[index];
        let article_id = article.id;
        this.added = JSON.parse(JSON.stringify(article));
        this.dialogShow = true;
      },
      add_line() {
        this.added = {};
        this.dialogShow = true;
      },
      async delete_article(index, rows) {
        let confirmed = await this.$confirm("确定要删除吗？", "请确认", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        });
        if(confirmed != "confirm") {
          return;
        }
        let article_id = rows[index].id;
        if(article_id) {
          let resp = await this.$axios.delete(`/admin/article/${article_id}/`);
          rows.splice(index, 1);
        } else {
          rows.splice(index, 1);
        }
        this.$message("删除成功");
      },
      async get_articles() {
        let params = this.search;
        let resp = await this.$axios.get("/admin/article/", { params: params });
        let respData = resp.data;
        if(respData.status != 0) return;
        this.tableData = respData.data.list;
        this.total_page = respData.data.total_page;
        this.count = respData.data.count;
      }
    }
  };
</script>

<!-- Add"scoped" attribute to limit CSS to this component only -->
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
  .el-form-item {
    text-align: left;
  }

  .added-input {
    width: 80%;
  }
</style>
