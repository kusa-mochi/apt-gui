<template>
  <div id="packages">
    <div class="table-operations">
      <el-button>Reset All Filters</el-button>
    </div>
    <div class="package-table-container">
      <el-table ref="package-table" :data="tableData" class="package-table">
        <el-table-column label="package name" prop="name"> </el-table-column>
        <el-table-column label="version" prop="version"> </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: []
    };
  },
  async mounted() {
    const ret = await this.$store.dispatch("RunCommand", {
      command: "apt-mark",
      args: "showmanual",
      sudo: false
    });
    const packageNames = ret.split("\n");
    packageNames.forEach(name => {
      this.tableData.push({ name: name, version: "1.0.0" });
    });
  },
  name: "Packages"
};
</script>

<style lang="scss" scoped>
.package-table {
  width: 100%;
}
</style>
