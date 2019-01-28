<template>
  <div id="role">
    <div class="search-box">
      <div class="search-condition">
        <el-row :gutter="25">
          <el-col :span="6">
            <div class="search-main">
              <span class="search-text">模版名称</span>
              <el-input class="search-input" placeholder="按模板名称搜索" v-model="search.name"></el-input>
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
        <el-button cricle type="primary" @click="get_roles()">查询</el-button>
        <el-button cricle type="primary" @click="add_line">新建模版</el-button>
      </div>

    </div>
    <div class="search-table">
      <el-table :data="tableData" stripe max-height="600px" align="center">
        <el-table-column label="模版名称" prop="name" align="center">
        </el-table-column>
        <el-table-column label="账号数量" prop="count" align="center">
        </el-table-column>
        <el-table-column label="创建日期" prop="created_at" align="center">
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button v-if="scope.row.active" @click.native.prevent="inactive_role(scope.$index, tableData)" type="text" size="small">已启用</el-button>
            <el-button v-else @click.native.prevent="active_role(scope.$index, tableData)" type="text" size="small">已禁用</el-button>
            <el-button @click.native.prevent="edit_role(scope.$index, tableData)" type="text" size="small">编辑资料</el-button>
            <el-button @click.native.prevent="edit_permissions(scope.$index, tableData)" type="text" size="small">配置权限</el-button>
            <el-button @click.native.prevent="delete_role(scope.$index, tableData)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @current-change="handleCurrentChange" :current-page.sync="search.page" :page-size="search.size" layout="prev, pager, next, jumper" :page-count="total_page">
      </el-pagination>
    </div>

    <el-dialog title="配置权限" :visible.sync="roleDialogShow" width="40%" class="dol">
      <el-form label-width="120px">
        <el-checkbox-group v-model="added.permissions">
          <el-row>
            <el-col v-for="item in permissions" :key="item.id" :span="6">
              <el-checkbox :label="item.id" :disabled="added.is_admin || !added.active">
                {{item.name}}
              </el-checkbox>
            </el-col>
          </el-row>
          <div style="margin:30px 0;"></div>
        </el-checkbox-group>
      </el-form>

      <el-button type="primary" @click="sureAdd()" :disabled="added.is_admin || !added.active">确定</el-button>
      <el-button @click="noAdd()">取消</el-button>
    </el-dialog>

    <el-dialog title="编辑模版" :visible.sync="dialogShow" width="30%">
      <el-form label-width="120px">
        <el-form-item label="模版名称:">
          <el-input class="added-input" v-model="added.name"></el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="sureEdit()">确定</el-button>
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
      count: 0,
      total_page: 0,
      permissions: [],
      roleDialogShow: false,
      dialogShow: false,
      search: {},
      added: {},
      tableData: []
    };
  },
  created() {
    this.get_permissions();
  },
  mounted() {
    this.get_roles();
  },
  methods: {
    async handleCurrentChange(val) {
      this.search.page = val;
      this.get_roles();
    },
    async inactive_role(index, rows) {
      let row = rows[index];
      if (row.is_admin) {
        this.$alert("管理员模板无法被禁用！", "提示", {
          type: "info"
        });
        return;
      }
      let confirmed = await this.$confirm(
        "确认禁用该模板？\n 禁用后该模板下的账户将失去所有权限 "
      );
      let row_id = row.id;
      let result = await this.$axios.post(`/admin/role/${row_id}`, {
        active: false
      });
      if (result.data.status != 0) return;
      this.$message("修改成功");
      this.get_roles();
    },
    async active_role(index, rows) {
      let row = rows[index];
      if (row.is_admin) {
        this.$alert("管理员模板无法被禁用！", "提示", {
          type: "info"
        });
        return;
      }
      let confirmed = await this.$confirm("确认启用该模板？");
      let row_id = row.id;
      let result = await this.$axios.post(`/admin/role/${row_id}`, {
        active: true
      });
      if (result.data.status != 0) return;
      this.$message("修改成功");
      this.get_roles();
    },
    edit_permissions(index, rows) {
      let role = rows[index];
      if (role.is_admin) {
        this.$alert("注意：管理员模板禁止配置权限。");
        return;
      }
      let role_id = role.id;
      this.added = JSON.parse(JSON.stringify(role));
      this.roleDialogShow = true;
    },
    async get_permissions() {
      let result = await this.$axios.get("/admin/permissions/");
      if (result.data.status != 0) return;
      this.permissions = result.data.data;
    },
    async sureEdit() {
      let roleId = this.added.id;
      let name = this.added.name;
      let url, msg;
      if (roleId) {
        url = `/admin/role/${roleId}`;
        msg = "修改成功";
      } else {
        url = "admin/role/";
        msg = "新建成功";
      }
      let result = await this.$axios.post(url, { name: name });
      if (result.data.status != 0) return;
      this.$message(msg);
      this.dialogShow = false;
      this.get_roles();
    },
    async sureAdd() {
      let roleId = this.added.id;
      let role = this.added;
      let result = await this.$axios.post(`/admin/role/${roleId}`, {
        permissions: role.permissions
      });
      if (result.data.status != 0) return;
      this.added = {};
      this.$message("修改成功");
      this.dialogShow = false;
      this.roleDialogShow = false;
      this.get_roles();
    },
    handleChange(value) {
    },
    noAdd() {
      this.dialogShow = false;
      this.roleDialogShow = false;
      this.added = {};
    },
    async edit_role(index, row) {
      let role = row[index];
      if (role.is_admin) {
        this.$alert("管理员模板禁止编辑！", "注意", {
          type: "info"
        });
        return;
      }
      let role_id = role.id;
      this.added = JSON.parse(JSON.stringify(role));
      this.dialogShow = true;
    },
    add_line() {
      this.added = {};
      this.dialogShow = true;
    },
    async delete_role(index, rows) {
      if (rows[index].is_admin) {
        this.$alert("管理员模板无法被删除！", "注意", {
          type: "error"
        });
        return;
      }
      let confirmed = await this.$confirm("确定要删除吗？", "请确认", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      });
      if (confirmed != "confirm") {
        return;
      }
      let role_id = rows[index].id;
      if (role_id) {
        let resp = await this.$axios.delete(`/admin/role/${role_id}/`);
        rows.splice(index, 1);
      } else {
        rows.splice(index, 1);
      }
      this.$message("删除成功");
    },
    async get_roles() {
      let params = this.search;
      let resp = await this.$axios.get("/admin/role/", { params: params });
      let respData = resp.data;
      if (respData.status != 0) return;
      this.tableData = respData.data.list;
      this.total_page = respData.data.total_page;
      this.page = respData.data.page;
    }
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
.added-input {
  width: 80%;
}
.el-form-item {
  text-align: left;
}

.el-dialog__body {
  padding: 10px 20px;
}
</style>
