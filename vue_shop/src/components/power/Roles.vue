<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item
        ><a href="#/welcome" @click="returnHome">首页</a></el-breadcrumb-item
      >
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 按钮区域 -->
      <el-row>
        <el-col>
          <!-- 添加按钮按钮 -->
          <el-button type="primary" @click="dialogFormVisible = true"
            >添加角色</el-button
          >
          <!-- 添加角色表单 -->
          <el-dialog
            title="添加角色"
            :visible.sync="dialogFormVisible"
            @close="dialogClosed"
          >
            <el-form :model="addform" :rules="FormRules" ref="addForm">
              <el-form-item label="角色名" prop="roleName">
                <el-input
                  v-model="addform.roleName"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
              <el-form-item label="角色描述" prop="roleDesc">
                <el-input
                  v-model="addform.roleDesc"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="addRole(addform)"
                >确 定</el-button
              >
            </div>
          </el-dialog>
        </el-col>
      </el-row>
      <el-table :data="roleList" border stripe>
        <!-- 扩展列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbuttom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 一级权限 -->
              <el-col :span="4">
                <el-tag>{{ item1.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二三级权限 -->
              <el-col :span="20">
                <el-row
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <!-- 二级权限 -->
                  <el-col :span="6">
                    <el-tag type="success">{{ item2.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightById(scope, item3)"
                      >{{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="OpenUpdateForm(scope)"
              >编辑</el-button
            >
            <!-- 修改用户表单 -->
            <el-dialog
              title="修改用户信息"
              :visible.sync="updateDialogVisible"
              @close="updateDialogClosed"
            >
              <el-form
                :model="updateform"
                :rules="updateFormRules"
                ref="updateForm"
              >
                <!-- 修改角色表单 -->
                <el-form-item label="角色名" prop="roleName">
                  <el-input
                    :value="updateform.roleName"
                    autocomplete="off"
                  ></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                  <el-input
                    v-model="updateform.roleDesc"
                    autocomplete="off"
                  ></el-input>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="updateDialogVisible = false"
                  >取 消</el-button
                >
                <el-button type="primary" @click="updateRole(updateform)"
                  >确 定</el-button
                >
              </div>
            </el-dialog>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="deleteMessageShow(scope)"
              >删除</el-button
            >
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showSetRightDialog(scope)"
              >分配权限</el-button
            >
            <!-- 分配权限表单 -->
            <el-dialog
              title="分配权限"
              :visible.sync="SetRightDialogVisible"
              @close="closeSetRightDialog"
              width="50%"
            >
              <el-tree
                :data="rightList"
                :props="treeProps"
                show-checkbox
                node-key="id"
                :default-expand-all="true"
                :default-checked-keys="defKeys"
                ref="treeRef"
              >
              </el-tree>
              <div slot="footer" class="dialog-footer">
                <el-button @click="SetRightDialogVisible = false"
                  >取 消</el-button
                >
                <el-button type="primary" @click="allowRights">确 定</el-button>
              </div>
            </el-dialog>
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
      roleList: [],
      dialogFormVisible: false,
      updateDialogVisible: false,
      addform: {
        roleName: '',
        roleDesc: '',
      },
      updateform: {
        id: 0,
        roleName: '',
        roleDesc: '',
      },
      role_right: {
        role_id: 0,
        right_id: 0,
      },
      rightList: [],
      FormRules: {
        roleName: { required: true, message: '请输入用户名', trigger: 'blur' },
      },
      updateFormRules: {
        roleName: { required: true, message: '请输入用户名', trigger: 'blur' },
      },
      SetRightDialogVisible: false,
      treeProps: {
        label: 'authName',
        children: 'children',
      },
      // 默认选中的节点
      defKeys: [],
      CheckedKeys: [],
      roleId: 0,
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    async getRoleList() {
      const { data: res } = await this.$http.get('role/getRoles')
      if (res.status !== 200) {
        return this.$messsage.error('获取用户列表失败')
      }
      console.log(res)
      this.roleList = res.data
      console.log(this.roleList)
    },
    returnHome() {
      window.sessionStorage.removeItem('activePath')
    },
    dialogClosed() {
      this.$refs.addForm.resetFields()
      this.dialogFormVisible = false
    },
    addRole(role) {
      this.$refs.addForm.validate(async (valid) => {
        if (!valid) return
        console.log(role)
        const { data: res } = await this.$http.post('role/addRole', role)
        if (res.status !== 200) {
          this.$message.error(res.msg)
        }
        console.log(res)
        this.dialogFormVisible = false
        this.getRoleList()
      })
    },
    OpenUpdateForm(scope) {
      console.log(scope)
      this.updateform.id = scope.row.id
      this.updateform.roleName = scope.row.roleName
      this.updateform.roleDesc = scope.row.roleDesc
      this.updateDialogVisible = true
    },
    updateRole(updateform) {
      this.$refs.updateForm.validate(async (valid) => {
        if (!valid) return
        console.log(updateform)
        const { data: res } = await this.$http.put(
          'role/updateRole',
          updateform
        )
        if (res.status !== 200) {
          this.$message.error(res.msg)
        }
        console.log(res)
        this.updateDialogVisible = false
        this.getRoleList()
      })
    },
    updateDialogClosed() {
      this.updateDialogVisible = false
    },
    deleteMessageShow(scope) {
      this.updateform.id = scope.row.id
      this.updateform.roleName = scope.row.roleName
      this.updateform.roleDesc = scope.row.roleDesc
      this.$confirm(
        '是否删除角色名为' + this.updateform.roleName + '的角色？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(async () => {
          const { data: res } = await this.$http.post(
            'role/delete',
            this.updateform
          )
          console.log(res)
          if (res.status === 200) {
            this.getRoleList()
            this.$message({
              type: 'success',
              message: '删除成功!',
            })
          } else {
            this.$message({
              type: 'info',
              message: res.msg,
            })
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },

    removeRightById(scope, item) {
      this.role_right.role_id = scope.row.id
      this.role_right.right_id = item.id
      this.$confirm(
        '是否删除角色名为' +
          scope.row.roleName +
          '的' +
          item.authName +
          '的权限？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(async () => {
          const { data: res } = await this.$http.post(
            'role/deleteRight',
            this.role_right
          )
          console.log(res)
          if (res.status === 200) {
            this.getRoleList()
            this.$message({
              type: 'success',
              message: '删除成功!',
            })
          } else {
            this.$message({
              type: 'info',
              message: res.msg,
            })
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    async showSetRightDialog(scope) {
      this.roleId = scope.row.id
      this.SetRightDialogVisible = true
      this.getLeafKeys(scope.row, this.defKeys)
      console.log(this.defKeys)
      const { data: res } = await this.$http.get('rights/tree')
      console.log(res)
      if (res.status !== 200) {
        return this.$message.error(res.msg)
      } else {
        this.rightList = res.data
      }
    },
    getLeafKeys(node, arr) {
      console.log(node)
      if (
        node.children !== null &&
        node.children !== undefined &&
        node.children.length !== 0
      ) {
        node.children.forEach((item) => this.getLeafKeys(item, arr))
      } else {
        arr.push(node.id)
      }
      return arr
    },
    closeSetRightDialog() {
      this.defKeys = []
    },
    async allowRights() {
      var that = this
      this.CheckedKeys = this.$refs.treeRef.getCheckedKeys()
      console.log(this.CheckedKeys)
      const { data: res } = await this.$http.post('role/setRight', {
        roleId: that.roleId,
        CheckedKeys: that.CheckedKeys,
      })
      console.log(res)
      this.getRoleList()
      this.SetRightDialogVisible = false
    },
  },
}
</script>
<style lang="less">
.el-button {
  margin-left: 10px !important;
  margin-right: 10px !important;
}
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbuttom {
  border-bottom: 1px solid #eee;
}
.el-col {
  align-items: center;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
