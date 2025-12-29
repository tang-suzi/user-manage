<template>
  <el-dialog
    :title="title"
    :visible.sync="showDialog"
    width="900px"
    :before-close="handleClose"
    custom-class="consultation-dialog"
  >
    <div class="dialog-body">
      <el-row :gutter="20">
        <!-- Left Column: Form -->
        <el-col :span="14">
          <el-form
            ref="form"
            :model="form"
            :rules="rules"
            label-width="110px"
            size="small"
          >
            <el-form-item label="咨询类型" prop="consultationType" required>
              <el-checkbox-group v-model="form.consultationType">
                <el-checkbox label="case_analysis">病例分析</el-checkbox>
                <el-checkbox label="difficult_consultation"
                  >疑难咨询</el-checkbox
                >
                <el-checkbox label="report_review">报告审核</el-checkbox>
              </el-checkbox-group>
            </el-form-item>

            <el-form-item label="选择病例" required>
              <div style="display: flex; gap: 10px">
                <el-input
                  v-model="searchCase"
                  placeholder="请输入病例号"
                  style="flex: 1"
                ></el-input>
                <el-button type="primary" @click="handleCaseSearch"
                  >查询</el-button
                >
              </div>
              <div class="case-tree-container">
                <el-tree
                  :data="caseTreeData"
                  :props="defaultProps"
                  @node-click="handleNodeClick"
                  highlight-current
                  default-expand-all
                ></el-tree>
              </div>
            </el-form-item>

            <el-form-item label="接收专家" required>
              <el-row :gutter="10">
                <el-col :span="10">
                  <el-select
                    v-model="form.hospital"
                    placeholder="请选择医院"
                    style="width: 100%"
                  >
                    <el-option
                      label="上海新华医院"
                      value="shanghai_xinhua"
                    ></el-option>
                    <el-option
                      label="北京协和医院"
                      value="beijing_xiehe"
                    ></el-option>
                  </el-select>
                </el-col>
                <el-col :span="10">
                  <el-select
                    v-model="form.expert"
                    placeholder="请选择专家"
                    style="width: 100%"
                  >
                    <el-option label="张三" value="zhangsan"></el-option>
                    <el-option label="李四" value="lisi"></el-option>
                  </el-select>
                </el-col>
              </el-row>
            </el-form-item>

            <el-form-item label="期望确认时间" prop="expectedTime" required>
              <el-date-picker
                v-model="form.expectedTime"
                type="datetime"
                placeholder="选择日期时间"
                style="width: 100%"
                value-format="yyyy-MM-dd HH:mm:ss"
              >
              </el-date-picker>
            </el-form-item>

            <el-form-item label="紧急度" prop="urgency">
              <el-radio-group v-model="form.urgency">
                <el-radio label="普通">普通</el-radio>
                <el-radio label="紧急">紧急</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </el-col>

        <!-- Right Column: Case Info Card -->
        <el-col :span="10">
          <el-card class="box-card case-info-card">
            <div slot="header" class="clearfix" style="text-align: center">
              <span>病例信息</span>
            </div>
            <div class="case-info-content">
              <el-row :gutter="10" class="info-row">
                <el-col :span="12">姓名: {{ caseInfo.name }}</el-col>
                <el-col :span="12">性别: {{ caseInfo.gender }}</el-col>
              </el-row>
              <el-row :gutter="10" class="info-row">
                <el-col :span="12"
                  >门诊号: {{ caseInfo.outpatientNumber }}</el-col
                >
                <el-col :span="12">年龄: {{ caseInfo.age }}</el-col>
              </el-row>
              <el-row :gutter="10" class="info-row">
                <el-col :span="12">样本种类: {{ caseInfo.sampleType }}</el-col>
                <el-col :span="12">状态: {{ caseInfo.status }}</el-col>
              </el-row>
              <el-row :gutter="10" class="info-row">
                <el-col :span="12">检查项目: {{ caseInfo.testItem }}</el-col>
                <el-col :span="12">科室: {{ caseInfo.department }}</el-col>
              </el-row>
              <el-row :gutter="10" class="info-row">
                <el-col :span="12">类型: {{ caseInfo.type }}</el-col>
                <el-col :span="12">检查时间: {{ caseInfo.testTime }}</el-col>
              </el-row>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleSave">保 存</el-button>
      <el-button type="primary" @click="handleSubmit">提交咨询</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { updateConsultation } from "@/api/consultation";

export default {
  name: "ConsultationDialog",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    formData: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      title: "编辑咨询",
      searchCase: "",
      form: {
        id: undefined,
        consultationType: [],
        hospital: "",
        expert: "",
        expectedTime: "",
        urgency: "普通",
      },
      caseInfo: {
        name: "",
        gender: "",
        outpatientNumber: "",
        age: "",
        sampleType: "",
        status: "",
        testItem: "",
        department: "",
        type: "",
        testTime: "",
      },
      caseTreeData: [
        {
          label: "G_10020",
          children: [
            {
              label: "A",
              isLeaf: true,
            },
          ],
        },
        { label: "G_10020" },
        { label: "G_10020" },
        { label: "G_10020" },
        { label: "G_10020" },
        { label: "G_10020" },
        { label: "G_10020" },
      ],
      defaultProps: {
        children: "children",
        label: "label",
      },
      rules: {
        consultationType: [
          {
            type: "array",
            required: true,
            message: "请选择咨询类型",
            trigger: "change",
          },
        ],
        expectedTime: [
          { required: true, message: "请选择期望确认时间", trigger: "change" },
        ],
        urgency: [
          { required: true, message: "请选择紧急度", trigger: "change" },
        ],
      },
    };
  },
  computed: {
    showDialog() {
      return this.visible;
    },
  },
  watch: {
    formData: {
      handler(val) {
        if (val) {
          this.form = {
            id: val.id,
            consultationType: val.consultationType
              ? [val.consultationType]
              : [],
            hospital: val.hospital || "shanghai_xinhua",
            expert: val.expert || "", // Receiving expert name mapping
            expectedTime:
              val.remainingTime === "超时" ? "" : "2025-12-12 12:12:12", // Mock logic for demo
            urgency: val.urgency || "普通",
          };
          // Populate Case Info (Mock logic based on row data)
          this.caseInfo = {
            name: val.patientName || "",
            gender: val.gender || "",
            outpatientNumber: val.sampleNumber || "",
            age: val.age || "",
            sampleType: "血液", // Mock
            status: val.status || "",
            testItem: "血常规", // Mock
            department: "检验科", // Mock
            type: "常规", // Mock
            testTime: val.createTime || "",
          };
          this.searchCase = val.caseNumber || "G_10020";
        }
      },
      immediate: true,
    },
  },
  methods: {
    handleClose() {
      this.$emit("update:visible", false);
      this.$refs.form.resetFields();
    },
    handleCaseSearch() {
      // Mock search logic
      this.$message.info("查询功能模拟：已更新病例树");
    },
    handleNodeClick(data) {
      // Mock node click to update right side info
      console.log(data);
    },
    handleSave() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          // Call API to save (Update)
          updateConsultation(this.form).then(() => {
            this.$message.success("保存成功");
            this.$emit("success");
            this.handleClose();
          });
        }
      });
    },
    handleSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          // Similar to save but maybe status change? User just said "Submit Consultation"
          updateConsultation({ ...this.form, status: "processing" }).then(
            () => {
              this.$message.success("提交咨询成功");
              this.$emit("success");
              this.handleClose();
            }
          );
        }
      });
    },
  },
};
</script>

<style scoped>
.dialog-body {
  padding: 10px;
}
.case-tree-container {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  height: 200px;
  overflow-y: auto;
  margin-top: 10px;
  padding: 5px;
}
.case-info-card {
  height: 100%;
}
.info-row {
  margin-bottom: 15px;
  font-size: 14px;
  color: #606266;
}
</style>
