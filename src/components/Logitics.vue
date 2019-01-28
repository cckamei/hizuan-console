<template>
  <div id="logitics">
    <div class="search-box">
      <div class="search-condition">
        <el-row :gutter="25">
          <el-col :span="6">
            <div class="search-main">
              <span class="search-text">物流名称</span>
              <el-input class="search-input" v-model="search.name" placeholder="按物流名称搜索">物流名称</el-input>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="search-btn">
        <el-button cricle type="primary" @click="get_logitics()">查询</el-button>
        <el-button cricle type="primary" @click="add_line">新增物流</el-button>
      </div>
    </div>
    <div class="search-table">
      <el-table :data="tableData" stripe align="center">
        <el-table-column label="物流公司名称" align="center" prop="name">
        </el-table-column>

        <el-table-column label="首重" align="center">
          <template slot-scope="scope">
            {{scope.row.first_weight}} <span>KG</span>
          </template>
        </el-table-column>
        <el-table-column label="首重价格" align="center" prop="first_weight_price">
        </el-table-column>
        <el-table-column label="加重" align="center" prop="add_weight">
          <template slot-scope="scope">
            {{scope.row.add_weight}} <span v-if="scope.row.add_weight">KG</span>
          </template>
        </el-table-column>
        <el-table-column label="加重价格" align="center" prop="add_weight_price">
        </el-table-column>
        <el-table-column label="操作" fixed="right" align="center">
          <template slot-scope="scope">
            <el-button v-if="scope.row.default" type="text" size="small">当前默认</el-button>
            <el-button v-else @click.native.prevent="set_default(scope.$index, tableData)" type="text" size="small">设为默认</el-button>
            <el-button @click.native.prevent="edit_logitics(scope.$index, tableData)" type="text" size="small">编辑</el-button>
            <el-button @click.native.prevent="delete_logitics(scope.$index, tableData)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="编辑物流" :visible.sync="dialogShow" width="30%">
      <el-form label-width="120px">
        <el-form-item label="物流公司名称:">
          <el-input class="added-input" v-model="added.name"></el-input>
        </el-form-item>
        <el-form-item label="首重:">
          <el-input class="added-input" v-model="added.first_weight"></el-input>
          <span>KG</span>
        </el-form-item>
        <el-form-item label="首重价格:">
          <el-input class="added-input" v-model="added.first_weight_price"> </el-input>
        </el-form-item>
        <el-form-item label="加重:">
          <el-input class="added-input" v-model="added.add_weight"></el-input>
          <span>KG</span>
        </el-form-item>
        <el-form-item label="加重价格:">
          <el-input class="added-input" v-model="added.add_weight_price"></el-input>
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
        dialogShow: false,
        search: {},
        added: {},
        tableData: []
      };
    },
    mounted() {
      this.get_logitics();
    },
    methods: {
      async set_default(index, rows) {
        let row_id = rows[index].id;
        let result = await this.$axios.post(
          `/admin/logitics/setdefault/${row_id}`
        );
        if(result.data.status != 0) return;
        this.get_logitics();
      },
      async sureAdd() {
        let logiticsId = this.added.id;
        let logitics = this.added;
        if(this.added.id) {
          let result = await this.$axios.post(
            `/admin/logitics/${logiticsId}`,
            logitics
          );
          if(result.data.status != 0) return;
          this.added = {};
          this.$message("修改成功");
          this.dialogShow = false;
          this.get_logitics();
        } else {
          let result = await this.$axios.post("/admin/logitics", logitics);
          if(result.data.status != 0) return;
          this.added = {};
          this.$message("新增成功");
          this.dialogShow = false;
          this.get_logitics();
        }
      },
      noAdd() {
        this.dialogShow = false;
        this.added = {};
      },
      async edit_logitics(index, rows) {
        let logitics = rows[index];
        let logitics_id = logitics.id;
        this.added = JSON.parse(JSON.stringify(logitics));
        this.dialogShow = true;
      },
      add_line() {
        this.added = {};
        this.dialogShow = true;
      },
      async delete_logitics(index, rows) {
        let confirmed = await this.$confirm("确定要删除吗？", "请确认", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        });
        let logitics_id = rows[index].id;
        if(logitics_id) {
          let resp = await this.$axios.delete(`/admin/logitics/${logitics_id}/`);
          rows.splice(index, 1);
        } else {
          rows.splice(index, 1);
        }
        this.$message("删除成功");
      },
      async get_logitics() {
        let params = this.search;
        let resp = await this.$axios.get("/admin/logitics/", { params: params });
        let respData = resp.data;
        if(respData.status != 0) return;
        this.tableData = respData.data;
        // this.total = respData.data.total;
        // this.page = respData.data.page;
        // this.size = respData.data.size;
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
