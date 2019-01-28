<template>
  <div id="news_detail" style="text-align:left;">
    <h2 class="h2-text">资讯</h2>
    <hr>
    <div class="form">
      <el-form label-width="200px" size="large">
        <el-form-item label="网址">
          <el-input v-model="news.article_source_url"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="import_news(news.article_source_url)">导入</el-button>
        </el-form-item>
        <el-form-item label="来源">
          <el-input v-model="news.article_source"></el-input>
        </el-form-item>
        <el-form-item label="栏目">
          <el-select v-model="news.category">
            <el-option value="资讯" label="资讯"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标签">
          <el-autocomplete v-model="news.tag" :fetch-suggestions="querySearch">
          </el-autocomplete>
        </el-form-item>

        <el-form-item label="标题" required>
          <el-input v-model="news.title"></el-input>
        </el-form-item>
        <el-form-item label="本文链接">
          <el-input readonly v-model="news.article_url" placeholder="保存完后会自动生成文章链接"></el-input>
        </el-form-item>
        <el-form-item label="缩略图" id="thumb">
          <el-upload drag :show-file-list="false" :action="upload_url" :on-success="handleUploadSuccess">
            <img :src="news.thumb_img" v-if="news.thumb_img" alt="图片无法显示" style="width:210px; height:130px;">
            <i class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>

        <el-form-item label="状态:">
          <el-switch v-model="news.active" active-text="激活" inactive-text="关闭">
          </el-switch>
        </el-form-item>
        <el-form-item>
          <el-button @click="edit_news(true)">保存并退出</el-button>
          <el-button @click="edit_news(false)">保存</el-button>
        </el-form-item>
      </el-form>

      <el-form :inline="true">
        <el-form-item label="正文">
          <textarea v-model="news.body" id="news_edit_area" name="news_edit_area" cols="50" rows="10"></textarea>
        </el-form-item>
        <el-form-item label="预览">
          <iframe id="iframe" src=""></iframe>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { UPLOAD_IMG_URL } from "../global.js";
import Vue from "vue";

export default {
  created() {
    this.loadNews();
    Vue.nextTick(function() {
      CKEDITOR.replace("news_edit_area", {
        height: "650px",
        width: "375px",
        toolbar: [
          { name: "clipboard", items: ["Undo", "Redo"] },
          {
            name: "basicstyles",
            items: ["Bold", "Italic", "Underline", "Strike"]
          },
          { name: "colors", items: ["TextColor", "BGColor"] },
          { name: "links", items: ["Link", "Unlink"] },
          { name: "insert", items: ["Image"] },
        ],
        language: "zh-cn",
        // extraPlugins: 'imagepaste, uploadimage',
        filebrowserImageUploadUrl: UPLOAD_IMG_URL,
        removeDialogTabs: "image:advanced;image:Link"
      });
    });
  },
  methods: {
    querySearch(queryString, cb) {
      let results = [
        { value: "头条" },
        { value: "政策" },
        { value: "对话" },
        { value: "行情" },
        { value: "投研" },
        { value: "评级" },
        { value: "技术" },
        { value: "百科" },
        { value: "专访" }
      ];
      cb(results);
    },
    sync_iframe() {
      if (this.news.article_url) {
        document.getElementById("iframe").src = this.news.article_url;
      }
    },
    async loadNews() {
      let route_name = this.$route.name;
      let news_id = this.$route.params["news_id"];
      if (route_name == "news_detail" && news_id) {
        let resp = await this.$axios.get(`/admin/news/${news_id}`);
        let data = resp.data.data;
        this.news = data;
        this.sync_iframe();
      }
    },
    handleUploadSuccess(response, file, fileList) {
      let thumb_img = response.url;
      // this.news.thumb_img = response.url;
      // console.info(this.news.thumb_img);
      Vue.set(this.news, "thumb_img", thumb_img);
    },
    async edit_news(exit) {
      let body = CKEDITOR.instances.news_edit_area.getData();
      let title = this.news.title;
      let category = this.news.category;
      let article_source_url = this.news.article_source_url;
      let article_source = this.news.article_source;
      let news_id = this.news.id;
      let thumb_img = this.news.thumb_img;
      let tag = this.news.tag;
      let active = this.news.active;
      let data = {
        title: title,
        body: body,
        category: category,
        article_source_url: article_source_url,
        article_source: article_source,
        thumb_img: thumb_img,
        tag: tag,
        active: active
      };
      if (news_id) {
        // 修改
        let result = await this.$axios.post(`/admin/news/${news_id}/`, data);
        if (result.data.code != 0) return;
        this.$message("修改成功");
        this.sync_iframe();
        if (exit) {
          location.href = "/";
        }
      } else {
        // 新增
        let result = await this.$axios.post("/admin/news/", data);
        if (result.data.code != 0) {
          return;
        }
        Vue.set(this.news, "id", result.data.data.id);
        Vue.set(this.news, "article_url", result.data.data.article_url);
        let thumb_img = result.data.thumb_img;
        if (thumb_img) {
          Vue.set(this.news, "thumb_img", thumb_img);
        }
        this.$message("新增成功");
        this.sync_iframe();
        if (exit) {
          location.href = "/";
        }
      }
    },
    async import_news(article_source_url) {
      let result = await this.$axios.get("/admin/news/import", {
        params: {
          news_url: article_source_url
        }
      });
      if (result.data.code != 0) {
        return;
      }
      let data = result.data.data;
      // console.log(data);
      this.news.title = data.title;
      this.news.body = data.body;
      this.news.article_source = data.article_source;
      CKEDITOR.instances.news_edit_area.setData(data.body);
    }
  },
  data() {
    return {
      upload_url: UPLOAD_IMG_URL,
      news: {
        article_source_url: "",
        title: "",
        body: "",
        id: null,
        thumb_img: "",
        category: "资讯"
      }
    };
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
thumb >>> img {
  width: 210px;
  height: 130px;
  float: left;
}
.el-header {
  background-color: #b3c0d1;
  color: #333;
  line-height: 60px;
}

.el-aside {
  color: #333;
}
#iframe {
  width: 375px;
  height: 650px;
  border: 1px solid gray;
}
#news_edit_area{
  font-size: 28px;
  line-height: 56px;
}
</style>
