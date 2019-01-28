<template>
  <div id="order">
    <div class="search-box">
      <div class="search-condition">
        <div style="width: 80%;">
          <el-row :gutter="25">
            <el-col :span="6">
              <div class="search-text">
                <span>订单编号</span>
                <el-input class="search-input" placeholder="按订单编号搜索" v-model="search.id"></el-input>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="search-text">
                <span>订单状态</span>
                <el-select v-model="search.status">
                  <el-option label="全部" value=""></el-option>
                  <el-option v-for="(value, key) in ORDER_STATUS" :key="key" :label="value" :value="key"></el-option>
                </el-select>
              </div>

            </el-col>
            <el-col :span="6">
              <div class="search-text">
                <span>用户手机号</span>
                <el-input class="search-input" placeholder="按用户手机号搜索" v-model="search.phone"></el-input>

              </div>

            </el-col>
            <el-col :span="6">
              <div class="search-text">
                <span>用户卡号</span>
                <el-input class="search-input" placeholder="按用户卡号搜索" v-model="search.user_id"></el-input>
                <!-- <span>提成人</span> -->

              </div>

            </el-col>
            <el-col :span="6">
              <div class="search-text">
                <span>提成人</span>
                <el-input class="search-input" placeholder="按提成人搜索" v-model="search.ticheng_user"></el-input>

              </div>

            </el-col>
            <el-col :span="6">
              <div class="search-text">
                <span>创建日期</span>
                <el-date-picker format="yyyy年MM月dd日" value-format="yyyy-MM-dd" v-model="search.start" type="date" placeholder="选择日期">
                </el-date-picker>

              </div>

            </el-col>
            <el-col :span="6">
              <div class="search-text">
                <span>至</span>
                <el-date-picker format="yyyy年MM月dd日" value-format="yyyy-MM-dd" v-model="search.end" type="date" placeholder="选择日期">
                </el-date-picker>

              </div>

            </el-col>
          </el-row>
        </div>
        <div style="width:20%;">

          <div class="search-text">
            <el-button cricle type="primary" @click="search_orders()">查询</el-button>

          </div>

        </div>
      </div>

    </div>
    <div class="search-table">
      <el-table :data="tableData" stripe max-height="600" align="center">
        <el-table-column label="订单编号" width="250px" align="center" fixed="left">
          <template slot-scope="scope">
            <span class="text" @click="showOrderDetail(scope.$index, tableData)">{{scope.row.orderid}}</span>
          </template>
        </el-table-column>
        <el-table-column label="订单状态" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 0">待付款</span>
            <span v-else-if="scope.row.status === 2">待收货</span>
            <span v-else-if="scope.row.status == 3">已完成</span>
            <el-button v-else @click="showHandleOrder(scope.row)" type="text">{{ORDER_STATUS[scope.row.status]}}</el-button>
          </template>
        </el-table-column>

        <el-table-column label="支付方式" align="center">
          <template slot-scope="scope">
            <span>{{PAY_TYPE[scope.row.pay_type]}}</span>
          </template>
        </el-table-column>

        <el-table-column label="支付时间" prop="pay_time" align="center">
        </el-table-column>

        <el-table-column label="订单总金额" prop="order_all_fee" align="center">
        </el-table-column>

        <el-table-column label="订单折扣" align="center">
          <template slot-scope="scope">
            <span v-if="'coupon_info' in scope.row"> 满 {{scope.row.coupon_info['all_money']}} 减 {{scope.row.coupon_info['discount_money']}} 券</span>
          </template>
        </el-table-column>

        <el-table-column label="产品金额" prop="product_all_fee" align="center">
        </el-table-column>

        <el-table-column label="产品数量" prop="product_count" align="center">
        </el-table-column>

        <el-table-column label="物流金额" prop="logitics_fee" align="center"></el-table-column>

        <el-table-column label="物流信息" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" plain @click="showLogistics(scope.$index, tableData)">查看</el-button>
          </template>
        </el-table-column>

        <el-table-column label="用户手机" prop="user.phone" align="center"></el-table-column>
        <el-table-column label="用户卡号" prop="user.vip_code" align="center">

        </el-table-column>
        <el-table-column label="刻字" align="center">
          <template slot-scope="scope">
            <el-button v-if="scope.row.kezi" type="text" @click="showKezi(scope.$index, tableData)">有</el-button>
          </template>
        </el-table-column>
        <el-table-column label="提成总金额" align="center">
          <template slot-scope="scope">
            {{scope.row.ticheng.money}}
          </template>
        </el-table-column>
        <!-- <el-table-column label="提成人" align="center">
          <template slot-scope="scope">
            <span v-for="item in scope.row.ticheng.users">{{item}}</span>
          </template>
        </el-table-column> -->
      </el-table>

      <el-pagination @current-change="handleCurrentChange" :current-page.sync="search.page" :page-size="search.size" layout="prev, pager, next, jumper" :page-count="total_page">
      </el-pagination>
    </div>
    <el-dialog title="刻字详情" :visible.sync="keziDialogShow" width="40%">
      <div class="dlo">
        <el-table :data="added.goods_orders" align="center" stripe max-height="600">
          <el-table-column label="商品名称" align="center">
            <template slot-scope="scope" v-if="scope.row.kezi">{{scope.row.goods_name}}</template>
          </el-table-column>
          <el-table-column label="刻字" align="center">
            <template slot-scope="scope" v-if="scope.row.kezi">{{scope.row.remark.kezi}}

            </template>
          </el-table-column>
          <el-table-column label="刻字备注" align="center">
            <template slot-scope="scope" v-if="scope.row.kezi">{{scope.row.remark.yaoqiu}}</template>
          </el-table-column>
        </el-table>
      </div>

    </el-dialog>

    <el-dialog title="订单详情" :visible.sync="orderDetailDialogShow" width="80%">
      <el-table :data="added.goods_orders" align="center" stripe max-height="600" style="border:1px solid #ebeef5; border-bottom: none;">
        <el-table-column label="商品名称" prop="goods_name" align="center" width="230"></el-table-column>
        <el-table-column label="商品货号" prop="goods_merchant_code" align="center" width="170"></el-table-column>
        <el-table-column label="商品编号(SKU)" prop="sku_merchant_code" align="center" width="170"></el-table-column>
        <el-table-column label="公司模号" prop="mode_code" align="center" width="170"></el-table-column>
        <el-table-column label="商品价格" prop="goods_price" align="center"></el-table-column>
        <el-table-column label="商品件数" prop="goods_count" align="center"></el-table-column>
        <el-table-column label="提成比例" align="center">
          <template slot-scope="scope">{{scope.row.ticheng_percent}}%</template>
        </el-table-column>
        <el-table-column label="提成金额" align="center">
          <template slot-scope="scope" v-if="scope.row.ticheng">{{scope.row.ticheng * scope.row.goods_price / 100}}%</template>
        </el-table-column>
        <el-table-column label="提成人" align="center" prop="ticheng_user"></el-table-column>
      </el-table>

      <div class="modelBox">
        <div class="content">
          <div class="title" style="width: 10.5%;">用户留言:</div>
          <div class="main">
            {{(added.ext || {})['yaoqiu']}}
          </div>
        </div>
        <div class="btn-box">
          <el-button cricle type="primary" @click="sureOrderDetail()">确定</el-button>
        </div>
      </div>
      <!-- <span style="float:left; margin:20px;">用户留言: {{(added.ext || {})['yaoqiu']}}</span> <br>
      <el-button cricle type="primary" style="margin-top:70px" @click="sureOrderDetail()">确定</el-button> -->
    </el-dialog>

    <el-dialog title="物流详情" :visible.sync="logisticsDialogShow" stripe max-height="600" align="center" width="30%">
      <div class="modelBox" style="margin-top:0px;">
        <div class="content">
          <div class="title">物流公司:</div>
          <div class="main">
            {{added.logitics_name}}
          </div>
          <div class="title">物流费用:</div>
          <div class="main">
            {{added.logitics_fee}}
          </div>

          <div class="title">物流单号:</div>
          <div class="main">
            {{added.logitics_id}}
          </div>

          <div class="title">客户地址:</div>
          <div class="main" v-if="added.address">
            {{added.address.province}} {{added.address.city}} {{added.address.district}} {{added.address.street}}
          </div>

        </div>
        <div class="btn-box">
          <el-button cricle type="primary" style="margin-top:10px" @click="sureLogisticsDialog()">确定</el-button>
        </div>
      </div>
    </el-dialog>

    <el-dialog :title="handleOrderTitle" :visible.sync="handleOrderDialogShow" stripe max-height="600" align="center">
      <el-table :data="added.goods_orders" style="border:1px solid #ebeef5; border-bottom: none;">
        <el-table-column label="商品名称" prop="goods_name" align="center"></el-table-column>
        <el-table-column label="商品价格" prop="goods_price" align="center"></el-table-column>
        <el-table-column label="商品件数" prop="goods_count" align="center"></el-table-column>
      </el-table>

      <!-- 待发货 -->
      <template v-if="added.status == 1">

        <div class="modelBox">
          <div class="content">
            <div class="title" style="padding-top: 20px;">物流单号:</div>
            <div class="main">
              <el-input style="width:200px;" v-model="added.logistic_num"></el-input>
            </div>
          </div>
          <div class="btn-box">
            <el-button cricle type="primary" style="margin-top:10px" @click="sureFaHuo()">确认发货</el-button>
          </div>
        </div>
      </template>

      <!-- 已取消 -->
      <template v-if="added.status == 8">

        <div class="modelBox">
          <div class="content">
            <div class="title">用户取消时间:</div>
            <div class="main">
              {{added.updated_at}}
            </div>
          </div>
          <div class="btn-box">
            <el-button cricle type="primary" style="margin-top:10px" @click="sureOrderHandle()">确定</el-button>
          </div>
        </div>
      </template>

      <!-- 申请退款 -->
      <template v-if="added.status == 4">

        <div class="modelBox">
          <div class="content">
            <div class="title">申请原因:</div>
            <div class="main">
              {{RefundChoice[added.ext.refund.choice]}}
            </div>
            <div class="title">问题描述:</div>
            <div class="main">
              {{added.ext.refund.desc}}
            </div>

            <div class="title">联系人:</div>
            <div class="main">
              {{added.ext.refund.name}}
            </div>

            <div class="title">联系电话:</div>
            <div class="main">
              {{added.ext.refund.phone}}
            </div>
          </div>

          <div class="btn-box">
            <el-button cricle type="primary" style="margin-top:10px" @click="sureRefund()">确认退款</el-button>
            <el-button cricle type="primary" style="margin-top:10px; margin-left:10px;" @click="refuseRefund()">拒绝退款</el-button>
          </div>
        </div>
      </template>

      <!-- 已退款 -->
      <template v-if="added.status == 6">
        <div class="modelBox">
          <div class="content">
            <div class="title">申请原因:</div>
            <div class="main">
              {{RefundChoice[added.ext.refund.choice]}}
            </div>
            <div class="title">问题描述:</div>
            <div class="main">
              {{added.ext.refund.desc}}
            </div>

            <div class="title">联系人:</div>
            <div class="main">
              {{added.ext.refund.name}}
            </div>

            <div class="title">联系电话:</div>
            <div class="main">
              {{added.ext.refund.phone}}
            </div>

            <div class="title">退款时间:</div>
            <div class="main">
              {{added.updated_at}}
            </div>
            <div class="title">批准账户:</div>
            <div class="main">
              {{added.ext.refund_admin.name}}
            </div>
          </div>

          <div class="btn-box">
            <el-button cricle type="primary" style="margin-top:10px" @click="sureOrderHandle()">确定</el-button>
          </div>
        </div>
      </template>

    </el-dialog>

  </div>
</template>

<script>
  import { PAY_TYPE, ORDER_STATUS, RefundChoice } from "@/global.js";
  import router from "../router/index.js";
  import Vue from "vue";

  export default {
    data() {
      return {
        RefundChoice: RefundChoice,
        handleOrderTitle: "",
        handleOrderDialogShow: false,
        keziDialogShow: false,
        orderDetailDialogShow: false,
        logisticsDialogShow: false,
        ORDER_STATUS: ORDER_STATUS,
        PAY_TYPE: PAY_TYPE,
        tableData: [],
        search: { size: 15 },
        count: 0,
        total_page: 0,
        added: {}
      };
    },
    created() { },
    mounted() {
      this.get_orders();
    },
    methods: {
      sureOrderHandle() {
        this.handleOrderDialogShow = false;
        this.added = {};
      },
      async sureRefund() {
        let order_id = this.added.id;
        let result = await this.$axios.post(`/admin/order/${order_id}/`, {
          action: "refund"
        });
        if(result.data.status == 0) {
          this.handleOrderDialogShow = false;
          this.added = {};
          this.$message("退款成功");
          this.get_orders();
        }
      },
      async refuseRefund() {
        let order_id = this.added.id;
        let result = await this.$axios.post(`/admin/order/${order_id}/`, {
          action: "refuseRefund"
        });
        if(result.data.status == 0) {
          this.handleOrderDialogShow = false;
          this.added = {};
          this.$message("已拒绝退款");
          this.get_orders();
        }
      },
      async sureFaHuo() {
        let logistic_num = this.added.logistic_num;
        let order_id = this.added.id;
        if(logistic_num.length < 3) {
          this.$alert("请填写正确的运单号");
        }
        let result = await this.$axios.post(`/admin/order/${order_id}/`, {
          action: "fahuo",
          logistic_num: logistic_num
        });
        if(result.data.status == 0) {
          this.handleOrderDialogShow = false;
          this.added = {};
          this.$message("发货成功");
        }
      },
      showHandleOrder(row) {
        this.added = row;
        if(this.added.status == 1) {
          this.handleOrderTitle = '发货详情';
        } else if(this.added.status == 8) {
          this.handleOrderTitle = '取消详情';
        } else if(this.added.status == 6 || this.added.status == 4) {
          this.handleOrderTitle = '退款详情';
        } else {
          this.handleOrderTitle = '订单详情';
        };
        this.handleOrderDialogShow = true;
      },
      showKezi(index, rows) {
        this.added = rows[index];
        this.keziDialogShow = true;
      },
      showOrderDetail(index, rows) {
        this.added = rows[index];
        this.orderDetailDialogShow = true;
      },
      sureOrderDetail() {
        this.added = {};
        this.orderDetailDialogShow = false;
      },
      sureLogisticsDialog() {
        this.added = {};
        this.logisticsDialogShow = false;
      },
      showLogistics(index, rows) {
        let row = rows[index];
        this.logisticsDialogShow = true;
        this.added = {
          logitics_name: row.logistics.name,
          logitics_fee: row.logitics_fee,
          logitics_id: row.logistics.id,
          address: row.address || {}
        };
      },
      async handleCurrentChange(val) {
        this.search.page = val;
        this.get_orders();
      },
      search_orders() {
        this.search.page = 1;
        this.get_orders();
      },
      async get_orders() {
        let search = this.search;
        let resp = await this.$axios.get("/admin/order/", { params: search });
        let respData = resp.data;
        if(respData.status != 0) return;
        this.tableData = respData.data.list;
        this.total_page = respData.data.total_page;
        this.count = respData.data.count;
      }
      //当前页码改变时触发
    }
  };
</script>

<!-- Add"scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .text {
    color: #409eff;
    cursor: pointer;
  }
  .dlo {
    height: 600px;
    overflow-y: auto;
  }
  .modelBox {
    margin-top: 20px;
    width: 100%;
    .content {
      border: 1px solid #ebeef5;
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      font-size: 14px;
      .title {
        // border: 1px solid #ebeef5;
        color: #909399;
        text-align: right;
        width: 21%;
        font-weight: 800;
        padding: 10px;
        padding-top: 10px;
        padding-bottom: 10px;
        padding-left: 10px;
        padding-right: 10px;
      }
      .main {
        text-align: left;
        font-weight: 500;
        width: 79%;
        padding: 10px;
      }
    }
    .btn-box {
      width: 100%;
      text-align: center;
      margin-top: 30px;
    }
  }
  .search-condition {
    display: flex;
    flex-wrap: wrap;
    font-size: 14px;
    .title {
      width: 50%;
      font-weight: 800;
      padding: 10px;
    }
    .main {
      font-weight: 500;
      width: 50%;
      padding: 10px;
    }
    .btn-box {
      width: 100%;
      text-align: center;
      margin-top: 30px;
    }
  }

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
    width: 180px;
  }
  .search-input {
    width: 70%;
    // margin-right: 30px;
  }
  .el-input {
    width: 70% !important;
  }
</style>
