<template>
  <div id="admin">
    <div class="search-box">
      <div class="search-condition">
        <el-row :gutter="25">
          <el-col :span="6">
            <div class="search-main">
              <span class="search-text">账号</span>
              <el-input class="search-input" v-model="search.username" placeholder="按账号搜索"></el-input>
            </div>
          </el-col>

          <el-col :span="6">
            <div class="search-main">
              <span class="search-text">工号</span>
              <el-input class="search-input" v-model="search.code" placeholder="按工号搜索"></el-input>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="search-main">
              <span class="search-text">手机号码</span>
              <el-input class="search-input" v-model="search.phone" placeholder="按手机号码搜索"></el-input>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="search-main">
              <span class="search-text">模版</span>
              <el-select class="search-input" v-model="search.role_id" placeholder="按模版搜索">
                <el-option v-for="item in roles" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
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
        <el-button cricle type="primary" @click="get_admins()">查询</el-button>
        <el-button cricle type="primary" @click="add_line">新建账号</el-button>
      </div>
    </div>
    <div class="search-table">
      <el-table :data="tableData" stripe align="center">
        <el-table-column label="账号" prop="username" align="center">
        </el-table-column>
        <el-table-column label="工号" prop="code" align="center">
        </el-table-column>
        <el-table-column label="手机号码" prop="phone" align="center">
        </el-table-column>
        <el-table-column label="性别" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.gender == 1">男</span>
            <span v-if="scope.row.gender == 0">女</span>
          </template>
        </el-table-column>
        <el-table-column label="模版" prop="role_name" align="center">
        </el-table-column>
        <el-table-column label="姓名" prop="name" align="center">
        </el-table-column>
        <el-table-column label="创建日期" prop="created_at" align="center">
        </el-table-column>
        <el-table-column label="操作" align="center" width="300px">
          <template slot-scope="scope">
            <el-button v-if="scope.row.active" @click.native.prevent="inactive_admin(scope.$index, tableData)" type="text" size="small">已启用</el-button>
            <el-button v-else @click.native.prevent="active_admin(scope.$index, tableData)" type="text" size="small">已禁用</el-button>
            <el-button @click.native.prevent="edit_admin(scope.$index, tableData)" type="text" size="small">编辑资料</el-button>
            <el-button @click.native.prevent="show_permissions(scope.$index, tableData)" type="text" size="small">查看权限</el-button>
            <el-button @click.native.prevent="delete_admin(scope.$index, tableData)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination @current-change="handleCurrentChange" :current-page.sync="search.page" :page-size="search.size" layout="prev, pager, next, jumper" :page-count="total_page">
      </el-pagination>
    </div>
    <el-dialog title="查看权限" :visible.sync="perDialogShow" width="40%">
      <el-checkbox-group v-model="added.permissions">
        <el-row>
          <el-col v-for="item in permissions" :key="item.id" :span="6">
            <el-checkbox :label="item.id" disabled>
              {{item.name}}
            </el-checkbox>
          </el-col>
        </el-row>
      </el-checkbox-group>
      <el-button style="margin-top:30px;" cricle type="primary" @click.native.prevent="surePers()">确定</el-button>
    </el-dialog>

    <el-dialog title="编辑资料" :visible.sync="dialogShow" width="30%">
      <el-form label-width="100px">
        <el-form-item label="账号:">
          <el-input class="added-input" v-model="added.username"></el-input>
        </el-form-item>
        <el-form-item label="密码:">
          <el-input class="added-input" v-model="added.password"></el-input>
        </el-form-item>
        <el-form-item label="工号:">
          <el-input class="added-input" v-model="added.code"></el-input>
        </el-form-item>
        <el-form-item label="手机:">
          <el-input class="added-input" v-model="added.phone"></el-input>
        </el-form-item>
        <el-form-item label="性别:">
          <el-select class="added-input" v-model="added.gender">
            <el-option label="男" :value="1"></el-option>
            <el-option label="女" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="姓名:">
          <el-input class="added-input" v-model="added.name"></el-input>
        </el-form-item>
        <el-form-item label="模版:">
          <el-select class="added-input" v-model="added.role_id">
            <el-option v-for="item in roles" :label="item.name" :value="item.id" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <el-button type="primary" @click="sureAdd()">确定</el-button>
      <el-button @click="noAdd()">取消</el-button>
    </el-dialog>
  </div>
</template>

<script>
  import router from "../router/index.js";
  import Vue from "vue";

  export default {
    data() {
      return {
        perDialogShow: false,
        permissions: [],
        roles: [],
        dialogShow: false,
        search: {},
        added: {},
        tableData: [],
        count: 0,
        total_page: 0
      };
    },
    created() {
      this.get_permissions();
      this.get_roles();
    },
    mounted() {
      this.get_admins();
    },
    methods: {
      surePers() {
        this.perDialogShow = false;
        this.added = {};
      },
      show_permissions(index, rows) {
        this.added = rows[index];
        this.perDialogShow = true;
      },
      async get_roles() {
        let result = await this.$axios.get("/admin/all_roles/");
        if(result.data.status != 0) return;
        this.roles = result.data.data;
      },
      async handleCurrentChange(val) {
        this.search.page = val;
        this.get_admins();
      },
      async inactive_admin(index, rows) {
        let row = rows[index];
        let confirmed = await this.$confirm(
          "确认禁用该账户？\n 禁用后该账户将无法再登录控制台 ",
          "请确认", {
            type: "warning"
          }
        );
        let row_id = row.id;
        let result = await this.$axios.post(`/admin/admin/${row_id}`, {
          active: false
        });
        if(result.data.status != 0) return;
        this.$message("修改成功");
        this.get_admins();
      },
      async active_admin(index, rows) {
        let row = rows[index];
        let confirmed = await this.$confirm(
          "确认启用该账户？\n 启用后该账户将可以登录控制台",
          "请确认", {
            type: "warning"
          }
        );
        let row_id = row.id;
        let result = await this.$axios.post(`/admin/admin/${row_id}`, {
          active: true
        });
        if(result.data.status != 0) return;
        this.$message("修改成功");
        this.get_admins();
      },
      edit_permissions(index, rows) {
        let role = rows[index];
        let role_id = role.id;
        this.added = JSON.parse(JSON.stringify(role));
      },
      async sureEdit() {
        let roleId = this.added.id;
        let name = this.added.name;
        let result = await this.$axios.post(`/admin/admin/${roleId}`, {
          name: name
        });
        if(result.data.status != 0) return;
        this.$message("修改成功");
        this.dialogShow = false;
        this.get_admins();
      },
      async sureAdd() {
        let roleId = this.added.id;
        let role = this.added;
        if(this.added.id) {
          delete role.active;
          let result = await this.$axios.post(`/admin/admin/${roleId}`, role);
          if(result.data.status != 0) return;
          this.added = {};
          this.$message("修改成功");
          this.dialogShow = false;
          this.get_admins();
        } else {
          let result = await this.$axios.post("/admin/admin/", role);
          if(result.data.status != 0) return;
          this.added = {};
          this.$message("新增成功");
          this.dialogShow = false;
          this.get_admins();
        }
      },
      noAdd() {
        this.dialogShow = false;
        this.added = {};
      },
      async edit_admin(index, row) {
        let admin = row[index];
        let admin_id = admin.id;
        this.added = JSON.parse(JSON.stringify(admin));
        this.dialogShow = true;
      },
      add_line() {
        this.added = {};
        this.dialogShow = true;
      },
      async delete_admin(index, rows) {
        let confirmed = await this.$confirm("确定要删除吗？", "请确认", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        });
        let admin_id = rows[index].id;
        if(admin_id) {
          let resp = await this.$axios.delete(`/admin/admin/${admin_id}/`);
          rows.splice(index, 1);
        } else {
          rows.splice(index, 1);
        }
        this.$message("删除成功");
      },
      async get_permissions() {
        let result = await this.$axios.get("/admin/permissions/");
        if(result.data.status != 0) return;
        this.permissions = result.data.data;
      },
      async get_admins() {
        let params = this.search;
        let resp = await this.$axios.get("/admin/admin/", { params: params });
        let respData = resp.data;
        if(respData.status != 0) return;
        this.tableData = respData.data.list;
        this.total_page = respData.data.total_page;
        this.page = respData.data.page;
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
</style>
