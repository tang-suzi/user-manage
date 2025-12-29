<template>
  <div class="consultation-list-container">
    <!-- Search Form -->
    <div class="filter-container">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline">
        <!-- Row 1: Always Visible (partially, based on design description "Tab and Button same row", form below) -->
        <!-- User said: "Form includes: Analysis Mode, Remaining Time, Create Time, Sample No, Order No, Status, Expert Input, Finish Time, Expert Select" -->
        <!-- User said: "Reset and Collapse in form" -->

        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="分析模式">
              <el-select
                v-model="listQuery.analysisMode"
                placeholder="全部"
                clearable
                style="width: 100%"
              >
                <el-option label="自动分析" value="自动分析" />
                <el-option label="手动分析" value="手动分析" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="剩余时间">
              <el-select
                v-model="listQuery.remainingTime"
                placeholder="全部"
                clearable
                style="width: 100%"
              >
                <el-option label="超时" value="超时" />
                <el-option label="4h" value="4h" />
                <el-option label="12h" value="12h" />
                <el-option label="24h" value="24h" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="创建时间">
              <el-date-picker
                v-model="listQuery.createTime"
                type="date"
                placeholder="选择日期"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="样本编号">
              <el-input
                v-model="listQuery.sampleNumber"
                placeholder="请输入"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- Collapsible Area -->
        <div v-show="isExpanded">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="订单编号">
                <el-input
                  v-model="listQuery.orderNumber"
                  placeholder="请输入"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="订单状态">
                <el-select
                  v-model="listQuery.status"
                  placeholder="全部"
                  clearable
                  style="width: 100%"
                >
                  <el-option label="待咨询" value="pending" />
                  <el-option label="咨询中" value="processing" />
                  <el-option label="已完成" value="completed" />
                  <el-option label="已拒绝" value="rejected" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="接收专家">
                <el-input
                  v-model="listQuery.expertName"
                  placeholder="全部"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="完成时间">
                <el-date-picker
                  v-model="listQuery.finishTime"
                  type="date"
                  placeholder="选择日期"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="接收专家">
                <el-select
                  v-model="listQuery.expertSelect"
                  placeholder="请选择"
                  clearable
                  style="width: 100%"
                >
                  <el-option label="专家A" value="A" />
                  <el-option label="专家B" value="B" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- Action Buttons Row (Right aligned as per image suggestion or bottom right of form) -->
        <el-row type="flex" justify="end">
          <el-button type="primary" @click="handleFilter">查询</el-button>
          <el-button @click="resetQuery">重置</el-button>
          <el-button type="text" @click="isExpanded = !isExpanded">
            {{ isExpanded ? "收起" : "展开" }}
            <i
              :class="isExpanded ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
            ></i>
          </el-button>
        </el-row>
      </el-form>
    </div>

    <!-- Table -->
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%; margin-top: 20px"
    >
      <el-table-column
        label="订单编号"
        prop="orderNumber"
        align="center"
        width="120"
      />
      <el-table-column
        label="样本编号"
        prop="sampleNumber"
        align="center"
        width="120"
      />
      <el-table-column
        label="分析模式"
        prop="analysisMode"
        align="center"
        width="100"
      />
      <el-table-column label="紧急度" prop="urgency" align="center" width="80">
        <template slot-scope="{ row }">
          <span
            :style="{ color: row.urgency === '紧急' ? 'red' : 'inherit' }"
            >{{ row.urgency }}</span
          >
        </template>
      </el-table-column>
      <el-table-column
        label="订单状态"
        prop="status"
        align="center"
        width="100"
      >
        <template slot-scope="{ row }">
          <el-tag :type="row.status | statusFilter">{{
            row.status | statusNameFilter
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="剩余时间"
        prop="remainingTime"
        align="center"
        width="100"
      />
      <el-table-column
        label="姓名"
        prop="patientName"
        align="center"
        width="100"
      />
      <el-table-column label="性别" prop="gender" align="center" width="60" />
      <el-table-column label="年龄" prop="age" align="center" width="60" />
      <el-table-column
        label="模型结果"
        prop="aiResult"
        align="center"
        width="100"
      />
      <el-table-column
        label="申请医生"
        prop="applicant"
        align="center"
        width="100"
      />
      <el-table-column
        label="接收专家"
        prop="expert"
        align="center"
        width="100"
      />
      <el-table-column
        label="确认医生"
        prop="confirmDoctor"
        align="center"
        width="100"
      />
      <el-table-column
        label="复核结果"
        prop="reviewResult"
        align="center"
        width="100"
      />
      <el-table-column
        label="创建时间"
        prop="createTime"
        align="center"
        width="160"
      />

      <el-table-column label="操作" align="center" width="280" fixed="right">
        <template>
          <el-button type="text" size="small">编辑</el-button>
          <el-button
            type="text"
            size="small"
            style="color: #f56c6c"
            @click="handleDelete"
            >删除</el-button
          >
          <el-button type="text" size="small" @click="handleWithdraw"
            >撤回</el-button
          >
          <el-button type="text" size="small">查看</el-button>
          <el-button type="text" size="small">再次咨询</el-button>
          <el-button type="text" size="small">拒绝原因</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- Pagination -->
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
  </div>
</template>

<script>
import {
  getConsultationList,
  deleteConsultation,
  withdrawConsultation,
} from "@/api/consultation";

export default {
  name: "ConsultationList",
  props: {
    type: {
      type: String,
      required: true,
    },
  },
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
        pending: "待咨询",
        processing: "咨询中",
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
        type: this.type,
        analysisMode: undefined,
        remainingTime: undefined,
        createTime: undefined,
        sampleNumber: undefined,
        orderNumber: undefined,
        status: undefined,
        expertName: undefined,
        finishTime: undefined,
        expertSelect: undefined,
      },
      isExpanded: false,
    };
  },
  watch: {
    type(val) {
      this.listQuery.type = val;
      this.handleFilter();
    },
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
    resetQuery() {
      this.listQuery = {
        page: 1,
        limit: 20,
        type: this.type,
        analysisMode: undefined,
        remainingTime: undefined,
        createTime: undefined,
        sampleNumber: undefined,
        orderNumber: undefined,
        status: undefined,
        expertName: undefined,
        finishTime: undefined,
        expertSelect: undefined,
      };
      this.getList();
    },
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList();
    },
    handleDelete(row) {
      this.$confirm("仅删除本次咨询订单记录?", "删除咨询订单", {
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        type: "warning",
        confirmButtonClass: "el-button--danger",
      })
        .then(() => {
          deleteConsultation(row.id).then(() => {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.getList();
          });
        })
        .catch(() => {
          // Cancelled
        });
    },
    handleWithdraw(row) {
      this.$confirm("咨询专家将无法查看本次咨询订单", "撤回咨询", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "success",
        iconClass: "el-icon-success",
        customClass: "withdraw-confirm-dialog",
      })
        .then(() => {
          withdrawConsultation(row.id).then(() => {
            this.$message({
              type: "success",
              message: "撤回成功!",
            });
            this.getList();
          });
        })
        .catch(() => {
          // Cancelled
        });
    },
  },
};
</script>

<style scoped>
.filter-container {
  padding: 20px;
  background-color: #fcfcfc;
  border: 1px solid #ebeef5;
  margin-bottom: 20px;
}
.pagination-container {
  margin-top: 20px;
  text-align: right;
}
</style>
