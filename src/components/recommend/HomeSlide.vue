<template>
  <div id="home_slide">
    <div class="search-box search-tab">
      <div class="search-condition">
        <el-row :gutter="25">
          <el-col :span="6">
            <div class="search-main">
              <span class="search-text">条幅名称</span>
              <el-input placeholder="按条幅名称搜索" class="search-input" v-model="search.name"></el-input>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="search-main">
              <span class="search-text">条幅类型</span>
              <el-select class="search-input" v-model="search.type">
                <el-option label="全部" value=""></el-option>
                <el-option label="文章" :value="1"></el-option>
                <el-option label="产品" :value="2"></el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="search-main">
              <span class="search-text">条幅内容</span>
              <el-input placeholder="按条幅内容搜索" class="search-input" v-model="search.content"></el-input>
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
        <el-button cricle type="primary" @click="get_home_slides()">查询</el-button>
        <el-button cricle type="primary" @click="add_line">新增首页条幅</el-button>
      </div>
    </div>
    <div class="search-table search-tab">
      <el-table :data="tableData" stripe align="center">
        <el-table-column label="条幅名称" align="center" prop="name">
        </el-table-column>

        <el-table-column label="条幅类型" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.type == 1">文章</span>
            <span v-else>产品</span>
          </template>
        </el-table-column>
        <el-table-column label="条幅内容" align="center" prop="content.name">
        </el-table-column>
        <el-table-column label="条幅封面" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.image" alt="">
          </template>
        </el-table-column>
        <el-table-column label="创建日期" align="center" prop="created_at"></el-table-column>
        <el-table-column label="操作" fixed="right" align="center">
          <template slot-scope="scope">
            <el-button v-if="scope.row.active" @click.native.prevent="inactive_home_slide(scope.$index, tableData)" type="text" size="small">当前启用</el-button>
            <el-button v-else @click.native.prevent="active_home_slide(scope.$index, tableData)" type="text" size="small">当前禁用</el-button>
            <el-button @click.native.prevent="edit_home_slide(scope.$index, tableData)" type="text" size="small">编辑</el-button>
            <el-button @click.native.prevent="delete_home_slide(scope.$index, tableData)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination @current-change="handleCurrentChange" :current-page.sync="search.page" :page-size="search.size" layout="prev, pager, next, jumper" :page-count="total_page">
      </el-pagination>
    </div>
    <el-dialog title="编辑首页条幅" :visible.sync="dialogShow" width="30%">
      <el-form label-width="120px">
        <el-form-item label="条幅名称:">
          <el-input class="added-input" v-model="added.name"></el-input>
        </el-form-item>
        <el-form-item label="条幅类型:">
          <el-select class="added-input" v-model="added.type" @change="typeChange">
            <el-option v-for="item in [{label:'文章',key:1},{label:'产品',key:2}]" :key="item.key" :value="item.key" :label="item.label"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="条幅内容:" v-show="added.type == 1">
          <el-select class="added-input" v-model="added.content_id">
            <el-option v-for="item in articles" :label="item.title" :key="item.id" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="条幅内容:" v-show="added.type == 2">
          <el-select class="added-input" v-model="added.content_id">
            <el-option-group v-for="group in group_goods" :label="group.series_name" :key="group.series_id">
              <el-option v-for="item in group.goods" :label="item.title" :key="item.goods_id" :value="item.goods_id"></el-option>
            </el-option-group>
          </el-select>
        </el-form-item>

        <el-form-item label="条幅封面:">
          <el-upload drag :action="upload_url" :on-success="handleUploadSuccess">
            <div class="el-upload__text">将文件拖到此处，或
              <em>点击上传</em>
            </div>
            <img style="width:280px; height:auto;" :src="added.image" alt="">
          </el-upload>
        </el-form-item>
      </el-form>
      <el-button @click="sureAdd()">确定</el-button>
      <el-button @click="noAdd()">取消</el-button>
    </el-dialog>

  </div>
</template>

<script>
import Vue from "vue";
import { UPLOAD_IMG_URL } from "../../global.js";

const QS = require("qs");
const added_init = { type: 1, content_id: "" };

export default {
  name: "HomeBanner",
  data() {
    return {
      upload_url: UPLOAD_IMG_URL,
      articles: [],
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
    this.get_articles();
    this.load_group_goods();
    this.get_home_slides();
  },
  methods: {
    async active_home_slide(index, rows) {
      let bid = rows[index].id;
      let result = await this.$axios.post(`/admin/home_slide/${bid}`, {
        active: true
      });
      if (result.data.status != 0) return;
      Vue.set(rows[index], "active", true);
      this.$message("修改成功");
    },
    async inactive_home_slide(index, rows) {
      let bid = rows[index].id;
      let result = await this.$axios.post(`/admin/home_slide/${bid}`, {
        active: false
      });
      if (result.data.status != 0) return;
      Vue.set(rows[index], "active", false);
      this.$message("修改成功");
    },
    handleUploadSuccess(response, file, fileList) {
      let image = response.data.url;
      if (image) {
        Vue.set(this.added, "image", image);
      }
    },
    typeChange(value) {
      this.added.content_id = "";
    },
    async load_group_goods() {
      let result = await this.$axios.get("/admin/group_goods/");
      if (result.data.status != 0) return;
      this.group_goods = result.data.data;
    },
    async handleCurrentChange(val) {
      this.search.page = val;
      this.get_home_slides();
    },
    async sureAdd() {
      let home_slideId = this.added.id;
      let home_slide = this.added;
      if (this.added.id) {
        let result = await this.$axios.post(
          `/admin/home_slide/${home_slideId}`,
          home_slide
        );
        if (result.data.status != 0) return;
        this.added = JSON.parse(JSON.stringify(added_init));
        this.$message("修改成功");
        this.dialogShow = false;
        this.get_home_slides();
      } else {
        let result = await this.$axios.post("/admin/home_slide", home_slide);
        if (result.data.status != 0) return;
        this.added = JSON.parse(JSON.stringify(added_init));
        this.$message("新增成功");
        this.dialogShow = false;
        this.get_home_slides();
      }
    },
    handleChange(value) {},
    noAdd() {
      this.dialogShow = false;
      this.added = JSON.parse(JSON.stringify(added_init));
    },
    async edit_home_slide(index, row) {
      let home_slide = row[index];
      let home_slide_id = home_slide.id;
      this.added = JSON.parse(JSON.stringify(home_slide));
      Vue.set(this.added, "content_id", this.added.content.id);
      this.dialogShow = true;
    },
    add_line() {
      this.added = JSON.parse(JSON.stringify(added_init));
      this.dialogShow = true;
    },
    async delete_home_slide(index, rows) {
      let confirmed = await this.$confirm("确定要删除吗？", "请确认", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      });
      if (confirmed != "confirm") {
        return;
      }
      let home_slide_id = rows[index].id;
      if (home_slide_id) {
        let resp = await this.$axios.delete(
          `/admin/home_slide/${home_slide_id}/`
        );
        rows.splice(index, 1);
      } else {
        rows.splice(index, 1);
      }
      this.$message("删除成功");
    },
    async get_home_slides() {
      let params = this.search;
      let resp = await this.$axios.get("/admin/home_slide/", {
        params: params
      });
      let respData = resp.data;
      if (respData.status != 0) return;
      this.tableData = respData.data.list;
      this.total_page = respData.data.total_page;
      this.count = respData.data.count;
    },
    async get_articles() {
      let resp = await this.$axios.get("/admin/article_names/");
      let respData = resp.data;
      if (respData.status != 0) return;
      this.articles = respData.data;
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
