<template>
  <div id="news">
    <div style="display: block; float: left">
      <span>资讯列表</span>
      <el-button cricle type="primary" @click="to_address('/add/news/')">
        新增
      </el-button>
    </div>
    <el-table :data="tableData" stripe style="width:100%;" align="center">
      <el-table-column prop="created_at" label="创建时间"></el-table-column>
      <el-table-column label="状态" width="150px" align="center">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.active" disabled>
          </el-switch>
          <el-button @click.native.prevent="switch_active(scope.$index, tableData)">
            修改
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="category" label="栏目"></el-table-column>
      <el-table-column prop="tag" label="标签"></el-table-column>
      <el-table-column prop="title" label="标题"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click.native.prevent="to_news(scope.$index, tableData)" type="text" size="small">修改</el-button>
          <el-button @click.native.prevent="delete_news(scope.$index, tableData)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-sizes="[10, 20, 30, 40]" :page-size="size" layout="sizes, total,  prev, pager, next, jumper" :total="total">
    </el-pagination>
  </div>
</template>

<script>
import router from "../router/index.js";
const QS = require("qs");

export default {
  data() {
    return {
      tableData: [],
      total: 10,
      page: 1,
      size: 10
    };
  },
  created() {
    this.get_news();
  },
  methods: {
    to_address(link) {
      router.push(link);
    },
    to_news(index, rows) {
      let data = { name: "news_detail", params: { news_id: rows[index].id } };
      router.push(data);
    },
    async switch_active(index, rows) {
      let result = await this.$confirm("你确定要修改状态吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      });
      if (result == "confirm") {
        let resp = await this.$axios.post(`/admin/news/${rows[index].id}`, {
          action: "switch_active",
          active: !rows[index].active
        });
        if (resp.data.code == 0) {
          rows[index].active = !rows[index].active;
        }
      }
    },
    async delete_news(index, rows) {
      let confirmed = await this.$confirm("确定要删除吗？", "风险操作", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      });
      if (confirmed != "confirm") {
        return;
      }
      let resp = await this.$axios.delete(`/admin/news/${rows[index].id}/`);
      if (resp.data.code != 0) {
        return;
      }
      rows.splice(index, 1);
    },
    async get_news() { 
      let resp = await this.$axios.get("/admin/news");
      let respData = resp.data;
      if (respData.code != 0) return;
      this.tableData = respData.data.list;
      this.total = respData.data.total;
      // this.page = respData.data.page;
      // this.size = respData.data.size;
    },
    //当前页码改变时触发
    async handleCurrentChange(val) {
      let param = 'p=' + val + '&offset=' + this.size;
      let resp = await this.$axios.get("/admin/news?" + param);
      // console.log(resp.data);
      let respData = resp.data;
      if (respData.code != 0) return;
      this.tableData = respData.data.list;
      this.total = respData.data.total;
    },
    //每页条数改变时触发
    async handleSizeChange(val) {
      this.size = val;
      let param = 'p=' + this.page + '&offset=' + val;
      let resp = await this.$axios.get("/admin/news?" + param);
      let respData = resp.data;
      if (respData.code != 0) return;
      this.tableData = respData.data.list;
      this.total = respData.data.total;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-header {
  background-color: #b3c0d1;
  color: #333;
  line-height: 60px;
}

.el-aside {
  color: #333;
}
</style>
