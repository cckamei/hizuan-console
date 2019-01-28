<template>
  <div id="banner">
    <el-dialog title="上传图片" :visible.sync=uploadDialog>
      <el-upload ref="el-upload" v-bind:action="upload_url" drag auto-upload :on-success="handleBannerSuccess" :on-error="handleBannerError">
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
    </el-dialog>
    <div style="display: block; float: left;">
      <span>banner列表</span>
      <el-button cricle type="primary" @click="add_line">新增</el-button>
    </div>
    <br> <br>
    <el-table :data="tableData" border>
      <el-table-column label="序号" width="150px" align="center" sortable prop="sort_id">
        <template slot-scope="scope">
          <el-input-number size="mini" :min="1" :max="999" v-model="scope.row.sort_id"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column label="标题" width="200px" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.title"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="图片" width="300px" align="center">
        <template slot-scope="scope">
          <img v-bind:src="scope.row.img" alt="" style="display:inline-block; max-height:100px;margin:0;padding:0;">
          <el-button size="mini" @click="uploadDialogShow(scope.$index)">上传</el-button>
        </template>
      </el-table-column>
      <el-table-column label="链接" width="300px" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.link"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="150px" align="center">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.active" active-text="激活" inactive-text="关闭"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100px" align="center">
        <template slot-scope="scope">
          <el-button @click.native.prevent="save_banner(scope.$index, tableData)" type="text" size="small">保存</el-button>
          <el-button @click.native.prevent="delete_banner(scope.$index, tableData)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-sizes="[10, 20, 30, 40]" layout="sizes, total,  prev, pager, next, jumper" :total="total">
    </el-pagination>
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
        tableData: [
          {
            // id: 1,
            // sort_id: 2,
            // title:"title",
            // img:"http://www.jj20.com/js/2017ad.jpg",
            // link:"http://www.baidu.com/",
            // active: true
          }
        ],
        total: 9,
        page: 1,
        size: 10,
        uploadDialog: false,
        uploadIndex: null,
        upload_url: UPLOAD_IMG_URL
      };
    },
    created() { },
    mounted() {
      this.get_banners();
    },
    methods: {
      async save_banner(index, row) {
        let confirmed = await this.$confirm("确定要修改吗？", "请确认", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        });
        if(confirmed != "confirm") {
          return;
        }
        let banner = row[index];
        let banner_id = banner.id;
        if(banner_id) {
          let result = await this.$axios.post(`/admin/banner/${banner_id}/`, {
            sort_id: banner.sort_id,
            title: banner.title,
            img: banner.img,
            link: banner.link,
            active: banner.active
          });
          if(result.data.code == 0) {
            this.$message("修改成功");
          }
        } else {
          // 新增
          let result = await this.$axios.post("/admin/banner/", {
            sort_id: banner.sort_id,
            title: banner.title,
            img: banner.img,
            link: banner.link,
            active: banner.active
          });
          if(result.data.code == 0) {
            let banner_id = result.data.data.id;
            this.$message("新增成功");
            Vue.set(row[index], "id", banner_id);
          }
        }
      },
      uploadDialogShow(index) {
        this.uploadIndex = index;
        this.uploadDialog = true;
      },
      add_line() {
        this.tableData.unshift({
          id: null,
          sort_id: "99",
          title: "",
          img: "",
          link: "",
          active: false
        });
      },
      handleBannerSuccess(resp, file, fileList) {
        // 渲染table row
        let imgUrl = resp.url;
        let row = this.tableData[this.uploadIndex];
        // 删除已上传文件
        this.$refs["el-upload"].clearFiles();
        Vue.set(this.tableData[this.uploadIndex], "img", imgUrl);
        // 关闭上传窗口
        this.uploadDialog = false;
      },
      handleBannerError(err, file, fileList) {
        console.log(err);
      },
      async delete_banner(index, rows) {
        let confirmed = await this.$confirm("确定要删除吗？", "请确认", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        });
        if(confirmed != "confirm") {
          return;
        }
        let banner_id = rows[index].id;
        if(banner_id) {
          let resp = await this.$axios.delete(`/admin/banner/${banner_id}/`);
          rows.splice(index, 1);
        } else {
          rows.splice(index, 1);
        }
        this.$message("删除成功");
      },
      async get_banners() {
        let resp = await this.$axios.get("/admin/banner/?page=1&offset=10");
        let respData = resp.data;
        if(respData.code != 0) return;
        this.tableData = respData.data.list;
        this.total = respData.data.total;
        // this.page = respData.data.page;
        // this.size = respData.data.size;
      },
      //当前页码改变时触发
      async handleCurrentChange(val) {
        let param = 'p=' + val + '&offset=' + this.size;
        let resp = await this.$axios.get("/admin/banner/?" + param);
        let respData = resp.data;
        if(respData.code != 0) return;
        this.tableData = respData.data.list;
        this.total = respData.data.total;
      },
      //每页条数改变时触发
      async handleSizeChange(val) {
        this.size = val;
        let param = 'p=' + this.page + '&offset=' + val;
        let resp = await this.$axios.get("/admin/banner/?" + param);
        let respData = resp.data;
        if(respData.code != 0) return;
        this.tableData = respData.data.list;
        this.total = respData.data.total;
      }
    }

  };
</script>

<!-- Add"scoped" attribute to limit CSS to this component only -->
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
