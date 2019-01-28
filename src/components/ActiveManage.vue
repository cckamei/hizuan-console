<template>
  <div class="ActiveManage">
    <el-dialog title="上传图片" :visible.sync=isShowDialog>
      <el-upload ref="el-upload" v-bind:action="upload_url" drag auto-upload :on-success="handleActiveSuccess" :on-error="handleActiveError">
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
    </el-dialog>
    <el-dialog title="提示信息" :visible.sync=isMessageShow>
        <img src="../assets/message.png">
    </el-dialog>
    <div style="display: block; float: left;">
    <span>活动管理</span>
    <el-button cricle type="primary" @click="add_activeManage">新增</el-button>
    </div>
    <br> <br>
    <el-table :data="tableData" border>
      <el-table-column label="序号" width="150px" align="center" sortable prop="sort_id">
        <template slot-scope="scope">
          <el-input-number size="mini" :min="1" :max="999" v-model="scope.row.sort_id"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column label="活动类型" width="150px" align="center">
        <template slot-scope="scope">
          <!-- <el-input-number size="mini" :min="1" :max="999" v-model="scope.row.sort_id"></el-input-number> -->
          <el-select v-model="scope.row.title" placeholder="请选择">
            <el-option v-for="item in activeType" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="活动名称" width="200px" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.name"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="活动标签" width="150px" align="center">
        <template slot-scope="scope">
          <!-- <el-input v-model="scope.row.title"></el-input> -->
          <span v-if="scope.row.add_title == 0">预热</span>
          <span v-if="scope.row.add_title == 2">已结束</span>
          <el-select v-model="scope.row.add_title" placeholder="请选择" v-if="scope.row.add_title != 0 && scope.row.add_title != 2">
            <el-option v-for="item in activeTags" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="图片" width="300px" align="center">
        <template slot-scope="scope">
          <img v-bind:src="scope.row.img" alt="" style="display:inline-block; max-height:100px;margin:0;padding:0;">
          <el-button size="mini" @click="isShowDialogShow(scope.$index)">上传</el-button>
        </template>
      </el-table-column>
      <el-table-column label="活动日期" width="250px" align="center">
        <template slot-scope="scope">
          <!-- <el-input v-model="scope.row.title"></el-input> -->
          <span>开始日期</span>
          <el-date-picker v-model="scope.row.start_time" type="datetime" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm"></el-date-picker>
          <span>结束日期</span>
          <el-date-picker v-model="scope.row.end_time" type="datetime" placeholder="选择日期时间"  value-format="yyyy-MM-dd HH:mm"></el-date-picker>
        </template>
      </el-table-column>
      <el-table-column label="链接" width="300px" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.command"></el-input>
          <el-button size="mini" @click="promptMessage">提示信息</el-button>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="150px" align="center">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.active" active-text="激活" inactive-text="关闭"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100px" align="center">
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
        name: 'ActiveManage',
        data (){
            return {
                tableData: [
                    // {
                    // id: 1,
                    // sort_id: 2,
                    // name: "title",
                    // img: "http://www.jj20.com/js/2017ad.jpg",
                    // link: "http://www.baidu.com/",
                    // active: true,
                    // title: 0,
                    // add_title: 0,
                    // start_time: '',
                    // end_time: ''
                    // }
                ],
                activeType: [{value: 0,label: '普通'},{value: 1,label: '循环'}],
                activeTags: [{value: '推荐',label: '推荐'},{value: '热门',label: '热门'}],
                isShowDialog: false,
                isMessageShow: false,
                upload_url: UPLOAD_IMG_URL,
                uploadIndex: null,
                total: 9,
                page: 1,
                size: 10
            }
        },
        mounted() {
            this.get_activeManage();
        },
        methods: {
            async get_activeManage (){
                let res = await this.$axios.get("/admin/hot_banner");
                let resData = res.data;
                console.log(resData);
                if (resData.code != 0) return;
                this.tableData = resData.data.list;
                this.total = resData.data.total;
            },
            add_activeManage: function (){ //新增
                this.tableData.unshift({
                    banner_title: 0,
                    sort_id: 1,
                    name: "title",
                    img: "",
                    command: "",
                    active: false,
                    title: 0,
                    add_title: '推荐',
                    start_time: '',
                    end_time: '',
                    login: 1
                });
            },
            isShowDialogShow: function (index){
                this.uploadIndex = index;
                this.isShowDialog = true;
            },
            handleActiveSuccess: function (res, file, fileList){
                console.log(res);
                // 渲染table row
                let imgUrl = res.url;
                let row = this.tableData[this.uploadIndex];
                console.log(row);
                // 删除已上传文件
                this.$refs["el-upload"].clearFiles();
                Vue.set(this.tableData[this.uploadIndex], "img", imgUrl);
                // 关闭上传窗口
                this.isShowDialog = false;
            },
            handleActiveError: function (err, file, fileList){
                console.log(err);
            },
            promptMessage: function (){  //点击之后显示提示信息
                this.isMessageShow = true;
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
                    console.log("正在修改");
                    let result = await this.$axios.post(`/admin/hot_banner/${active_id}/`, { //修改后保存
                        active: active.active,
                        add_title: active.add_title,
                        banner_title: active.banner_title,
                        end_time: active.end_time,
                        img: active.img,
                        command: active.command,
                        name: active.name,
                        sort_id: active.sort_id,
                        start_time: active.start_time,
                        title: active.title,
                        login: active.login
                    });
                    console.log(result.data);
                    if (result.data.code == 0) {
                        this.$message("修改成功");
                        this.get_activeManage(); //修改成功后初始化页面一次
                    }
                }else {
                    // 新增
                    let result = await this.$axios.post("/admin/hot_banner/", {
                        active: active.active,
                        add_title: active.add_title,
                        banner_title: active.banner_title,
                        end_time: active.end_time,
                        img: active.img,
                        command: active.command,
                        name: active.name,
                        sort_id: active.sort_id,
                        start_time: active.start_time,
                        title: active.title,
                        login: active.login
                    });
                    if (result.data.code == 0) {
                        let active_id = result.data.data.id;
                        console.log(active_id);
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
                console.log(rows[index].title);
                let active_id = rows[index].id;
                if (active_id) {
                    let res = await this.$axios.delete(`/admin/hot_banner/${active_id}/`);
                    rows.splice(index, 1);
                } else {
                    rows.splice(index, 1);
                }
                this.$message("删除成功");
            },
            //当前页码改变时触发
            async handleCurrentChange(val) {
                // console.log('aa',val,this.size);
                let param = 'p=' + val + '&offset=' + this.size;
                let resp = await this.$axios.get("/admin/hot_banner/?" + param);
                // console.log(resp.data);
                let respData = resp.data;
                if (respData.code != 0) return;
                this.tableData = respData.data.list;
                this.total = respData.data.total;
            },
            //每页条数改变时触发
            async handleSizeChange(val) {
                this.size = val;
                let param = 'p=' + this.page + '&offset=' + val;
                let resp = await this.$axios.get("/admin/hot_banner/?" + param);
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
