<template>
  <div id="tag">
    <div style="display: block; float: left;">
      <span>活动列表</span>
      <el-button cricle type="primary" @click="add_line">新增</el-button>
    </div>
    <br> <br>
    <el-table :data="tableData" border>
      <el-table-column label="名称">
        <template slot-scope="scope">
          <el-input v-model="scope.row.name"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="选择商品">
        <template slot-scope="scope">
          <el-select v-model="scope.row.series" placeholder="请选择">
            <el-option
              v-for="item in series"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100px" align="center">
        <template slot-scope="scope">
          <el-button @click.native.prevent="save_tag(scope.$index, tableData)" type="text" size="small">保存</el-button>
          <el-button @click.native.prevent="delete_tag(scope.$index, tableData)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import router from "../router/index.js";
import Vue from "vue";
const QS = require("qs");

export default {
  data() {
    return {
      tableData: [],
      series: []
    };
  },
  created() {
    // this.get_goods();
    this.load_series();
  },
  mounted() {
    this.get_tags();
  },
  methods: {
     async load_series() {
      let result = await this.$axios.get("/admin/series");
      if (result.data.status == 0) {
        this.series = result.data.data;
      }
    },
    async get_goods() {
      let result = await this.$axios.get("/admin/goods_name");
      if (result.data.status == 0) {
        this.goods = result.data.data;
      }
    },
    async save_tag(index, row) {
      let confirmed = await this.$confirm("确定数据正确吗？", "请确认", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      });
      if (confirmed != "confirm") {
        return;
      }
      let tag = row[index];
      let tag_id = tag.id;
      if (tag_id) {
        let result = await this.$axios.post(`/admin/tag/${tag_id}/`, tag);
        if (result.data.code == 0) {
          this.$message("修改成功");
        }
      } else {
        // 新增
        let result = await this.$axios.post("/admin/tag/", tag);
        if (result.data.status == 0) {
          let tag_id = result.data.data.id;
          this.$message("新增成功");
          Vue.set(row[index], "id", tag_id);
        }
      }
    },
    add_line() {
      this.tableData.unshift({});
    },
    async delete_tag(index, rows) {
      let confirmed = await this.$confirm("确定要删除吗？", "请确认", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      });
      if (confirmed != "confirm") {
        return;
      }
      let tag_id = rows[index].id;
      if (tag_id) {
        let resp = await this.$axios.delete(`/admin/tag/${tag_id}/`);
        rows.splice(index, 1);
      } else {
        rows.splice(index, 1);
      }
      this.$message("删除成功");
    },
    async get_tags() {
      let resp = await this.$axios.get("/admin/tag/?page=1&offset=10");
      let respData = resp.data;
      if (respData.status != 0) return;
      this.tableData = respData.data;
      // this.total = respData.data.total;
      // this.page = respData.data.page;
      // this.size = respData.data.size;
    }
    //当前页码改变时触发
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
</style>
