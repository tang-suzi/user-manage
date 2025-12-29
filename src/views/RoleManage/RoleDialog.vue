<template>
  <el-dialog
    title="新建角色"
    :visible.sync="showDialog"
    width="720px"
    :before-close="handleClose"
  >
    <!-- 基本信息 -->
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="角色名称" prop="roleName">
        <el-input
          v-model="form.roleName"
          maxlength="20"
          show-word-limit
          placeholder="请输入角色名称"
        />
      </el-form-item>

      <el-form-item label="角色描述">
        <el-input
          v-model="form.roleDesc"
          maxlength="20"
          show-word-limit
          placeholder="请输入角色描述"
        />
      </el-form-item>

      <el-form-item label="启用状态">
        <el-switch
          v-model="form.status"
          active-value="enabled"
          inactive-value="disabled"
        />
      </el-form-item>
      <el-form-item label="权限设置">
        <el-table :data="permissionList">
          <el-table-column props="" label="菜单权限">
            <template slot-scope="{ row }">
              <el-checkbox v-model="row.view" />
            </template>
          </el-table-column>
          <el-table-column props="" label="操作权限">
            <template slot-scope="{ row }">
              <el-checkbox v-model="row.view" />
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>

    <!-- 权限设置 -->
    <!-- <div class="permission-title">权限设置</div> -->

    <!-- <el-table :data="permissionList" border>
      <el-table-column prop="moduleName" label="功能模块" width="160" />

      <el-table-column label="查看">
        <template slot-scope="{ row }">
          <el-checkbox v-model="row.view" />
        </template>
      </el-table-column>

      <el-table-column label="新增">
        <template slot-scope="{ row }">
          <el-checkbox v-model="row.create" />
        </template>
      </el-table-column>

      <el-table-column label="编辑">
        <template slot-scope="{ row }">
          <el-checkbox v-model="row.edit" />
        </template>
      </el-table-column>

      <el-table-column label="删除">
        <template slot-scope="{ row }">
          <el-checkbox v-model="row.delete" />
        </template>
      </el-table-column>
    </el-table> -->

    <!-- footer -->
    <span slot="footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit"> 确定 </el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  name: "RoleCreateDialog",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    showDialog: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit("update:visible", val);
      },
    },
  },
  data() {
    return {
      form: {
        roleName: "",
        roleDesc: "",
        status: "enabled",
      },
      rules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          { max: 20, message: "最多20个字符", trigger: "blur" },
        ],
      },
      permissionList: [
        {
          module: "org",
          moduleName: "机构管理",
          view: false,
          create: false,
          edit: false,
          delete: false,
        },
        {
          module: "role",
          moduleName: "角色管理",
          view: false,
          create: false,
          edit: false,
          delete: false,
        },
        {
          module: "user",
          moduleName: "用户管理",
          view: false,
          create: false,
          edit: false,
          delete: false,
        },
      ],
    };
  },
  methods: {
    handleSubmit() {
      this.$refs.form.validate((valid) => {
        if (!valid) return;

        const permissions = this.permissionList
          .filter((p) => p.view || p.create || p.edit || p.delete)
          .map((p) => ({
            module: p.module,
            actions: {
              view: p.view,
              create: p.create,
              edit: p.edit,
              delete: p.delete,
            },
          }));

        if (!permissions.length) {
          this.$message.warning("请至少勾选一个权限");
          return;
        }

        const payload = {
          ...this.form,
          permissions,
        };

        // 🚩 接口预留
        this.$api.createRole(payload).then(() => {
          this.$message.success("新建角色成功");
          this.$emit("success");
          this.handleClose();
        });
      });
    },
    handleClose() {
      this.$refs.form && this.$refs.form.resetFields();
      this.resetPermissions();
      this.$emit("update:visible", false);
    },
    resetPermissions() {
      this.permissionList.forEach((p) => {
        p.view = p.create = p.edit = p.delete = false;
      });
    },
  },
};
</script>
