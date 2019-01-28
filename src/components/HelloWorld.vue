<template>
    <div>
        <el-container style="height: 500px; border: 1px solid #eee">
            <el-aside width="10%" style="background-color: rgb(238, 241, 246)">
                <el-menu>
                    <el-submenu index="1">
                        <template slot="title"><i class="el-icon-message">导航一</i></template>
                        <el-menu-item-group>
                            <template slot="title">分组一</template>
                            <el-menu-item index="1-1">选项1</el-menu-item>
                            <el-menu-item index="1-2">选项2</el-menu-item>
                        </el-menu-item-group>
                    </el-submenu>
                    <el-submenu index="2">
                        <template slot="title"><i class="el-icon-menu">导航二</i></template>
                        <el-menu-item-group>
                            <el-menu-item index="2-1">选项1</el-menu-item>
                            <el-menu-item index="2-2">选项2</el-menu-item>
                        </el-menu-item-group>
                        <el-submenu index="2-3">
                            <template slot="title">选项3</template>
                            <el-menu-item index="2-3-1">选项3-1</el-menu-item>
                            <el-menu-item index="2-3-2">选项3-2</el-menu-item>
                        </el-submenu>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <el-container>

                <el-head>
                    <span>王小虎</span>
                    <el-button type="primary">新增</el-button>
                    <el-button type="success">查看</el-button>
                    <el-button type="warning" @click="delete_item">删除</el-button>
                    <el-button icon="el-icon-search" circle></el-button>
                    <el-button type="primary" icon="el-icon-edit" circle></el-button>
                    <el-button type="success" icon="el-icon-check" circle></el-button>
                    <el-button type="info" icon="el-icon-message" circle></el-button>
                    <el-button type="warning" icon="el-icon-star-off" circle></el-button>
                    <el-button type="danger" icon="el-icon-delete" circle></el-button>
                </el-head>
                <el-main>
                    <el-table v-loading="loading">
                        <el-table-column prop="date" label="日期" width="140">
                        </el-table-column>
                        <el-table-column prop="name" label="姓名" width="120">
                        </el-table-column>
                        <el-table-column prop="address" label="地址">
                        </el-table-column>
                    </el-table>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>

    async function get_root() {
    }

    export default {
        name: "HelloWorld",
        methods: {
            async delete_item() {
                const axios = this.$axios

                async function get_root() {
                    return axios.get('/')
                }

                // let loadInstance = this.$loading({
                //     target: 'el-table',
                //     body: false
                // })
                let confirmed = await this.$confirm('确定要删除吗？', '风险操作', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                let res = await get_root()
            },
        },
        data() {
            return {
                msg: "Welcome to Your Vue.js App"
            };
        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .el-header {
        background-color: #B3C0D1;
        color: #333;
        line-height: 60px;
    }

    .el-aside {
        color: #333;
    }

</style>
