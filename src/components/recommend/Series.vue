<template>
  <div id="series">
    <div class="search-box search-tab">
      <div class="search-condition">
        <el-row :gutter="25">
          <el-col :span="6">
            <div class="search-main">
              <span class="search-text">推荐套系</span>
              <el-select class="search-input" v-model="search.series_id">
                <el-option value="" label="全部"></el-option>
                <el-option v-for="item in series" :key="item.id" :value="item.id" :label="item.name"></el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="search-main">
              <span class="search-text">推荐位</span>
              <el-select class="search-input" v-model="search.sort_id">
                <el-option value="" label="全部"></el-option>
                <el-option :value="1" label="栏位1"></el-option>
                <el-option :value="2" label="栏位2"></el-option>
                <el-option :value="3" label="栏位3"></el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="search-main">
              <span class="search-text">所属套系</span>
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
        <el-button cricle type="primary" @click="load_series_recommend()">查询</el-button>
        <el-button cricle type="primary" @click="add_line">新增套系推荐</el-button>
      </div>
    </div>
    <div class="search-table search-tab">
      <el-table :data="tableData" stripe align="center">
        <el-table-column label="所属套系" align="center" prop="series_name">
        </el-table-column>

        <el-table-column label="推荐位" align="center">
          <template slot-scope="scope">
            <span v-show="scope.row.sort_id == 1">栏位1</span>
            <span v-show="scope.row.sort_id == 2">栏位2</span>
            <span v-show="scope.row.sort_id == 3">栏位3</span>
          </template>
        </el-table-column>
        <el-table-column label="推荐内容" align="center" prop="content.name">
        </el-table-column>
        <el-table-column label="套系封面" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.image" alt="">
          </template>
        </el-table-column>
        <el-table-column label="创建日期" align="center" prop="created_at"></el-table-column>
        <el-table-column label="操作" fixed="right" align="center">
          <template slot-scope="scope">
            <el-button v-if="scope.row.active" @click.native.prevent="inactive_series_recommend(scope.$index, tableData)" type="text" size="small">当前启用</el-button>
            <el-button v-else @click.native.prevent="active_series_recommend(scope.$index, tableData)" type="text" size="small">当前禁用</el-button>
            <el-button @click.native.prevent="edit_series_recommend(scope.$index, tableData)" type="text" size="small">编辑</el-button>
            <el-button @click.native.prevent="delete_series_recommend(scope.$index, tableData)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination @current-change="handleCurrentChange" :current-page.sync="search.page" :page-size="search.size" layout="prev, pager, next, jumper" :page-count="total_page">
      </el-pagination>
    </div>
    <el-dialog title="编辑套系推荐" :visible.sync="dialogShow" width="30%">
      <el-form label-width="120px">
        <el-form-item label="所属套系:">
          <el-select class="added-input" v-model="added.series_id">
            <el-option v-for="item in series" :key="item.id" :value="item.id" :label="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="推荐位:">
          <el-select class="added-input" v-model="added.sort_id">
            <el-option :value="1" label="栏位1"></el-option>
            <el-option :value="2" label="栏位2"></el-option>
            <el-option :value="3" label="栏位3"></el-option>
          </el-select>
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
        <el-form-item label="推荐封面:">
          <el-upload drag :action="upload_url" :on-success="handleUploadSuccess">
            <div class="el-upload__text">将文件拖到此处，或
              <em>点击上传</em>
            </div>
            <img style="width:150px;height:auto;" :src="added.image" alt="">
          </el-upload>
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
      series: [],
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
    this.load_series();
    this.load_group_goods();
    this.load_series_recommend();
  },
  methods: {
    async load_series() {
      let result = await this.$axios.get("/admin/series");
      if (result.data.status == 0) {
        this.series = result.data.data;
      }
    },
    async active_series_recommend(index, rows) {
      let bid = rows[index].id;
      let result = await this.$axios.post(`/admin/series_recommend/${bid}`, {
        active: true
      });
      if (result.data.status != 0) return;
      Vue.set(rows[index], "active", true);
      this.$message("修改成功");
    },
    async inactive_series_recommend(index, rows) {
      let bid = rows[index].id;
      let result = await this.$axios.post(`/admin/series_recommend/${bid}`, {
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
    async typeChange(value) {
      this.added.goods_id = "";
    },
    async load_group_goods() {
      let result = await this.$axios.get("/admin/group_goods/");
      if (result.data.status != 0) return;
      this.group_goods = result.data.data;
    },
    async handleCurrentChange(val) {
      this.search.page = val;
      this.load_series_recommend();
    },
    async sureAdd() {
      let series_recommendId = this.added.id;
      let series_recommend = this.added;
      if (this.added.id) {
        let result = await this.$axios.post(
          `/admin/series_recommend/${series_recommendId}`,
          series_recommend
        );
        if (result.data.status != 0) return;
        this.added = {};
        this.$message("修改成功");
        this.dialogShow = false;
        this.load_series_recommends();
      } else {
        let result = await this.$axios.post(
          "/admin/series_recommend",
          series_recommend
        );
        if (result.data.status != 0) return;
        this.added = {};
        this.$message("新增成功");
        this.dialogShow = false;
        this.load_series_recommends();
      }
    },
    handleChange(value) {},
    noAdd() {
      this.dialogShow = false;
      this.added = {};
    },
    async edit_series_recommend(index, row) {
      let series_recommend = row[index];
      let series_recommend_id = series_recommend.id;
      this.added = JSON.parse(JSON.stringify(series_recommend));
      this.added.goods_id = this.added.content.id;
      this.dialogShow = true;
    },
    add_line() {
      this.added = {};
      this.dialogShow = true;
    },
    async delete_series_recommend(index, rows) {
      let confirmed = await this.$confirm("确定要删除吗？", "请确认", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      });
      if (confirmed != "confirm") {
        return;
      }
      let series_recommend_id = rows[index].id;
      if (series_recommend_id) {
        let resp = await this.$axios.delete(
          `/admin/series_recommend/${series_recommend_id}/`
        );
        rows.splice(index, 1);
      } else {
        rows.splice(index, 1);
      }
      this.$message("删除成功");
    },
    async load_series_recommend() {
      let params = this.search;
      let resp = await this.$axios.get("/admin/series_recommend/", {
        params: params
      });
      let respData = resp.data;
      if (respData.status != 0) return;
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
