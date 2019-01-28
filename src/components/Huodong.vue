<template>
  <div id="huodong">
    <div class="search-box">
      <div class="search-condition">
        <el-row :gutter="25">
          <el-col :span="6">
            <div class="search-main">
              <span class="search-text">活动名称</span>
              <el-input class="search-input" v-model="search.name" placeholder="按活动名称搜索"></el-input>
            </div>
          </el-col>

          <el-col :span="6">
            <div class="search-main">
              <span class="search-text">活动标签</span>
              <el-input v-model="search.tag" class="search-input" placeholder="按活动标签搜索"></el-input>
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
        <el-button cricle type="primary" @click="get_huodongs()">查询</el-button>
        <el-button cricle type="primary" @click="add_line">新增活动</el-button>
      </div>
    </div>
    <div class="search-table">
      <el-table :data="tableData" stripe align="center">
        <el-table-column label="活动名称" align="center" prop="name">
        </el-table-column>

        <el-table-column label="活动标签" align="center" prop="tag">
        </el-table-column>
        <el-table-column label="创建日期" align="center" prop="created_at">
        </el-table-column>
        <el-table-column label="有效期" align="center">
          <template slot-scope="scope">
            {{scope.row.start}} 至 {{scope.row.end}}
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" align="center">
          <template slot-scope="scope">
            <el-button @click.native.prevent="edit_huodong(scope.$index, tableData)" type="text" size="small">编辑</el-button>
            <el-button @click.native.prevent="delete_huodong(scope.$index, tableData)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination @current-change="handleCurrentChange" :current-page.sync="search.page" :page-size="search.size" layout="prev, pager, next, jumper" :page-count="total_page">
      </el-pagination>
    </div>
    <el-dialog title="编辑活动" :visible.sync="dialogShow" width="35%">
      <el-form label-width="120px">
        <el-form-item label="活动名称:">
          <el-input class="added-input" v-model="added.name"></el-input>
        </el-form-item>
        <el-form-item label="活动标签:">
          <el-input class="added-input" v-model="added.tag"></el-input>
        </el-form-item>
        <el-form-item label="有效期:">
          <el-date-picker format="yyyy年MM月dd日" value-format="yyyy-MM-dd" v-model="added.start" type="date" placeholder="选择日期">
          </el-date-picker>
          <span>至</span>
          <el-date-picker format="yyyy年MM月dd日" value-format="yyyy-MM-dd" v-model="added.end" type="date" placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="涉及商品:">
          <el-select class="added-input" v-model="added.goods" multiple>
            <el-option-group v-for="group in group_goods" :label="group.series_name" :key="group.series_id">
              <el-option v-for="item in group.goods" :label="item.title" :key="item.goods_id" :value="item.goods_id"></el-option>
            </el-option-group>
          </el-select>
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
    this.get_huodongs();
  },
  methods: {
    async load_group_goods() {
      let result = await this.$axios.get("/admin/group_goods/");
      if (result.data.status != 0) return;
      this.group_goods = result.data.data;
    },
    async handleCurrentChange(val) {
      this.search.page = val;
      this.get_huodongs();
    },
    async sureAdd() {
      let huodongId = this.added.id;
      let huodong = this.added;
      if (this.added.id) {
        let result = await this.$axios.post(
          `/admin/activity/${huodongId}`,
          huodong
        );
        if (result.data.status != 0) return;
        this.added = { goods: "" };
        this.$message("修改成功");
        this.dialogShow = false;
        this.get_huodongs();
      } else {
        let result = await this.$axios.post("/admin/activity", huodong);
        if (result.data.status != 0) return;
        this.added = { goods: "" };
        this.$message("新增成功");
        this.dialogShow = false;
        this.get_huodongs();
      }
    },
    handleChange(value) {},
    noAdd() {
      this.dialogShow = false;
      this.added = { good: "" };
    },
    async edit_huodong(index, row) {
      let huodong = row[index];
      let huodong_id = huodong.id;
      this.added = JSON.parse(JSON.stringify(huodong));
      this.dialogShow = true;
    },
    add_line() {
      this.added = { goods: [] };
      this.dialogShow = true;
    },
    async delete_huodong(index, rows) {
      let confirmed = await this.$confirm("确定要删除吗？", "请确认", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      });
      if (confirmed != "confirm") {
        return;
      }
      let huodong_id = rows[index].id;
      if (huodong_id) {
        let resp = await this.$axios.delete(`/admin/activity/${huodong_id}/`);
        rows.splice(index, 1);
      } else {
        rows.splice(index, 1);
      }
      this.$message("删除成功");
    },
    async get_huodongs() {
      let params = this.search;
      let resp = await this.$axios.get("/admin/activity/", { params: params });
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
<style scoped lang='less'>
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
