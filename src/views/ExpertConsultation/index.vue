<template>
  <div class="app-container">
    <div class="header-actions">
      <el-button type="primary" class="consult-btn">咨询</el-button>
    </div>

    <el-tabs
      v-model="activeName"
      type="border-card"
      @tab-click="handleTabClick"
    >
      <el-tab-pane label="病例分析" name="case_analysis">
        <consultation-list type="case_analysis" ref="case_analysis" />
      </el-tab-pane>
      <!-- <el-tab-pane label="疑难咨询" name="difficult_consultation">
        <consultation-list type="difficult_consultation" ref="difficult_consultation" />
      </el-tab-pane>
      <el-tab-pane label="报告审核" name="report_review">
        <consultation-list type="report_review" ref="report_review" />
      </el-tab-pane> -->
    </el-tabs>
  </div>
</template>

<script>
import ConsultationList from "./components/ConsultationList";

export default {
  name: "ExpertConsultation",
  components: { ConsultationList },
  data() {
    return {
      activeName: "case_analysis",
    };
  },
  methods: {
    handleTabClick(tab, event) {
      console.log(event);
      // Optional: Refresh list on tab switch if needed
      // this.$refs[tab.name].getList()
    },
  },
};
</script>

<style scoped>
.app-container {
  position: relative;
  padding: 20px;
}
.header-actions {
  position: absolute;
  top: 25px; /* Adjust based on tabs height */
  right: 40px;
  z-index: 100;
}
</style>
