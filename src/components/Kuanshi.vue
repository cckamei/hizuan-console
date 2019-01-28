<template>
  <div id="kuanshi">
    <div class="search-box">
      <div class="search-condition">
        <el-row :gutter="25">
          <el-col :span="6">
            <div class="search-main">
              <span class="search-text">名称</span>
              <el-input placeholder="按名称搜索" class="search-input" v-model="search.name"></el-input>
            </div>
          </el-col>
        </el-row>

      </div>
      <div class="search-btn">
        <el-button cricle type="primary" @click="get_kuanshis()">查询</el-button>
        <el-button cricle type="primary" @click="add_line">新增款式</el-button>
      </div>
    </div>
    <div class="search-table">
      <el-table :data="tableData" stripe align="center">
        <el-table-column label="款式名称" prop="name" align="center">
        </el-table-column>
        <el-table-column label="商品数量" prop="goods_count" align="center">
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button @click.native.prevent="edit_kuanshi(scope.$index, tableData)" type="text" size="small">编辑</el-button>
            <el-button @click.native.prevent="transform_show(scope.$index, tableData)" type="text" size="small">转移</el-button>
            <el-button @click.native.prevent="delete_kuanshi(scope.$index, tableData)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="编辑款式" :visible.sync="dialogShow" width="25%">
      <el-form label-width="120px" @submit.native.prevent>
        <el-form-item label="款式名称:">
          <el-input class="added-input" v-model="added.name"></el-input>
        </el-form-item>
      </el-form>
      <el-button cricle type="primary" @click="sureAdd()">确定</el-button>
      <el-button cricle @click="noAdd()">取消</el-button>
    </el-dialog>

    <el-dialog title="转移商品" :visible.sync="transform_dialog_show" width="25%">
      <el-form label-width="120px" @submit.native.prevent>

        <el-form-item label="转移至:">
          <el-select v-model="transform.targetId">
            <el-option v-for="item in tableData" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-button cricle type="primary" @click="sureTransform()">确定</el-button>
      <el-button cricle @click="noTransform()">取消</el-button>
    </el-dialog>

  </div>
</template>

<script>
import router from "../router/index.js";
import { UPLOAD_IMG_URL } from "../global.js";
import Vue from "vue";
const QS = require("qs");

export default {
  data() {
    return {
      transform: {},
      transform_dialog_show: false,
      dialogShow: false,
      search: {},
      added: {},
      tableData: [],
      total: 9,
      page: 1,
      size: 10,
      uploadDialog: false,
      uploadIndex: null,
      upload_url: UPLOAD_IMG_URL
    };
  },
  created() {
    this.get_kuanshis();
  },
  mounted() {},
  methods: {
    async sureTransform() {
      let result = await this.$axios.post(`/admin/transform_kuanshi/`, {
        from: this.transform.cateId,
        to: this.transform.targetId
      });
      if (result.data.status != 0) return;
      this.transform_dialog_show = false;
      this.get_kuanshis();
    },
    noTransform() {
      this.transform = {};
      this.transform_dialog_show = false;
    },
    transform_show(index, rows) {
      this.transform.cateId = rows[index].id;
      this.transform_dialog_show = true;
    },
    async get_kuanshis() {
      let params = this.search;
      let resp = await this.$axios.get("/admin/kuanshi", { params: params });
      let respData = resp.data.data;
      if (respData) {
        this.tableData = resp.data.data;
      }
      // this.page = respData.data.page;
      // this.size = respData.data.size;
    },
    noAdd() {
      this.dialogShow = false;
      this.added = {};
    },
    async sureAdd() {
      let cateId = this.added.id;
      let cate = this.added;
      if (this.added.id) {
        let result = await this.$axios.post(`/admin/kuanshi/${cateId}`, cate);
        if (result.data.status != 0) return;
        this.added = {};
        this.$message("修改成功");
        this.dialogShow = false;
        this.get_kuanshis();
      } else {
        let result = await this.$axios.post("/admin/kuanshi", cate);
        if (result.data.status != 0) return;
        this.added = {};
        this.$message("新增成功");
        this.dialogShow = false;
        this.get_kuanshis();
      }
    },
    handleUploadSuccess(response, file, fileList) {
      let img = response.data.url;
      if (img) {
        Vue.set(this.added, "img", img);
      }
    },
    add_line() {
      this.added = {};
      this.dialogShow = true;
    },
    edit_kuanshi(index, rows) {
      let cate = rows[index];
      let cate_id = cate.id;
      this.added = JSON.parse(JSON.stringify(cate));
      this.dialogShow = true;
    },
    async save_kuanshi(index, row) {
      let confirmed = await this.$confirm("确定要修改吗？", "请确认", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      });
      if (confirmed != "confirm") {
        return;
      }
      let kuanshi = row[index];
      let kuanshi_id = kuanshi.id;
      if (kuanshi_id) {
        let result = await this.$axios.post(`/admin/kuanshi/${kuanshi_id}/`, {
          name: kuanshi.name,
          img: kuanshi.img,
          show_on_home: kuanshi.show_on_home
        });
        if (result.data.status == 0) {
          this.$message("修改成功");
        }
      } else {
        // 新增
        let result = await this.$axios.post("/admin/kuanshi/", {
          name: kuanshi.name,
          img: kuanshi.img,
          show_on_home: kuanshi.show_on_home
        });
        if (result.data.status == 0) {
          let kuanshi_id = result.data.data.id;
          this.$message("新增成功");
          Vue.set(row[index], "id", kuanshi_id);
        }
      }
    },
    handlekuanshiError(err, file, fileList) {
      console.log(err);
    },
    async delete_kuanshi(index, rows) {
      let confirmed = await this.$confirm("确定要删除吗？", "请确认", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      });
      if (confirmed != "confirm") {
        return;
      }
      let kuanshi_id = rows[index].id;
      if (kuanshi_id) {
        let resp = await this.$axios.delete(`/admin/kuanshi/${kuanshi_id}/`);
        rows.splice(index, 1);
      } else {
        rows.splice(index, 1);
      }
      this.$message("删除成功");
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* #kuanshi {
                                                                        margin-left: 5%;
                                                                      } */
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
  width: 70%;
}
</style>
