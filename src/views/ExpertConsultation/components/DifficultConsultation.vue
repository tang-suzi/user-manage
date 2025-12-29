<template>
  <div class="difficult-consultation-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.keyword"
        placeholder="请输入病例号/患者姓名"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        搜索
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        新增咨询
      </el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column
        label="病例号"
        prop="caseNumber"
        align="center"
        width="150"
      >
      </el-table-column>
      <el-table-column
        label="患者姓名"
        prop="patientName"
        align="center"
        width="120"
      >
      </el-table-column>
      <el-table-column label="性别" prop="gender" align="center" width="80">
      </el-table-column>
      <el-table-column label="年龄" prop="age" align="center" width="80">
      </el-table-column>
      <el-table-column
        label="申请时间"
        prop="applyDate"
        align="center"
        width="180"
      >
      </el-table-column>
      <el-table-column
        label="申请人"
        prop="applicant"
        align="center"
        width="120"
      >
      </el-table-column>
      <el-table-column
        label="接收专家"
        prop="expert"
        align="center"
        width="120"
      >
      </el-table-column>
      <el-table-column label="状态" prop="status" align="center" width="100">
        <template slot-scope="{ row }">
          <el-tag :type="row.status | statusFilter">
            {{ row.status | statusNameFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="咨询内容" prop="description" align="center">
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="230"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination
        :current-page="listQuery.page"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="listQuery.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- Dialog for Create/Edit -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="病例号" prop="caseNumber">
          <el-input v-model="temp.caseNumber" />
        </el-form-item>
        <el-form-item label="患者姓名" prop="patientName">
          <el-input v-model="temp.patientName" />
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select
            v-model="temp.gender"
            class="filter-item"
            placeholder="请选择"
          >
            <el-option
              v-for="item in ['男', '女']"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model.number="temp.age" />
        </el-form-item>
        <el-form-item label="咨询内容" prop="description">
          <el-input v-model="temp.description" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false"> 取消 </el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getConsultationList,
  createConsultation,
  updateConsultation,
  deleteConsultation,
} from "@/api/consultation";

export default {
  name: "DifficultConsultation",
  filters: {
    statusFilter(status) {
      const statusMap = {
        completed: "success",
        pending: "info",
        processing: "warning",
        rejected: "danger",
      };
      return statusMap[status];
    },
    statusNameFilter(status) {
      const statusMap = {
        completed: "已完成",
        pending: "待审核",
        processing: "处理中",
        rejected: "已拒绝",
      };
      return statusMap[status] || status;
    },
  },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        keyword: undefined,
        type: "difficult_consultation",
      },
      temp: {
        id: undefined,
        caseNumber: "",
        patientName: "",
        gender: "",
        age: "",
        description: "",
        status: "pending",
        consultationType: "difficult_consultation",
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "编辑",
        create: "新增",
      },
      rules: {
        caseNumber: [
          { required: true, message: "病例号是必填项", trigger: "blur" },
        ],
        patientName: [
          { required: true, message: "患者姓名是必填项", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      getConsultationList(this.listQuery).then((response) => {
        this.list = response.data.items;
        this.total = response.data.total;
        this.listLoading = false;
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        caseNumber: "",
        patientName: "",
        gender: "",
        age: "",
        description: "",
        status: "pending",
        consultationType: "difficult_consultation",
      };
    },
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    createData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          createConsultation(this.temp).then(() => {
            this.list.unshift(this.temp);
            this.dialogFormVisible = false;
            this.$notify({
              title: "Success",
              message: "Created Successfully",
              type: "success",
              duration: 2000,
            });
          });
        }
      });
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row); // copy obj
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    updateData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);
          updateConsultation(tempData).then(() => {
            const index = this.list.findIndex((v) => v.id === this.temp.id);
            this.list.splice(index, 1, this.temp);
            this.dialogFormVisible = false;
            this.$notify({
              title: "Success",
              message: "Update Successfully",
              type: "success",
              duration: 2000,
            });
          });
        }
      });
    },
    handleDelete(row) {
      this.$confirm("确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        deleteConsultation(row.id).then(() => {
          this.$notify({
            title: "Success",
            message: "Delete Successfully",
            type: "success",
            duration: 2000,
          });
          const index = this.list.indexOf(row);
          this.list.splice(index, 1);
        });
      });
    },
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList();
    },
  },
};
</script>

<style scoped>
.filter-container {
  padding-bottom: 10px;
}
.pagination-container {
  margin-top: 20px;
}
</style>
