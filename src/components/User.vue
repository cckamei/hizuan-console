<template>
  <div id="cart">
    <div class="search-box">
      <div class="search-condition">
        <div style="width: 80%;">
          <el-row :gutter="25">
            <el-col :span="6">
              <div class="search-text">
                <span>用户卡号</span>
                <el-input placeholder="按用户卡号搜索" class="search-input" v-model="search.vip_code"></el-input>
              </div>
            </el-col>

            <el-col :span="6">
              <div class="search-text">
                <span>姓名</span>
                <el-input placeholder="按姓名搜索" class="search-input" v-model="search.name"></el-input>
              </div>
            </el-col>

            <el-col :span="6">
              <div class="search-text">
                <span>用户手机</span>
                <el-input placeholder="按用户手机搜索" class="search-input" v-model="search.phone"></el-input>
              </div>
            </el-col>

            <el-col :span="6">
              <div class="search-text">
                <span>珠宝顾问姓名</span>
                <el-input placeholder="按姓名搜索" class=" search-input" v-model="search.advisor_name"></el-input>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="search-text">
                <span>创建日期</span>
                <el-date-picker v-model="search.start" value-format="yyyy-MM-dd" type="date" placeholder="选择日期" format="yyyy年MM月dd日">
                </el-date-picker>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="search-text">
                <span>至</span>
                <el-date-picker v-model="search.end" value-format="yyyy-MM-dd" type="date" placeholder="选择日期" format="yyyy 年MM月dd日">
                </el-date-picker>
              </div>
            </el-col>

          </el-row>
        </div>
        <div style="width:20%">

          <div class="search-text">
            <el-button type="primary" @click="load_user()">查询</el-button>
          </div>

        </div>
      </div>

    </div>
    <div class="search-table">
      <el-table :data="tableData" stripe max-height="600" align="center">
        <el-table-column label="用户卡号" prop="vip_code" align="center" fixed="left">
        </el-table-column>
        <el-table-column label="姓名" prop="name" align="center" fixed="left">
        </el-table-column>
        <el-table-column label="微信OPENID" align="center" prop="openid">
        </el-table-column>
        <el-table-column label="性别" align="center">
          <template slot-scope="scope">
            <span v-show="scope.row.gender==1">男</span>
            <span v-show="scope.row.gender==0">女</span>
          </template>
        </el-table-column>
        <el-table-column label="积分" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.score || "0"}}</span>
          </template>
        </el-table-column>
        <el-table-column label="用户手机" align="center" prop="phone">
        </el-table-column>
        <el-table-column label="店代码" align="center" prop="store_code">
            <template slot-scope="scope">
                <span>{{ scope.row.store_code || "C6"}}</span>
            </template>
        </el-table-column>
        <el-table-column label="珠宝顾问姓名" align="center" prop="advisor_name">
        </el-table-column>
        <el-table-column label="是否分销商" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.is_distributor">是</span>
            <span v-else>否</span>
          </template>
        </el-table-column>
        <el-table-column label="注册分销商日期" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.is_distributor">
                <el-button type="text" @click="cancelDistributer(scope.$index, tableData)">{{scope.row.register_distributer_time}}</el-button>
              </span>
              <span v-else>{{scope.row.register_distributer_time}}</span>
            </template>
        </el-table-column>
        <el-table-column label="操作" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button @click.native.prevent="set_distribute(scope.$index, tableData)" type="text" size="small">设置分销商</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination @current-change="handleCurrentChange" :current-page.sync="search.page" :page-size="search.size" layout="prev, pager, next, jumper" :page-count="total_page">
      </el-pagination>
    </div>

    <el-dialog title="设置分销商" :visible.sync="dialogShow" width="30%">
      <el-form label-width="120px">
        <el-form-item label="VIP卡号:">
          <span class="added-input">{{added.vip_code}}</span>
        </el-form-item>
        <el-form-item label="所属门店:">
          <el-select class="added-input" v-model="added.distributor_store">
            <el-option v-for="item in stores" :label="item.name" :key="item.id" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="姓名:">
          <el-input class="added-input" v-model="added.name"></el-input>
        </el-form-item>
        <el-form-item label="用户手机:">
          <el-input class="added-input" v-model="added.phone"></el-input>
        </el-form-item>
        <el-form-item label="银行卡号:">
          <el-input class="added-input" v-model="added.bankcard"></el-input>
        </el-form-item>
        <el-form-item label="开户行:">
          <el-input class="added-input" v-model="added.bank"></el-input>
        </el-form-item>
      </el-form>
      <el-button cricle type="primary" @click="sureAdd()">确定</el-button>
      <el-button cricle @click="noAdd()">取消</el-button>
    </el-dialog>

  </div>
</template>

<script>
import Vue from "vue";

export default {
  data() {
    return {
      dates: [],
      dialogShow: false,
      search: {},
      added: {},
      tableData: [],
      count: 0,
      total_page: 0,
      stores: []
    };
  },
  created() {
    // this.search = this.$route.query;
  },
  mounted() {
    this.loadStores();
    this.load_user();
  },
  methods: {
    async loadStores() {
      let resp = await this.$axios.get("/admin/store/");
      let respData = resp.data;
      if (respData.status != 0) return;
      this.stores = respData.data;
    },
    async handleCurrentChange(val) {
      this.search.page = val;
      this.load_user();
    },
    set_distribute(index, rows) {
      this.added = JSON.parse(JSON.stringify(rows[index]));
      this.added.is_distributor = true;
      this.dialogShow = true;
    },
    async sureAdd() {
      let userId = this.added.id;
      let user = this.added;
      console.log(user);
      let result = await this.$axios.post(`/admin/user/${userId}`, user);
      if (result.data.status != 0) return;
      this.added = {};
      this.$message("修改成功");
      this.dialogShow = false;
      this.load_user();
    },
    noAdd() {
      this.dialogShow = false;
      this.added = {};
    },
    async edit_user(index, row) {
      let user = row[index];
      let user_id = user.id;
      this.added = JSON.parse(JSON.stringify(user));
      this.added.goods_id = this.added.content.id;
      this.dialogShow = true;
    },
    add_line() {
      this.added = {};
      this.dialogShow = true;
    },
    async cancelDistributer(index, rows) {
      let row = rows[index];
      let row_id = row.id;
      await this.$confirm("确定要取消分销商资格吗");
      let resp = await this.$axios.post(`/admin/user/${row_id}/`, {
        is_distributor: false
      });
      if (resp.data.status != 0) return;
      Vue.set(rows[index], "is_distributor", false);
      console.log("操作成功");
    },
    async delete_user(index, rows) {
      let confirmed = await this.$confirm("确定要删除吗？", "请确认", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      });
      if (confirmed != "confirm") {
        return;
      }
      let user_id = rows[index].id;
      if (user_id) {
        let resp = await this.$axios.delete(`/admin/user/${user_id}/`);
        rows.splice(index, 1);
      } else {
        rows.splice(index, 1);
      }
      this.$message("删除成功");
    },
    async load_user() {
      let params = this.search;
      let resp = await this.$axios.get("/admin/user/", {
        params: params
      });
      let respData = resp.data;
      if (respData.status != 0) return;
      this.tableData = respData.data.list;
      this.total_page = respData.data.total_page;
      this.count = respData.data.count;
    }
  }
};
</script>

<!-- Add"scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.search-condition {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  padding: 0 30px 0 10px;
  > div:nth-child(2) {
    display: flex;
    height: 100%;
    justify-content: center;
    align-content: center;
  }
  .search-text {
    padding-top: 30px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    span {
      // width: 150px;
      font-size: 14px;
      display: block;
      width: 30%;
      text-align: right;
      margin-right: 15px;
    }
  }
  .sel {
    justify-content: flex-end;
  }
}
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
.search-input {
  width: 70%;
  // margin-right: 30px;
}
</style>
