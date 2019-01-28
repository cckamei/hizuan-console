<template>
  <div class="ActiveRecommend">
    
    <div style="display: block; float: left;">
        <span>活动推荐</span>
        <el-button cricle type="primary" @click="add_activeRecommend">新增</el-button>
    </div>
    <br> <br>
    <el-table :data="tableData" border>
      <el-table-column label="序号" width="200px" align="center" sortable prop="sort_id">
        <template slot-scope="scope">
          <el-input-number size="mini" :min="1" :max="999" v-model="scope.row.sort_id"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column label="活动项" width="200px" align="center">
        <template slot-scope="scope">
          <el-select v-model="scope.row.activate_banner_id" placeholder="请选择">
            <el-option v-for="item in activeType" :key="item.activate_banner_id" :label="item.name" :value="item.activate_banner_id"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="200px" align="center">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.active" active-text="激活" inactive-text="关闭"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200px" align="center">
        <template slot-scope="scope">
          <el-button @click.native.prevent="save_active(scope.$index, tableData)" type="text" size="small">保存</el-button>
          <el-button @click.native.prevent="delete_active(scope.$index, tableData)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-sizes="[10, 20, 30, 40]" layout="sizes, total,  prev, pager, next, jumper" :page-count="total_page">
    </el-pagination>
  </div>
</template>

<script>
    import { UPLOAD_IMG_URL } from "../global.js";
    import Vue from "vue";

    export default {
        name: 'ActiveRecommend',
        data (){
            return {
                tableData: [
                    // {
                    //     id: "5b55a4511d41c80e50eea8e4",
                    //     sort_id: 2,
                    //     activate_banner_id: "5b5800ec1d41c883487bdc29",
                    //     // img: "http://www.jj20.com/js/2017ad.jpg",
                    //     active: false
                    //     // name: '充值大优惠'
                    // }
                ],
                activeType: [],
                total: 9,
                page: 1,
                size: 10
            }
        },
        mounted() {
            this.get_activeRecommend();
        },
        methods: {
            async get_activeRecommend (){
                let res = await this.$axios.get('/admin/recommend/');
                this.activeType = res.data.data.list_activate;
                this.tableData = res.data.data.list;
                this.total = res.data.data.total;
            },
            add_activeRecommend: function (){  //新增
                this.tableData.unshift({
                    activate_banner_id: '',
                    active: false,
                    id: '',
                    // name: "title",
                    sort_id: 1
                });
            },
            async save_active (index, row){ //保存
                let confirmed = await this.$confirm("确定要修改吗？", "请确认", {  //执行完后再执行后续操作，此处 await 相当于写了一个 confirm的回调
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                });
                if (confirmed != "confirm") {
                    return;
                };
                let active = row[index];
                let active_id = active.id;
                if (active_id) {
                    let result = await this.$axios.post(`/admin/recommend/${active_id}/`, { //修改后保存
                        active: active.active,
                        // img: active.img,
                        // name: active.name,
                        sort_id: active.sort_id,
                        activate_banner_id: active.activate_banner_id
                    });
                    if (result.data.code == 0) {
                        this.$message("修改成功");
                        this.get_activeRecommend(); //修改成功后初始化页面一次
                    }
                }else {
                    // 新增
                    let result = await this.$axios.post("/admin/recommend/", {
                        active: active.active,
                        // img: active.img,
                        // name: active.name,
                        sort_id: active.sort_id,
                        activate_banner_id: active.activate_banner_id
                    });
                    if (result.data.code == 0) {
                        let active_id = result.data.data.id;
                        this.$message("新增成功");
                        Vue.set(row[index], "id", active_id);
                    }
                }
            },
            async delete_active(index, rows) {
                let confirmed = await this.$confirm("确定要删除吗？", "请确认", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                });
                if (confirmed != "confirm") {
                    return;
                }
                let active_id = rows[index].id;
                if (active_id) {
                    let res = await this.$axios.delete(`/admin/recommend/${active_id}/`);
                    rows.splice(index, 1);
                } else {
                    rows.splice(index, 1);
                }
                this.$message("删除成功");
            },
            //当前页码改变时触发
            async handleCurrentChange(val) {
                let param = 'p=' + val + '&offset=' + this.size;
                let resp = await this.$axios.get("/admin/recommend/?" + param);
                let respData = resp.data;
                if (respData.code != 0) return;
                this.tableData = respData.data.list;
                this.total = respData.data.total;
            },
            //每页条数改变时触发
            async handleSizeChange(val) {
                this.size = val;
                let param = 'p=' + this.page + '&offset=' + val;
                let resp = await this.$axios.get("/admin/recommend/?" + param);
                let respData = resp.data;
                if (respData.code != 0) return;
                this.tableData = respData.data.list;
                this.total = respData.data.total;
            }   
        }
    }
</script>

<style scoped>

</style>