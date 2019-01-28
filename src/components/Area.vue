<template>
  <div id="area">
    <div class="search-box">
      <div class="search-condition">
        <el-row :gutter="25">
          <el-col :span="6">
            <div class="search-main">
              <span class="search-text">大区名称</span>
              <el-input class="search-input" v-model="search.name" placeholder="按大区名称搜索">大区名称</el-input>
            </div>
          </el-col>

          <el-col :span="6">
            <div class="search-main">
              <span class="search-text">大区管辖</span>
              <el-input class="search-input" v-model="search.area" placeholder="按大区管辖搜索">大区名称</el-input>
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
        <el-button cricle type="primary" @click="get_areas()">查询</el-button>
        <el-button cricle type="primary" @click="add_line">新增大区</el-button>
      </div>
    </div>
    <div class="search-table">
      <el-table :data="tableData" stripe align="center">
        <el-table-column label="大区名称" align="center" prop="name">
        </el-table-column>
        <el-table-column label="大区管辖" align="center">
          <template slot-scope="scope">
            {{scope.row.area.join(", ")}}
          </template>
        </el-table-column>
        <el-table-column label="负责人" align="center" prop="manager">
        </el-table-column>
        <el-table-column label="联系方式" align="center" prop="phone">
        </el-table-column>
        <el-table-column label="操作" fixed="right" align="center">
          <template slot-scope="scope">
            <el-button @click.native.prevent="edit_area(scope.$index, tableData)" type="text" size="small">编辑</el-button>
            <el-button @click.native.prevent="delete_area(scope.$index, tableData)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="编辑大区" :visible.sync="dialogShow" width="30%">
      <el-form label-width="100px">
        <el-form-item label="大区名称:">
          <el-input class="added-input" v-model="added.name"></el-input>
        </el-form-item>
        <el-form-item label="负责人:">
          <el-input class="added-input" v-model="added.manager"></el-input>
        </el-form-item>
        <el-form-item label="联系方式:">
          <el-input class="added-input" v-model="added.phone"></el-input>
        </el-form-item>
        <el-form-item label="大区管辖:">
          <el-input class="added-input" :disabled="true" v-model="addedAreaList" v-on:click.native="trogglePshow">
          </el-input>
          <!-- <el-checkbox v-model="added.area" v-show="pShow" v-for="item in province" :label="item" :key="item">{{item}}</el-checkbox> -->
          <el-row style="padding-left: 43px">
            <el-col v-for="(item,index) in province" :key="item" :span="8" style="text-align: left;">
              <el-checkbox v-model="added.area" v-show="pShow" :label="item">{{item}}</el-checkbox>
            </el-col>
          </el-row>
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
  import { province } from "../utils/common.js";
  const QS = require("qs");

  export default {
    computed: {
      addedAreaList: function() {
        return this.added.area.join(", ");
      }
    },
    data() {
      return {
        search: {},
        pShow: false,
        province: province,
        dialogShow: false,
        added: {
          area: []
        },
        tableData: []
      };
    },
    created() { },
    mounted() {
      this.get_areas();
    },
    methods: {
      async noAdd() {
        this.dialogShow = false;
        this.added = { area: [] };
      },
      async sureAdd() {
        let areaId = this.added.id;
        let area = this.added;
        if(this.added.id) {
          let result = await this.$axios.post(`/admin/area/${areaId}`, area);
          if(result.data.status != 0) return;
          this.added = { area: [] };
          this.$message("修改成功");
          this.dialogShow = false;
          this.get_areas();
        } else {
          let result = await this.$axios.post("/admin/area", area);
          if(result.data.status != 0) return;
          this.added = { area: [] };
          this.$message("新增成功");
          this.dialogShow = false;
          this.get_areas();
        }
      },
      trogglePshow() {
        this.pShow = !this.pShow;
      },
      edit_area(index, row) {
        let area = row[index];
        let area_id = area.id;
        this.added = JSON.parse(JSON.stringify(area));
        this.dialogShow = true;
      },
      add_line() {
        this.added = {area: []};
        this.dialogShow = true;
      },
      async delete_area(index, rows) {
        let confirmed = await this.$confirm("确定要删除吗？", "请确认", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        });
        if(confirmed != "confirm") {
          return;
        }
        let area_id = rows[index].id;
        if(area_id) {
          let resp = await this.$axios.delete(`/admin/area/${area_id}/`);
          rows.splice(index, 1);
        } else {
          rows.splice(index, 1);
        }
        this.$message("删除成功");
      },
      async get_areas() {
        let params = this.search;
        let resp = await this.$axios.get("/admin/area/", { params: params });
        let respData = resp.data;
        if(respData.status != 0) return;
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
<style scoped lang="less">
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
    text-align: center;
  }
  .added-input {
    width: 80%;
  }
</style>
