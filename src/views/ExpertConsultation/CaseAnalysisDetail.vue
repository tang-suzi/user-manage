<template>
  <div class="case-analysis-detail">
    <!-- Top Action Bar -->
    <div class="top-bar">
      <el-button-group>
        <el-button type="primary" plain>病例分析</el-button>
        <el-button plain>疑难咨询</el-button>
        <el-button plain>报告审核</el-button>
      </el-button-group>
      <el-button style="float: right" size="small" @click="$router.go(-1)"
        >返回</el-button
      >
    </div>

    <div class="main-content">
      <!-- Left: Slide Viewer -->
      <div class="left-panel">
        <div class="slide-viewer">
          <div class="placeholder-text">玻片图</div>
        </div>
      </div>

      <!-- Right: Info & Analysis -->
      <div class="right-panel">
        <div class="right-content-wrapper">
          <!-- Top Right: Abnormal Karyotype -->
          <div class="section-box karyotype-section">
            <div class="section-header">异常核型</div>
            <div class="karyotype-grid">
              <div class="karyotype-img">
                <div class="img-placeholder"></div>
              </div>
            </div>
          </div>

          <!-- Middle Right: Info Sections -->
          <div class="info-sections">
            <!-- Image Info -->
            <div class="section-box">
              <div class="section-header">图片信息</div>
              <div class="info-content">
                <el-row :gutter="10">
                  <el-col :span="12"
                    ><div class="info-item">
                      <span class="label">玻片号：</span
                      ><span class="value">{{ detail.slideNumber }}</span>
                    </div></el-col
                  >
                  <el-col :span="12"
                    ><div class="info-item">
                      <span class="label">上传时间：</span
                      ><span class="value">{{ detail.uploadTime }}</span>
                    </div></el-col
                  >
                  <el-col :span="12"
                    ><div class="info-item">
                      <span class="label">图像号：</span
                      ><span class="value">{{ detail.imageNumber }}</span>
                    </div></el-col
                  >
                  <el-col :span="12"
                    ><div class="info-item">
                      <span class="label">染色体数：</span
                      ><span class="value highlight">{{
                        detail.chromosomeCount
                      }}</span>
                    </div></el-col
                  >
                </el-row>
              </div>
            </div>

            <!-- Case Info -->
            <div class="section-box">
              <div class="section-header">病例信息及分析状态</div>
              <div class="info-content">
                <el-row :gutter="10">
                  <el-col :span="12"
                    ><div class="info-item">
                      <span class="label">病历号：</span
                      ><span class="value">{{ detail.caseNumber }}</span>
                    </div></el-col
                  >
                  <el-col :span="12"
                    ><div class="info-item">
                      <span class="label">检查项目：</span
                      ><span class="value">{{ detail.checkItem }}</span>
                    </div></el-col
                  >
                  <el-col :span="12"
                    ><div class="info-item">
                      <span class="label">门诊号：</span
                      ><span class="value">{{ detail.outpatientNumber }}</span>
                    </div></el-col
                  >
                  <el-col :span="12"
                    ><div class="info-item">
                      <span class="label">样本种类：</span
                      ><span class="value">{{ detail.sampleType }}</span>
                    </div></el-col
                  >
                  <el-col :span="12"
                    ><div class="info-item">
                      <span class="label">姓名：</span
                      ><span class="value">{{ detail.name }}</span>
                    </div></el-col
                  >
                  <el-col :span="12"
                    ><div class="info-item">
                      <span class="label">性别：</span
                      ><span class="value">{{ detail.gender }}</span>
                    </div></el-col
                  >
                  <el-col :span="12"
                    ><div class="info-item">
                      <span class="label">年龄：</span
                      ><span class="value">{{ detail.age }}</span>
                    </div></el-col
                  >
                  <el-col :span="12"
                    ><div class="info-item">
                      <span class="label">科室：</span
                      ><span class="value">{{ detail.department }}</span>
                    </div></el-col
                  >
                </el-row>
              </div>
            </div>

            <!-- Clinical Diagnosis -->
            <div class="section-box">
              <div class="section-header">临床诊断</div>
              <div class="info-content form-style">
                <el-form label-width="80px" size="small">
                  <el-form-item label="核型结果:">
                    <el-input
                      v-model="detail.karyotypeResult"
                      disabled
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="复核结果:">
                    <el-input
                      type="textarea"
                      v-model="detail.reviewResult"
                      :rows="2"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="结果说明:">
                    <el-input v-model="detail.resultDescription"></el-input>
                  </el-form-item>
                </el-form>
              </div>
            </div>
          </div>
        </div>

        <!-- Far Right: Karyotype Model List -->
        <div class="far-right-panel">
          <div class="section-header">异常核型</div>
          <div class="model-select">
            <el-select placeholder="请选择"></el-select>
            <el-select placeholder="请选择"></el-select>
          </div>
          <div class="model-list">
            <div class="model-item" v-for="i in 20" :key="i">
              <div class="model-label">Label {{ i }}</div>
              <div class="model-img-placeholder"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CaseAnalysisDetail",
  data() {
    return {
      detail: {
        slideNumber: "A",
        uploadTime: "2025-09-28 09:52:21",
        imageNumber: "G_12545.png",
        chromosomeCount: "46",
        caseNumber: "A",
        checkItem: "项目2",
        outpatientNumber: "G_12545.png", // From image
        sampleType: "外周",
        name: "G_12545.png", // From image, seems name is same as img no? Or placeholder
        gender: "男",
        age: "1",
        department: "科室1",
        karyotypeResult: "46,XYY-21",
        reviewResult: "46,XYY-21",
        resultDescription: "46,XYY-21",
      },
    };
  },
  created() {
    // In a real app, fetch data based on this.$route.params.id
    console.log("Viewing detail for ID:", this.$route.params.id);
  },
};
</script>

<style scoped>
.case-analysis-detail {
  height: calc(100vh - 120px); /* Adjust based on layout header height */
  display: flex;
  flex-direction: column;
  background-color: #f0f2f5;
  padding: 10px;
}

.top-bar {
  margin-bottom: 10px;
  background: #fff;
  padding: 10px;
  border-radius: 4px;
}

.main-content {
  display: flex;
  flex: 1;
  gap: 10px;
  overflow: hidden;
}

.left-panel {
  flex: 1;
  background: #fff;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.slide-viewer {
  width: 100%;
  height: 100%;
  background-color: #f2f2f2;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: linear-gradient(
      45deg,
      #e6e6e6 25%,
      transparent 25%,
      transparent 75%,
      #e6e6e6 75%,
      #e6e6e6
    ),
    linear-gradient(
      45deg,
      #e6e6e6 25%,
      transparent 25%,
      transparent 75%,
      #e6e6e6 75%,
      #e6e6e6
    );
  background-size: 20px 20px;
  background-position: 0 0, 10px 10px;
}

.placeholder-text {
  font-size: 24px;
  color: #999;
}

.right-panel {
  width: 550px; /* Increased width for right sidebar area */
  display: flex;
  gap: 10px;
}

.right-content-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
}

.section-box {
  background: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 10px;
}

.section-header {
  font-weight: bold;
  margin-bottom: 10px;
  border-left: 3px solid #409eff;
  padding-left: 8px;
  font-size: 14px;
}

.karyotype-grid {
  height: 200px; /* Approximate height from image */
}

.karyotype-img {
  background: #f5f7fa;
  border: 1px solid #e4e7ed;
  height: 100%;
  width: 100%;
}

.info-content {
  font-size: 12px;
}

.info-item {
  margin-bottom: 8px;
  display: flex;
}

.label {
  color: #606266;
  width: 70px;
  text-align: right;
  display: inline-block;
}

.value {
  color: #303133;
  font-weight: 500;
  flex: 1;
  padding-left: 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.highlight {
  color: #e6a23c; /* Orange color from image */
}

.far-right-panel {
  width: 120px;
  background: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 10px;
  overflow-y: auto;
}

.model-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.model-item {
  border: 1px solid #ebeef5;
  padding: 5px;
}

.model-label {
  font-size: 10px;
  color: #909399;
  margin-bottom: 2px;
}

.model-img-placeholder {
  height: 40px;
  background: #f5f7fa;
}

/* Element UI overrides for compact form */
.form-style >>> .el-form-item {
  margin-bottom: 10px;
}
.form-style >>> .el-form-item__label {
  font-size: 12px;
}
</style>
