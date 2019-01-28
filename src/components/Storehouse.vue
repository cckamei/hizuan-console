<template>
  <div id="store">
    <div class="search-box">
      <div class="search-condition">
        <el-row :gutter="25">
          <el-col :span="6">
            <div class="search-main">
              <span class="search-text">仓库名称</span>
              <el-input class="search-input" v-model="search.name" placeholder="按仓库名称搜索">大区名称</el-input>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="search-main">
              <span class="search-text">仓库地址</span>
              <el-input class="search-input" v-model="search.address" placeholder="按仓库地址搜索">仓库地址</el-input>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="search-main">
              <span class="search-text">负责人</span>
              <el-input class="search-input" v-model="search.manager" placeholder="按负责人搜索">负责人</el-input>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="search-main">
              <span class="search-text">联系方式</span>
              <el-input class="search-input" v-model="search.phone" placeholder="按负责人联系方式搜索">联系方式</el-input>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="search-btn">
        <el-button cricle type="primary" @click="get_stores()">查询</el-button>
        <el-button style="display:block; float:left" cricle type="primary" @click="add_line">新增仓库</el-button>
      </div>
    </div>
    <div class="search-table">
      <el-table :data="tableData" stripe max-height="600px" align="center">
        <el-table-column label="仓库名称" align="center" prop="name">
        </el-table-column>
        <el-table-column label="发货地名称" align="center" prop="deliver_name">
        </el-table-column>
        <el-table-column label="仓库地址" align="center">
          <template slot-scope="scope">
            {{scope.row.province}}{{scope.row.city}}{{scope.row.area}}{{scope.row.address}}
          </template>
        </el-table-column>
        <el-table-column label="归属大区" align="center">
          <template slot-scope="scope">
            <span v-if="item.id == scope.row.big_area" v-for="item in big_areas" :key="item.id">{{item.name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="联系方式" align="center" prop="phone">
        </el-table-column>
        <el-table-column label="负责人" align="center" prop="manager">
        </el-table-column>
        <el-table-column label="操作" fixed="right" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" v-if="scope.row.default">当前默认</el-button>
            <el-button @click.native.prevent="setDefault(scope.$index, tableData)" type="text" size="small" v-else>设为默认</el-button>
            <el-button @click.native.prevent="edit_store(scope.$index, tableData)" type="text" size="small">编辑</el-button>
            <el-button @click.native.prevent="delete_store(scope.$index, tableData)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="编辑仓库" :visible.sync="dialogShow" width="30%">
      <el-form label-width="120px">
        <el-form-item label="仓库名称:">
          <el-input class="added-input" v-model="added.name"></el-input>
        </el-form-item>
        <el-form-item label="发货地名称:">
          <el-input class="added-input" v-model="added.deliver_name"></el-input>
        </el-form-item>
        <!-- <el-form-item label="仓库地址:">
          <el-cascader style="width:200px;" :options="regionData" v-model="added.regionData" @change="handleChange">
          </el-cascader>
          <el-input style="width:100px;" class="added-input" v-model="added.address" placeholder="街道地址门牌号..."></el-input>
        </el-form-item> -->
        <el-form-item label="仓库地址:">
          <el-cascader :options="regionData" v-model="added.regionData" @change="handleChange" style="width: 300px;">
          </el-cascader>
        </el-form-item>
        <el-form-item>
          <el-input style="width:300px;" class="added-input" v-model="added.address" placeholder="街道地址门牌号..."></el-input>
        </el-form-item>
        <el-form-item label="归属大区:">
          <el-select v-model="added.big_area" class="added-input">
            <el-option v-for="item in big_areas" :key="item.id" :value="item.id" :label="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="仓库负责人:">
          <el-input class="added-input" v-model="added.manager"></el-input>
        </el-form-item>
        <el-form-item label="联系方式:">
          <el-input class="added-input" v-model="added.phone"></el-input>
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
        search: {},
        added: {},
        tableData: []
      };
    },
    created() {
      this.get_big_areas();
    },
    mounted() {
      this.get_stores();
    },
    methods: {
      async setDefault(index, rows) {
        let confirmed = await this.$confirm("确认将该仓库设为默认发货地吗？");
        if(confirmed == "confirm") {
          let rowid = rows[index]["id"];
          let result = await this.$axios.post(
            `/admin/storehouse/setdefault/${rowid}/`
          );
          if(result.data.status != 0) return;
          this.get_stores();
        }
      },
      async sureAdd() {
        let regionData = this.added.regionData;
        this.added.province = CodeToText[regionData[0]];
        this.added.city = CodeToText[regionData[1]];
        this.added.area = CodeToText[regionData[2]];
        let storeId = this.added.id;
        let store = this.added;
        if(this.added.id) {
          let result = await this.$axios.post(
            `/admin/storehouse/${storeId}`,
            store
          );
          if(result.data.status != 0) return;
          this.added = {};
          this.$message("修改成功");
          this.dialogShow = false;
          this.get_stores();
        } else {
          let result = await this.$axios.post("/admin/storehouse", store);
          if(result.data.status != 0) return;
          this.added = {};
          this.$message("新增成功");
          this.dialogShow = false;
          this.get_stores();
        }
      },
      handleChange(value) {
      },
      noAdd() {
        this.dialogShow = false;
        this.added = {};
      },
      async edit_store(index, row) {
        let store = row[index];
        let store_id = store.id;
        this.added = JSON.parse(JSON.stringify(store));
        this.added.regionData = [
          TextToCode[this.added.province].code,
          TextToCode[this.added.province][this.added.city].code,
          TextToCode[this.added.province][this.added.city][this.added.area].code
        ];
        this.dialogShow = true;
      },
      add_line() {
        this.added = {};
        this.dialogShow = true;
      },
      async delete_store(index, rows) {
        let confirmed = await this.$confirm("确定要删除吗？", "请确认", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        });
        if(confirmed != "confirm") {
          return;
        }
        let store_id = rows[index].id;
        if(store_id) {
          let resp = await this.$axios.delete(`/admin/storehouse/${store_id}/`);
          rows.splice(index, 1);
        } else {
          rows.splice(index, 1);
        }
        this.$message("删除成功");
      },
      async get_stores() {
        let params = this.search;
        let resp = await this.$axios.get("/admin/storehouse/", {
          params: params
        });
        let respData = resp.data;
        if(respData.status != 0) return;
        this.tableData = respData.data;
        // this.total = respData.data.total;
        // this.page = respData.data.page;
        // this.size = respData.data.size;
      },
      async get_big_areas() {
        let resp = await this.$axios.get("/admin/area/");
        let respData = resp.data;
        if(respData.status != 0) return;
        // this.big_areas = respData.data;
        Vue.set(this, "big_areas", respData.data);
        // console.log(this.big_areas);
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
  .el-form-item {
    text-align: left;
  }
  .added-input {
    width: 300px;
  }
</style>
