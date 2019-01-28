<template>
  <div id="add_goods" style="text-align:left;">
    <div class="form">
      <el-tabs v-model="activeGoodsTab" @tab-click="handleTabClick" type="border-card">
        <el-tab-pane label="商品信息" name="1">
          <el-button cricle type="primary" style="float:right;" @click.native.prevent="save_goods()">保存</el-button>
          <h3>商品状态</h3>
          <el-form label-width="150px">
            <el-form-item label="销售状态">
              <el-radio v-model="goods.active" :label="true">上架</el-radio>
              <el-radio v-model="goods.active" :label="false">下架</el-radio>
            </el-form-item>
          </el-form>
          <hr>
          <h3>商品参数</h3>
          <el-form label-width="150px">

            <el-form-item label="商品类型">
              <el-radio v-model="goods.is_diamond" :label="true">钻石商品</el-radio>
              <el-radio v-model="goods.is_diamond" :label="false">非钻石商品</el-radio>
            </el-form-item>

            <el-form-item label="套系">
              <el-select v-model="goods.series" placeholder="选择">
                <el-option v-bind:key="item.id" v-for="item in seriesList" :label="item.name" :value="item.id">
                </el-option>
              </el-select>

              <i class="el-icon-minus ic" @click="goods.series = ''"></i>
              <i class="el-icon-plus ic" v-if="goods.isAdd.series" @click="goods.isAdd.series=!goods.isAdd.series"></i>
              <span v-else>
                <el-input  placeholder="添加" class="item_add_input" @keyup.enter.native="add_series();goods.isAdd.series=!goods.isAdd.series" v-model="series_add"></el-input>
                <el-button  type="text" @click="add_series();goods.isAdd.series=!goods.isAdd.series">保存</el-button>
                <el-button  type="text" @click="goods.isAdd.series=!goods.isAdd.series">取消</el-button>
              </span>
            </el-form-item>

            <el-form-item label="款式">
              <el-select v-model="goods.kuanshi" placeholder="选择">
                <el-option v-bind:key="item.id" v-for="item in kuanshiList" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
              <i class="el-icon-minus ic" @click="goods.kuanshi = ''"></i>
              <i class="el-icon-plus ic" v-if="goods.isAdd.kuanshi" @click="goods.isAdd.kuanshi=!goods.isAdd.kuanshi"></i>
              <span v-else>
                <el-input placeholder="添加" class="item_add_input" @keyup.enter.native="add_kuanshi();goods.isAdd.kuanshi=!goods.isAdd.kuanshi" v-model="kuanshi_add"></el-input>
                <el-button type="text" @click="add_kuanshi();goods.isAdd.kuanshi=!goods.isAdd.kuanshi">保存</el-button>
                <el-button type="text" @click="goods.isAdd.kuanshi=!goods.isAdd.kuanshi">取消</el-button>
              </span>

            </el-form-item>

            <el-form-item label="钻石切工" v-show="goods.is_diamond">
              <el-select v-model="goods.zuanshiqiegong" placeholder="选择">
                <el-option v-bind:key="item.name" v-for="item in zuanshiqiegongList" :label="item" :value="item">
                </el-option>
              </el-select>
              <i class="el-icon-minus ic" @click="goods.zuanshiqiegong = ''"></i>
              <i class="el-icon-plus ic" v-if="goods.isAdd.zuanshiqiegong" @click="goods.isAdd.zuanshiqiegong=!goods.isAdd.zuanshiqiegong"></i>
              <span v-else>
                <el-input  placeholder="添加" class="item_add_input" @keyup.enter.native="add_item('zuanshiqiegong_add', 'zuanshiqiegongList', 'zuanshiqiegong');goods.isAdd.zuanshiqiegong=!goods.isAdd.zuanshiqiegong" v-model="zuanshiqiegong_add"></el-input>
                <el-button type="text" @click="add_item('zuanshiqiegong_add', 'zuanshiqiegongList', 'zuanshiqiegong');goods.isAdd.zuanshiqiegong=!goods.isAdd.zuanshiqiegong">保存</el-button>
                <el-button type="text" @click="goods.isAdd.zuanshiqiegong=!goods.isAdd.zuanshiqiegong">取消</el-button>
              </span>
            </el-form-item>

            <el-form-item label="主钻形状" v-show="goods.is_diamond">
              <el-select v-model="goods.zhuzuanxingzhuang" placeholder="选择">
                <el-option v-bind:key="item" v-for="item in zhuzuanxingzhuangList" :label="item" :value="item">
                </el-option>
              </el-select>
              <i class="el-icon-minus ic" @click="goods.zhuzuanxingzhuang = ''"></i>
              <i class="el-icon-plus ic" v-if="goods.isAdd.zhuzuanxingzhuang" @click="goods.isAdd.zhuzuanxingzhuang=!goods.isAdd.zhuzuanxingzhuang"></i>
              <span v-else>
                <el-input  placeholder="添加" class="item_add_input" @keyup.enter.native="add_item('zhuzuanxingzhuang_add', 'zhuzuanxingzhuangList', 'zhuzuanxingzhuang');goods.isAdd.zhuzuanxingzhuang=!goods.isAdd.zhuzuanxingzhuang" v-model="zhuzuanxingzhuang_add"></el-input>
                <el-button type="text" @click="add_item('zhuzuanxingzhuang_add', 'zhuzuanxingzhuangList', 'zhuzuanxingzhuang');goods.isAdd.zhuzuanxingzhuang=!goods.isAdd.zhuzuanxingzhuang" v-model="zhuzuanxingzhuang_add">保存</el-button>
                <el-button type="text" @click="goods.isAdd.zhuzuanxingzhuang=!goods.isAdd.zhuzuanxingzhuang">取消</el-button>
              </span>

            </el-form-item>

            <el-form-item label="副钻形状" v-show="goods.is_diamond">
              <el-select v-model="goods.fuzuanxingzhuang" placeholder="选择">
                <el-option v-bind:key="item" v-for="item in fuzuanxingzhuangList" :label="item" :value="item">
                </el-option>
              </el-select>
              <i class="el-icon-minus ic" @click="goods.fuzuanxingzhuang = ''"></i>
              <i class="el-icon-plus ic" v-if="goods.isAdd.fuzuanxingzhuang" @click="goods.isAdd.fuzuanxingzhuang=!goods.isAdd.fuzuanxingzhuang"></i>
              <span v-else>
                <el-input placeholder="添加" class="item_add_input" @keyup.enter.native="add_item('fuzuanxingzhuang_add', 'fuzuanxingzhuangList', 'fuzuanxingzhuang');goods.isAdd.fuzuanxingzhuang=!goods.isAdd.fuzuanxingzhuang" v-model="fuzuanxingzhuang_add"></el-input>
                <el-button type="text" @click="add_item('fuzuanxingzhuang_add', 'fuzuanxingzhuangList', 'fuzuanxingzhuang');goods.isAdd.fuzuanxingzhuang=!goods.isAdd.fuzuanxingzhuang">保存</el-button>
                <el-button type="text" @click="goods.isAdd.fuzuanxingzhuang=!goods.isAdd.fuzuanxingzhuang">取消</el-button>
              </span>

            </el-form-item>

            <el-form-item label="副钻分数" v-show="goods.is_diamond">
              <el-select v-model="goods.fuzuanfenshu" placeholder="选择">
                <el-option v-bind:key="item" v-for="item in fuzuanfenshuList" :label="item" :value="item">
                </el-option>
              </el-select>
              <i class="el-icon-minus ic" @click="goods.fuzuanfenshu = ''"></i>
              <i class="el-icon-plus ic" v-if="goods.isAdd.fuzuanfenshu" @click="goods.isAdd.fuzuanfenshu=!goods.isAdd.fuzuanfenshu"></i>
              <span v-else>
                <el-input  placeholder="添加" class="item_add_input" @keyup.enter.native="add_item('fuzuanfenshu_add', 'fuzuanfenshuList', 'fuzuanfenshu');goods.isAdd.fuzuanfenshu=!goods.isAdd.fuzuanfenshu" v-model="fuzuanfenshu_add"></el-input>
                <el-button type="text" @click="add_item('fuzuanfenshu_add', 'fuzuanfenshuList', 'fuzuanfenshu');goods.isAdd.fuzuanfenshu=!goods.isAdd.fuzuanfenshu">保存</el-button>
                <el-button type="text" @click="goods.isAdd.fuzuanfenshu=!goods.isAdd.fuzuanfenshu">取消</el-button>
              </span>
            </el-form-item>

            <el-form-item label="镶嵌材质">
              <el-select v-model="goods.xiangqiancaizhi" placeholder="选择">
                <el-option v-bind:key="item" v-for="item in xiangqiancaizhiList" :label="item" :value="item">
                </el-option>
              </el-select>
              <i class="el-icon-minus ic" @click="goods.xiangqiancaizhi = ''"></i>
              <i class="el-icon-plus ic" v-if="goods.isAdd.xiangqiancaizhi" @click="goods.isAdd.xiangqiancaizhi=!goods.isAdd.xiangqiancaizhi"></i>
              <span v-else>
                <el-input  placeholder="添加" class="item_add_input" @keyup.enter.native="add_item('xiangqiancaizhi_add', 'xiangqiancaizhiList', 'xiangqiancaizhi');goods.isAdd.xiangqiancaizhi=!goods.isAdd.xiangqiancaizhi" v-model="xiangqiancaizhi_add"></el-input>
                <el-button type="text" @click="add_item('xiangqiancaizhi_add', 'xiangqiancaizhiList', 'xiangqiancaizhi');goods.isAdd.xiangqiancaizhi=!goods.isAdd.xiangqiancaizhi">保存</el-button>
                <el-button type="text" @click="goods.isAdd.xiangqiancaizhi=!goods.isAdd.xiangqiancaizhi">取消</el-button>
              </span>
            </el-form-item>

            <el-form-item label="镶嵌方式">
              <el-select v-model="goods.xiangqianfangshi" placeholder="选择">
                <el-option v-bind:key="item" v-for="item in xiangqianfangshiList" :label="item" :value="item">
                </el-option>
              </el-select>
              <i class="el-icon-minus ic" @click="goods.xiangqianfangshi = ''"></i>
              <i class="el-icon-plus ic" v-if="goods.isAdd.xiangqianfangshi" @click="goods.isAdd.xiangqianfangshi=!goods.isAdd.xiangqianfangshi"></i>
              <span v-else>
                <el-input  placeholder="添加" class="item_add_input" @keyup.enter.native="add_item('xiangqianfangshi_add', 'xiangqianfangshiList', 'xiangqianfangshi');goods.isAdd.xiangqianfangshi=!goods.isAdd.xiangqianfangshi" v-model="xiangqianfangshi_add"></el-input>
                <el-button type="text" @click="add_item('xiangqianfangshi_add', 'xiangqianfangshiList', 'xiangqianfangshi');goods.isAdd.xiangqianfangshi=!goods.isAdd.xiangqianfangshi">保存</el-button>
                <el-button type="text" @click="goods.isAdd.xiangqianfangshi=!goods.isAdd.xiangqianfangshi">取消</el-button>
              </span>
            </el-form-item>

          </el-form>

          <hr>
          <h3>商品编制</h3>
          <el-form label-width="150px">
            <el-form-item label="商品货号">
              <el-input class="input-all" v-model="goods.merchant_code"></el-input>
            </el-form-item>
            <el-form-item label="商品重量">
              <el-input class="input-all" v-model="goods.weight"></el-input> 克
            </el-form-item>
            <el-form-item label="商品提成">
              <el-input class="input-all" v-model="goods.commision"></el-input> %
            </el-form-item>
            <el-form-item label="是否支持刻字">
              <el-switch v-model="goods.has_kezi"></el-switch>
            </el-form-item>
            <el-form-item label="是否新款">
              <el-switch v-model="goods.is_new"></el-switch>
            </el-form-item>
            <el-form-item label="是否商场同款">
              <el-switch v-model="goods.is_shop_same"></el-switch>
            </el-form-item>
            <el-form-item label="是否活动中">
              <el-switch v-model="goods.is_active"></el-switch>
            </el-form-item>
            <el-form-item label="基础服务">
              <el-select v-model="goods.basic_service" placeholder="选择" multiple style="width: 480px">
                <el-option v-bind:key="item.id" v-for="item in basicserviceList" :label="item.desc" :value="item.id">
                  <div class="dis">
                    <span class="left">{{item.name}}:</span>
                    <span class="right">{{item.desc}}</span>
                  </div>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="添加基础服务">
              <el-input placeholder="基础服务名称" class="input-all" v-model="basicservice_add.name"></el-input>
              <el-input placeholder="基础服务描述" class="input-all" v-model="basicservice_add.desc"></el-input>
              <el-button cricle type="primary" @click="addBasicService()">确定</el-button>
            </el-form-item>
          </el-form>
          <br> <br>
          <hr>
          <h3>商品描述</h3>
          <el-form label-width="150px">
            <el-form-item label="商品主标题">
              <el-input placeholder="最多15个字符" maxlength="15" style="width: 360px" class="input-all" v-model="goods.title"></el-input>
            </el-form-item>
            <el-form-item label="商品副标题">
              <el-input placeholder="最多15个字符" maxlength="15" style="width: 360px" class="input-all" v-model="goods.subtitle"></el-input>
            </el-form-item>
            <el-form-item label="列表封面">
              <el-upload drag :action="upload_url" :on-success="handleUploadSuccess">
                <div class="el-upload__text">将文件拖到此处，或
                  <em>点击上传</em>
                </div>
                <img style="width:138px;height: auto;" :src="goods.cover_img" alt="">
              </el-upload>
            </el-form-item>
            <el-form-item label="商品详情图">
              <div style="width:600px;height: auto;">
                <el-upload :before-remove="beforeSlideRemove" :on-remove="handleSlideRemove" :file-list="goods.slide_img" list-type="picture-card" :action="upload_url" :on-success="handleSlideSuccess">
                  <i class="el-icon-plus"></i>
                </el-upload>
              </div>
            </el-form-item>
            <!-- <el-form-item label="商品详情图">
              <el-upload drag :before-remove="beforeSlideRemove" :on-remove="handleSlideRemove" :file-list="goods.slide_img" :action="upload_url" :on-success="handleSlideSuccess">
                <div class="el-upload__text">将文件拖到此处，或
                  <em>点击上传</em>
                </div>
              </el-upload> 
            </el-form-item>-->
            <el-form-item label="图文描述">
              <vue-ckeditor
                v-model="goods.detail"
                :config="config"
              ></vue-ckeditor>
              <!-- <textarea name="news_edit_area" id="news_edit_area" cols="30" rows="10" :value="goods.detail"></textarea> -->
            </el-form-item>
          </el-form>

        </el-tab-pane>
        <el-tab-pane label="SKU信息" name="2">
          <el-button cricle type="primary" style="float:right;" @click="skuLineAdd()">新增SKU</el-button>
          <br>
          <h3>SKU</h3>
          <div class="search-table search-tab">
            <el-table empty-text="当前商品没有配置SKU..." stripe align="center" :data="skus">
              <el-table-column label="主钻分数" align="center" v-if="goods.is_diamond">
                <template slot-scope="scope">
                  <el-input v-if="scope.row.editable" v-model="added.zhuzuanfenshu"></el-input>
                  <span v-else>{{scope.row.zhuzuanfenshu}}</span>
                </template>
              </el-table-column>
              <el-table-column label="钻石净度" align="center" v-if="goods.is_diamond">
                <template slot-scope="scope">
                  <el-input v-if="scope.row.editable" v-model="added.zuanshijingdu"></el-input>
                  <span v-else>{{scope.row.zuanshijingdu}}</span>
                </template>
              </el-table-column>
              <el-table-column label="主石名称" align="center" v-if="!goods.is_diamond">
                <template slot-scope="scope">
                  <el-input v-if="scope.row.editable" v-model="added.zhushimingcheng"></el-input>
                  <span v-else>{{scope.row.zhushimingcheng}}</span>
                </template>
              </el-table-column>
              <el-table-column label="主石评级" align="center" v-if="!goods.is_diamond">
                <template slot-scope="scope">
                  <el-input v-if="scope.row.editable" v-model="added.zhushipingji"></el-input>
                  <span v-else>{{scope.row.zhushipingji}}</span>
                </template>
              </el-table-column>

              <el-table-column label="颜色" align="center">
                <template slot-scope="scope">
                  <el-input v-if="scope.row.editable" v-model="added.color"></el-input>
                  <span v-else>{{scope.row.color}}</span>
                </template>
              </el-table-column>

              <el-table-column label="金颜色" align="center">
                <template slot-scope="scope">
                  <el-input v-if="scope.row.editable" v-model="added.gold_color"></el-input>
                  <span v-else>{{scope.row.gold_color}}</span>
                </template>
              </el-table-column>
              <el-table-column label="规格" align="center">
                <template slot-scope="scope">
                  <el-input v-if="scope.row.editable" v-model="added.guige"></el-input>
                  <span v-else>{{scope.row.guige}}</span>
                </template>
              </el-table-column>
              <el-table-column label="价格" align="center">
                <template slot-scope="scope">
                  <el-input v-if="scope.row.editable" v-model="added.price"></el-input>
                  <span v-else>{{scope.row.price}}</span>
                </template>
              </el-table-column>
              <el-table-column label="库存" align="center">
                <template slot-scope="scope">
                  <el-input v-if="scope.row.editable" v-model="added.count"></el-input>
                  <span v-else>{{scope.row.count}}</span>
                </template>
              </el-table-column>
              <el-table-column label="条形码" align="center">
                <template slot-scope="scope">
                  <el-input v-if="scope.row.editable" v-model="added.bar_code"></el-input>
                  <span v-else>{{scope.row.bar_code}}</span>
                </template>
              </el-table-column>
              <el-table-column label="商品编号(SKU)" align="center">
                <template slot-scope="scope">
                  <el-input v-if="scope.row.editable" v-model="added.merchant_code"></el-input>
                  <span v-else>{{scope.row.merchant_code}}</span>
                </template>
              </el-table-column>


              <el-table-column label="公司模号" align="center">
                <template slot-scope="scope">
                  <el-input v-if="scope.row.editable" v-model="added.mode_code"></el-input>
                  <span v-else>{{scope.row.mode_code}}</span>
                </template>
              </el-table-column>

              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <el-button @click="skuLineSave(scope.$index, skus)" type="text" size="small" v-if="scope.row.editable">保存</el-button>
                  <el-button @click="skuLineEdit(scope.$index, skus)" type="text" size="small" v-else>编辑</el-button>

                  <el-button @click="skuLineCancel(scope.$index, skus)" type="text" size="small" v-if="scope.row.editable">取消</el-button>
                  <el-button @click="skuLineDelete(scope.$index, skus)" type="text" size="small" v-else>删除</el-button>
                </template>
              </el-table-column>

            </el-table>
          </div>
        </el-tab-pane>
        <el-tab-pane label="关联信息" name="3">
          <el-button cricle type="primary" style="float:right;" @click="addRecommendLine">新增关联</el-button>
          <br>
          <h3>关联商品</h3>
          <div class="search-table search-tab">
            <el-table :data="recommends" stripe align="center">
              <el-table-column label="序号" align="center">
                <template slot-scope="scope">
                  <el-input-number type="int" v-if="scope.row.editable" v-model="scope.row.sort_id"></el-input-number>
                  <span v-else>{{scope.row.sort_id}}</span>
                </template>
              </el-table-column>
              <el-table-column label="关联商品" align="center">
                <template slot-scope="scope">
                  <el-select v-if="scope.row.editable" v-model="scope.row.recommend_id">
                    <el-option-group v-for="group in group_goods" :label="group.series_name" :key="group.series_id">
                      <el-option v-for="item in group.goods" :label="item.title" :key="item.goods_id" :value="item.goods_id"></el-option>
                    </el-option-group>
                  </el-select>
                  <span v-else>{{scope.row.goods.title}}</span>
                </template>
              </el-table-column>
              <el-table-column label="编辑" align="center">
                <template slot-scope="scope">
                  <el-button @click="recommendLineSave(scope.$index, recommends)" type="text" size="small" v-if="scope.row.editable">保存</el-button>
                  <el-button @click="recommendLineEdit(scope.$index, recommends)" type="text" size="small" v-else>编辑</el-button>

                  <el-button @click="recommendLineCancel(scope.$index, recommends)" type="text" size="small" v-if="scope.row.editable">取消</el-button>
                  <el-button @click="recommendLineDelete(scope.$index, recommends)" type="text" size="small" v-else>删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>


<script>
import { UPLOAD_IMG_URL } from "../global.js";
import Vue from "vue";
import VueCkeditor from "vue-ckeditor2";

export default {
  components: { VueCkeditor },
  methods: {
    beforeSlideRemove(file, filelist) {
      for (let i = 0; i < this.goods.slide_img.length; i++) {
        if (this.goods.slide_img[i] == file.url) {
          this.goods.splice(i, 1);
          break;
        }
      }
    },
    handleSlideRemove(file, filelist) {
      console.log(file, filelist);
    },
    async recommendLineSave(index, rows) {
      let confirmed = await this.$confirm("确定要保存吗?");
      let row_id = rows[index].id;
      let row = rows[index];
      let postData = {
        sort_id: row.sort_id,
        goods_id: this.goods_id,
        recommend_id: row.recommend_id
      };
      if (row_id) {
        let result = await this.$axios.post(
          `/admin/recommend/goods/${row_id}`,
          postData
        );
        if (result.data.status != 0) return;
        Vue.set(row, "editable", false);
        this.$message("修改成功");
      } else {
        let result = await this.$axios.post("/admin/recommend/goods", postData);
        if (!result.data.status != 0) return;
        let data_id = result.data.id;
        rows[index].id = data_id;
        Vue.set(row, "editable", false);
        this.$message("新增成功");
      }
    },
    recommendLineEdit(index, rows) {
      rows[index].editable = true;
      Vue.set(rows[index], "editable", true);
    },
    recommendLineCancel(index, rows) {
      let row = rows[index];
      if (row.id) {
        Vue.set(row, "editable", false);
      } else {
        rows.splice(index, 1);
      }
    },
    recommendLineDelete(index, rows) {},
    async load_recommends() {
      let goods_id = this.goods_id;
      if (!goods_id) return;
      let result = await this.$axios.get("/admin/recommend/goods/", {
        params: { goods_id: goods_id }
      });
      if (result.data.status != 0) return;
      let recommends = result.data.data;
      recommends.forEach(item => {
        item["editable"] = false;
      });
      this.recommends = recommends;
    },
    addRecommendLine() {
      if (!this.goods_id) {
        this.$message("请先编辑并保存商品信息，然后再新增和修改SKU");
      } else {
        this.recommends.unshift({ editable: true });
      }
    },
    skuLineAdd() {
      if (!this.goods_id) {
        this.$message("请先编辑并保存商品信息，然后再新增和修改SKU");
      } else {
        this.skus.unshift({ editable: true });
      }
    },
    async skuLineSave(index, rows) {
      let confirmed = await this.$confirm("确定要保存吗?");
      let row = rows[index];
      let sku = this.added;
      sku["goods_id"] = this.goods.id;
      let result = await this.$axios.post("/admin/sku/", sku);
      if (result.data.status != 0) return;
      let sku_id = result.data.id;
      // sku.id = sku_id;
      // sku.editable = false;
      this.added = {};
      this.load_skus(this.goods_id);
    },
    skuLineEdit(index, rows) {
      console.log("sku line edit");
      let sku = rows[index];
      this.added = JSON.parse(JSON.stringify(sku));
      Vue.set(sku, "editable", true);
    },
    skuLineCancel(index, rows) {
      // console.log("sku line cancel");
      let row = rows[index];
      if (row.id) {
        row.editable = false;
      } else {
        rows.splice(index, 1);
      }
      this.added = {};
    },
    async skuLineDelete(index, rows) {
      console.log("sku line delete");
      let sku_id = rows[index].id;
      if (sku_id) {
        let confirmed = await this.$confirm("确定要删除吗?");
        let result = await this.$axios.delete(`/admin/sku/${sku_id}`);
        if (result.data.status == 0) {
          rows.splice(index, 1);
          this.$message("删除成功");
        }
      } else {
        rows.splice(index, 1);
      }
    },

    handleTabClick(tab) {
      window.sessionStorage.activeGoodsTab = tab.name;
    },
    handleSlideSuccess(file, filelist) {
      let img = {
        name: file.data.filename,
        url: file.data.url
      };
      this.goods.slide_img.push(img);
    },
    handleSlideRemove(file, filelist) {
      this.goods.slide_img = filelist;
    },
    handleUploadSuccess(response, file, fileList) {
      let cover_img = response.data.url;
      if (cover_img) {
        Vue.set(this.goods, "cover_img", cover_img);
      }
    },
    async load_goods() {
      if (this.goods_id) {
        let resp = await this.$axios.get(`/admin/goods/${this.goods_id}`);
        let data = resp.data.data;
        // console.log(data);
        for (let key in data) {
          // this.goods[key] = data[key];
          // console.log(key, data[key])
          Vue.set(this.goods, key, data[key]);
        }
        // console.log(this.goods.detail);
        // console.log(this.goods.slide_img)
      }
    },
    async load_series() {
      let result = await this.$axios.get("/admin/series");
      if (result.data.status == 0) {
        this.seriesList = result.data.data;
      }
    },
    async save_goods() {
      let goods_id = this.goods.id;
      if (goods_id) {
        let result = await this.$axios.post(
          `/admin/goods/${goods_id}`,
          this.goods
        );
        if (result.data.status == 0) {
          this.$message("修改成功");
        }
      } else {
        let result = await this.$axios.post("/admin/goods", this.goods);
        if (result.data.status != 0) {
          return;
        }
        let respData = result.data.data;
        let goods_id = respData.goods_id;
        Vue.set(this.goods, "id", goods_id);
        this.goods_id = goods_id;
        this.$message("添加成功");
      }
    },
    handleUploadSuccess(response, file, fileList) {
      let cover_img = response.data.url;
      Vue.set(this.goods, "cover_img", cover_img);
    },
    delete_item(obj, item) {
      obj.pop(item);
    },
    add_item(item, list, attr) {
      this[list].push(this[item]);
      this.goods[attr] = this[item];
    },
    async add_series() {
      let series_add = this.series_add;
      let result = await this.$axios.post("/admin/series/", {
        name: series_add
      });
      let respData = result.data;
      if (respData.status != 0) return;
      let series_id = respData.data.id;
      this.seriesList.push({ id: series_id, name: series_add });
      this.goods.series = series_id;
    },
    async add_kuanshi() {
      let kuanshi_add = this.kuanshi_add;
      let result = await this.$axios.post("/admin/kuanshi/", {
        name: kuanshi_add
      });
      let respData = result.data;
      if (respData.status != 0) return;
      let kuanshi_id = respData.data.id;
      this.kuanshiList.push({ id: kuanshi_id, name: kuanshi_add });
      this.goods.kuanshi = kuanshi_id;
    },
    async addBasicService() {
      let basicservice = this.basicservice_add;
      let result = await this.$axios.post("/admin/basicservice/", basicservice);
      let respData = result.data;
      if (respData.status != 0) return;
      let basicservice_id = respData.data.id;
      basicservice.id = basicservice_id;
      this.goods.basicservice = basicservice;
      this.basicserviceList.push(basicservice);
      this.basicservice_add = {};
    },

    async load_kuanshi() {
      let result = await this.$axios.get(`/admin/kuanshi`);
      if (result.data.status != 0) return;
      this.kuanshiList = result.data.data;
    },
    async load_goods_attr() {
      let result = await this.$axios.get("/admin/goods_attr/");
      if (result.data.status != 0) return;
      let data = result.data.data;
      this.zuanshiqiegongList = data["zuanshiqiegongList"];
      this.xiangqiancaizhiList = data["zuanshiqiegongList"];
      this.zhuzuanxingzhuangList = data["zhuzuanxingzhuangList"];
      this.fuzuanxingzhuangList = data["fuzuanxingzhuangList"];
      this.xiangqiancaizhiList = data["xiangqiancaizhiList"];
      this.xiangqianfangshiList = data["xiangqianfangshiList"];
    },
    async load_basic_service() {
      let result = await this.$axios.get("/admin/basicservice/");
      if (result.data.status != 0) return;
      this.basicserviceList = result.data.data;
    },
    async load_skus(goods_id) {
      let result = await this.$axios.get("/admin/sku/", {
        params: { goods_id: goods_id }
      });
      if (result.data.status != 0) return;
      let skus = result.data.data;
      skus.forEach(item => {
        item["editable"] = false;
      });
      function cmp(x, y) {
        if (x["created_at"] > y["created_at"]) {
          return -1;
        } else {
          return 1;
        }
      }
      skus.sort(cmp);
      this.skus = skus;
    },
    async load_group_goods() {
      let result = await this.$axios.get("/admin/group_goods/");
      if (result.data.status != 0) return;
      this.group_goods = result.data.data;
    }
  },
  created() {
    let activeTab = window.sessionStorage.activeGoodsTab;
    if (activeTab) this.activeGoodsTab = activeTab;

    let route_name = this.$route.name;
    let goods_id = this.$route.params["goods_id"];
    this.goods_id = goods_id;
    this.load_goods();
    this.load_series();
    this.load_kuanshi();
    this.load_goods_attr();
    this.load_basic_service();
    this.load_recommends();
    this.load_group_goods();
    if (this.goods_id) {
      this.load_skus(this.goods_id);
    }
  },
  data() {
    return {
      added: {},
      config: {
        height: "400px",
        width: "750px",
        toolbar: [
          { name: "clipboard", items: ["Undo", "Redo"] },
          {
            name: "basicstyles",
            items: ["Bold", "Italic", "Underline", "Strike"]
          },
          { name: "colors", items: ["TextColor", "BGColor"] },
          { name: "links", items: ["Link", "Unlink"] },
          { name: "insert", items: ["Image"] }
        ],
        language: "zh-cn",
        // extraPlugins: 'imagepaste, uploadimage',
        filebrowserImageUploadUrl: UPLOAD_IMG_URL + "_v2",
        removeDialogTabs: "image:advanced;image:Link"
      },
      goods_id: null,
      group_goods: [],

      activeGoodsTab: "1",
      upload_url: UPLOAD_IMG_URL,
      seriesList: [],
      kuanshiList: [],
      zuanshiqiegongList: [],
      zhuzuanxingzhuangList: [],
      fuzuanxingzhuangList: [],
      fuzuanfenshuList: [],
      xiangqiancaizhiList: [],
      xiangqianfangshiList: [],
      basicserviceList: [],

      series_add: "",
      kuanshi_add: "",
      zuanshiqiegong_add: "",
      zhuzuanxingzhuang_add: "",
      fuzuanxingzhuang_add: "",
      fuzuanfenshu_add: "",
      xiangqiancaizhi_add: "",
      xiangqianfangshi_add: "",
      basicservice_add: {},

      recommends: [],
      skus: [],
      goods: {
        active: true,
        is_diamond: true,
        title: "",
        series: "",
        kuanshi: "",
        zuanshiqiegong: "",
        zhuzuanxingzhuang: "",
        fuzuanxingzhuang: "",
        fuzuanfenshu: "",
        xiangqiancaizhi: "",
        xiangqianfangshi: "",
        basic_service: [],
        weight: "",

        merchant_code: "",
        commision: "",

        subtitle: "",
        cover_img: "",
        slide_img: [],
        merchant_code: "",
        is_active: false,
        is_new: false,
        is_shop_same: false,
        has_kezi: false,
        detail: "",
        kuanshi: "",
        xiangqiancaizhi: "",
        xiangqianfangshi: "",
        zuanshiqiegong: "",
        zhuzuanxingzhuang: "",
        fuzuanxingzhuang: "",
        fuzuanfenshu: "",
        isAdd: {
          series: true,
          kuanshi: true,
          zuanshiqiegong: true,
          zhuzuanxingzhuang: true,
          fuzuanxingzhuang: true,
          fuzuanfenshu: true,
          xiangqiancaizhi: true,
          xiangqianfangshi: true
        }
      },
      series: []
    };
  }
};
</script>

<style lang="less" scoped>
.dis {
  width: 100%;
  display: flex;
  justify-content: space-between;
  .left {
    display: block;
    width: 20%;
    text-align: right;
  }
  .right {
    width: 78%;
    display: block;
  }
}
.ic {
  font-size: 20px;
  line-height: 40px;
  color: #8c939d;
  cursor: pointer;
  margin-left: 30px;
}
.item_add_input {
  width: 150px;
  margin-left: 50px;
}
.el-select {
  width: 195px;
}
.el-switch {
  margin-left: 30px;
}
.el-form-item {
  margin-left: 30px;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.item {
  color: black;
  display: inline-block;
  margin-right: 20px;
  position: relative;
}
.input-all {
  width: 200px;
}
</style>
