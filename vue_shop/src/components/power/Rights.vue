<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <!-- <el-breadcrumb-item :to="{ path: '/home' }" @click="returnHome">活动管理</el-breadcrumb-item> -->
      <!-- @click="returnHome" -->
      <el-breadcrumb-item
        ><a href="#/welcome" @click="returnHome">首页</a></el-breadcrumb-item
      >
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
        <el-row>
          <el-col>
          <el-button class='exchangeButton' type="primary" @click="showTree"
            >显示树形图</el-button>
          </el-col>
        </el-row>
      <el-table :data="rightList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限等级" prop="level">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag type="success" v-if="scope.row.level === '1'">二级</el-tag>
            <el-tag type="warning" v-if="scope.row.level === '2'">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      rightList: [],
    }
  },
  created() {
    this.getRightList()
  },
  methods: {
    async getRightList() {
      const { data: res } = await this.$http.get('rights/list')
      console.log(res)
      if (res.status !== 200) {
        return this.$message.error(res.msg)
      } else {
        this.rightList = res.data
      }
    },
    returnHome() {
      window.sessionStorage.removeItem('activePath')
    },
    showTree () {
      this.$router.push('/roletree')
    }
  },
}
</script>
<style lang="less" scoped>
.el-table{
  margin-top:15px;
}

</style>
