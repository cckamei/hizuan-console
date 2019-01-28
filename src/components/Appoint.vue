<template>
  <div id="cart">
    <div class="search-box">
      <div class="search-condition">
        <el-row :gutter="25">

          <el-col :span="6">
            <div class="search-main">
              <span class="search-text">用户卡号</span>
              <el-input placeholder="按用户卡号搜索" class="search-input" v-model="search.vip_code"></el-input>
            </div>
          </el-col>

          <el-col :span="6">
            <div class="search-main">
              <span class="search-text">姓名</span>
              <el-input placeholder="按姓名搜索" class="search-input" v-model="search.name"></el-input>
            </div>
          </el-col>

          <el-col :span="6">
            <div class="search-main">
              <span class="search-text">用户手机</span>
              <el-input placeholder="按用户手机搜索" class="search-input" v-model="search.phone"></el-input>
            </div>
          </el-col>

          <el-col :span="6">
            <div class="search-main">
              <span class="search-text">预约门店</span>
              <el-select class="search-input" v-model="search.store_id">
                <el-option value="" label="全部"></el-option>
                <el-option v-for="item in stores" :key="item.id" :value="item.id" :label="item.name"></el-option>
              </el-select>
            </div>
          </el-col>

          <el-col :span="6">
            <div class="search-main">
              <span class="search-text">预约状态</span>
              <el-select class="search-input" v-model="search.status">
                <el-option label="全部" value=""></el-option>
                <el-option v-for="(value, key) in AppointStatus" :key="key" :value="key" :label="value"></el-option>
              </el-select>
            </div>
          </el-col>

          <el-col :span="6">
            <div class="search-main">
              <span class="search-text">预约日期</span>
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
        <el-button cricle type="primary" @click="load_appoint()">查询</el-button>
      </div>
    </div>
    <div class="search-table">
      <el-table :data="tableData" stripe align="center">
        <el-table-column label="用户卡号" prop="user.vip_code" align="center" fixed="left">
        </el-table-column>
        <el-table-column label="姓名" prop="name" align="center" fixed="left">
        </el-table-column>
        <el-table-column label="性别" align="center">
          <template slot-scope="scope">
            <span v-show="scope.row.sex == 1">男</span>
            <span v-show="scope.row.sex == 0">女</span>
          </template>
        </el-table-column>
        <el-table-column label="用户手机" align="center" prop="phone">
        </el-table-column>
        <el-table-column label="地区" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.store.province}} {{scope.row.store.city}}</span>
          </template>
        </el-table-column>
        <el-table-column label="预约门店" align="center" prop="store.name">
        </el-table-column>
        <el-table-column label="预约日期" align="center" prop="appoint_time">
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <span>{{AppointStatus[scope.row.status]}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button @click.native.prevent="showDetail(scope.$index, tableData)" type="text" size="small">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination @current-change="handleCurrentChange" :current-page.sync="search.page" :page-size="search.size" layout="prev, pager, next, jumper" :page-count="total_page">
      </el-pagination>
    </div>

    <el-dialog title="查看详情" :visible.sync="dialogShow" width="25%">
      <div class="xianT">
        <div> <span class="left-algin">预约门店:</span> <span class="right-algin" style="font-weight: 500;">{{added.store.name}}</span></div>
        <div> <span class="left-algin">预约日期:</span> <span class="right-algin" style="font-weight: 500">{{added.appoint_time}}</span></div>
        <div> <span class="left-algin">预约类型:</span> <span class="right-algin" style="font-weight: 500"> {{AppointType[added.appoint_type]}} </span></div>
        <div> <span class="left-algin">门店负责人:</span> <span class="right-algin" style="font-weight: 500">{{added.store.mananger}}</span></div>
        <div> <span class="left-algin">负责人联系方式:</span> <span class="right-algin" style="font-weight: 500">{{added.store.phone}}</span></div>
        <div> <span class="left-algin"> 用户姓名:</span> <span class="right-algin" style="font-weight: 500">{{added.name}}</span></div>
        <div> <span class="left-algin">用户手机:</span> <span class="right-algin" style="font-weight: 500">{{added.phone}}</span></div>
        <div> <span class="left-algin">用户留言:</span> <span class="right-algin" style="font-weight: 500">{{added.ext}}</span></div>
      </div>
      <br><br><br>
      <el-button v-show="added.status==0" cricle type="primary" @click="passItem()">通过</el-button>
      <el-button v-show="added.status==0" cricle @click="refuseItem()">拒绝</el-button>
      <el-button v-show="added.status != 0" cricle @click="sureItem()">确定</el-button>
    </el-dialog>

  </div>
</template>

<script>
import Vue from "vue";
import { AppointStatus, AppointType } from "../global.js";

export default {
  data() {
    return {
      AppointType: AppointType,
      AppointStatus: AppointStatus,
      dialogShow: false,
      search: {},
      added: { store: {} },
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
    this.load_appoint();
  },
  methods: {
    sureItem() {
      this.dialogShow = false;
    },
    async loadStores() {
      let resp = await this.$axios.get("/admin/store/");
      let respData = resp.data;
      if (respData.status != 0) return;
      this.stores = respData.data;
    },
    async handleCurrentChange(val) {
      this.search.page = val;
      this.load_appoint();
    },
    async passItem() {
      let appoint_id = this.added.id;
      let resp = await this.$axios.post(`/admin/appoint/${appoint_id}/`, {
        status: 2
      });
      if (resp.data.status != 0) return;
      this.$message("已通过");
      this.added.status = 2;
    },
    async refuseItem() {
      let appoint_id = this.added.id;
      let resp = await this.$axios.post(`/admin/appoint/${appoint_id}/`, {
        status: 4
      });
      if (resp.data.status != 0) return;
      this.$message("已拒绝");
      this.added.status = 4;
    },
    showDetail(index, rows) {
      this.added = rows[index];
      this.dialogShow = true;
    },
    async load_appoint() {
      let params = this.search;
      let resp = await this.$axios.get("/admin/appoint/", {
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
.left-algin {
  width: 35%;
  text-align: right;
}
.right-algin {
  width: 55%;
  text-align: left;
}
.el-aside {
  color: #333;
}
.added-input {
  width: 180px;
}
.xianT {
  width: 80%;
  display: flex;
  flex-wrap: wrap;
  margin: auto;
  > div {
    display: flex;
    margin-top: 10px;
    width: 100%;
    font-size: 14px;
    font-weight: bold;
    justify-content: space-between;
  }
}
</style>
