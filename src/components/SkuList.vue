<template>
  <div id="banner">
    <div style="display: block; float: left;">
      <span>编辑SKU</span>
      <el-button cricle type="primary" @click="add_line">新增</el-button>
    </div>
    <span>{{goods.title}} - {{goods.subtitle}}</span>
    <br>
    <el-table :data="tableData" border>
      <el-table-column label="商家编码" prop="merchant_code">
        <template slot-scope="scope">
          <el-input v-model="scope.row.merchant_code"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="条形码">
        <template slot-scope="scope">
          <el-input v-model="scope.row.bar_code"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="颜色">
        <template slot-scope="scope">
          <el-input v-model="scope.row.color"></el-input>
        </template>
      </el-table-column>
      <el-table-column lable="金颜色">
        <template slot-scope="scope">
          <el-input v-model="scope.row.gold_color"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="规格">
        <template slot-scope="scope">
          <el-input v-model="scope.row.guige"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="钻石">
        <template slot-scope="scope">
          钻石净度:
          <el-input placeholder="钻石净度" v-model="scope.row.zuanshijingdu"></el-input>
          主钻分数:
          <el-input placeholder="主钻分数" v-model="scope.row.zhuzuanfenshu"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="非钻石">
        <template slot-scope="scope">
          主石名称:
          <el-input v-model="scope.row.zhushimingcheng"></el-input>
          主石评级:
          <el-input v-model="scope.row.zhushipingji"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="重量">
        <template slot-scope="scope">
          重量值:
          <el-input v-model="scope.row.weight_value"></el-input>
          重量单位:
          <el-input v-model="scope.row.weight_unit"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="库存">
        <template slot-scope="scope">
          <el-input v-model="scope.row.count"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="价格">
        <template slot-scope="scope">
          <el-input v-model="scope.row.price"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="公司模号">
        <template>
          <el-input v-model="scope.row.mode_code"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100px" align="center">
        <template slot-scope="scope">
          <el-button @click.native.prevent="save_sku(scope.$index, tableData)" type="text" size="small">保存</el-button>
          <el-button @click.native.prevent="delete_sku(scope.$index, tableData)" type="text" size="small">删除</el-button>
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
      goods: {}
    };
  },
  created() {
    this.get_goods();
    this.get_sku_list();
  },
  mounted() {
    // this.get_banners();
  },
  methods: {
    async get_goods() {
      let route_name = this.$route.name;
      let goods_id = this.$route.params["goods_id"];
      this.goods_id = goods_id;
      let resp = await this.$axios.get(`/admin/goods/${goods_id}`);
      let respData = resp.data;
      if (respData.status != 0) return;
      this.goods = respData.data;
    },
    async save_sku(index, row) {
      let confirmed = await this.$confirm("确定填写内容正确", "请确认", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      });
      if (confirmed != "confirm") {
        return;
      }
      let sku = row[index];
      sku.goods_id = this.goods_id;
      let sku_id = sku.id;
      if (sku_id) {
        let result = await this.$axios.post(`/admin/sku/${sku_id}/`, sku);
        if (result.data.code == 0) {
          this.$message("修改成功");
        }
      } else {
        // 新增
        let result = await this.$axios.post("/admin/sku/", sku);
        if (result.data.code == 0) {
          let banner_id = result.data.data.id;
          this.$message("新增成功");
          Vue.set(row[index], "id", banner_id);
        }
      }
    },
    add_line() {
      this.tableData.unshift({});
    },
    async delete_sku(index, rows) {
      let confirmed = await this.$confirm("确定要删除吗？", "请确认", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      });
      if (confirmed != "confirm") {
        return;
      }
      let sku_id = rows[index].id;
      if (sku_id) {
        let resp = await this.$axios.delete(`/admin/sku/${sku_id}/`);
        rows.splice(index, 1);
      } else {
        rows.splice(index, 1);
      }
      this.$message("删除成功");
    },
    async get_sku_list() {
      let route_name = this.$route.name;
      let goods_id = this.$route.params["goods_id"];
      this.goods_id = goods_id;
      // 获取sku_id
      let resp = await this.$axios.get(`/admin/sku/?goods_id=${goods_id}`);
      let respData = resp.data;
      if (respData.status != 0) return;
      this.tableData = respData.data;
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
</style>
