<template>
  <div id="category">
    <div class="search-box">
      <div class="search-condition">
        <el-row :gutter="25">

          <el-col :span="6">
            <div class="search-main search-mains">
              <span class="search-text">名称</span>
              <el-input placeholder="按名称搜索" class="search-input" v-model="search.name"></el-input>
            </div>
          </el-col>

          <el-col :span="6">
            <div class="search-main search-mains">
              <span class="search-text">状态</span>
              <el-select class="search-input" v-model="search.show_on_home">
                <el-option label="全部" value=""></el-option>
                <el-option label="显示" :value="true"></el-option>
                <el-option label="不显示" :value="false"></el-option>
              </el-select>
            </div>
          </el-col>

        </el-row>
      </div>
      <div class="search-btn">
        <el-button cricle type="primary" @click="get_categorys()">查询</el-button>
        <el-button cricle type="primary" @click="add_line">新增套系</el-button>
      </div>
    </div>
    <div class="search-table">
      <el-table :data="tableData" stripe align="center">
        <el-table-column label="名称" prop="name" align="center">
        </el-table-column>
        <el-table-column label="数量" prop="goods_count" align="center">
        </el-table-column>
        <el-table-column label="是否在首页显示" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.show_on_home">显示</span>
            <span v-else>不显示</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button @click.native.prevent="edit_category(scope.$index, tableData)" type="text" size="small">编辑</el-button>
            <el-button @click.native.prevent="transform_show(scope.$index, tableData)" type="text" size="small">转移</el-button>
            <el-button @click.native.prevent="delete_category(scope.$index, tableData)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="编辑套系" :visible.sync="dialogShow" :width="'30%'">
      <el-form label-width="120px">
        <el-form-item label="名称:">
          <el-input class="added-input" v-model="added.name"></el-input>
        </el-form-item>
        <el-form-item label="图片:">
          <el-upload class="added-input" drag :action="upload_url" :on-success="handleUploadSuccess">
            <div class="el-upload__text">将文件拖到此处，或
              <em>点击上传</em>
            </div>
            <img style="width:350px;" :src="added.img" alt="">
          </el-upload>
        </el-form-item>
        <el-form-item label="是否在首页显示:">
          <el-switch class="added-input" v-model="added.show_on_home" active-text="是" inactive-text="否"></el-switch>
        </el-form-item>
        <el-button cricle type="primary" @click="sureAdd()">确定</el-button>
        <el-button cricle @click="noAdd()">取消</el-button>
      </el-form>
    </el-dialog>

    <el-dialog title="转移商品" :visible.sync="transform_dialog_show" width="27%">
      <el-form label-width="120px" @submit.native.prevent>

        <el-form-item label="转移至:">
          <el-select class="added-input" v-model="transform.targetId" style="float: left;margin-right:40px;">
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
    this.get_categorys();
  },
  mounted() {},
  methods: {
    async sureTransform() {
      let result = await this.$axios.post(`/admin/transform_series/`, {
        from: this.transform.cateId,
        to: this.transform.targetId
      });
      if (result.data.status != 0) return;
      this.transform_dialog_show = false;
      this.get_categorys();
    },
    noTransform() {
      this.transform = {};
      this.transform_dialog_show = false;
    },
    transform_show(index, rows) {
      this.transform.cateId = rows[index].id;
      this.transform_dialog_show = true;
    },
    async get_categorys() {
      let params = this.search;
      let resp = await this.$axios.get("/admin/series", { params: params });
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
        let result = await this.$axios.post(`/admin/series/${cateId}`, cate);
        if (result.data.status != 0) return;
        this.added = {};
        this.$message("修改成功");
        this.dialogShow = false;
        this.get_categorys();
      } else {
        let result = await this.$axios.post("/admin/series", cate);
        if (result.data.status != 0) return;
        this.added = {};
        this.$message("新增成功");
        this.dialogShow = false;
        this.get_categorys();
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
    edit_category(index, rows) {
      let cate = rows[index];
      let cate_id = cate.id;
      this.added = JSON.parse(JSON.stringify(cate));
      this.dialogShow = true;
    },
    async save_category(index, row) {
      let confirmed = await this.$confirm("确定要修改吗？", "请确认", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      });
      if (confirmed != "confirm") {
        return;
      }
      let category = row[index];
      let category_id = category.id;
      if (category_id) {
        let result = await this.$axios.post(`/admin/series/${category_id}/`, {
          name: category.name,
          img: category.img,
          show_on_home: category.show_on_home
        });
        if (result.data.status == 0) {
          this.$message("修改成功");
        }
      } else {
        // 新增
        let result = await this.$axios.post("/admin/series/", {
          name: category.name,
          img: category.img,
          show_on_home: category.show_on_home
        });
        if (result.data.status == 0) {
          let category_id = result.data.data.id;
          this.$message("新增成功");
          Vue.set(row[index], "id", category_id);
        }
      }
    },
    handlecategoryError(err, file, fileList) {
      console.log(err);
    },
    async delete_category(index, rows) {
      let confirmed = await this.$confirm("确定要删除吗？", "请确认", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      });
      if (confirmed != "confirm") {
        return;
      }
      let category_id = rows[index].id;
      if (category_id) {
        let resp = await this.$axios.delete(`/admin/series/${category_id}/`);
        rows.splice(index, 1);
      } else {
        rows.splice(index, 1);
      }
      this.$message("删除成功");
    }
  }
};
</script>

<!-- Add"scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
/* #category {
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
  width: 88%;
}
.el-upload {
  width: 100%;
}
.el-upload-dragger {
  width: 100%;
}
</style>
