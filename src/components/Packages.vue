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
  methods: {
    async UpdatePackageList() {
      // list packages that user installed manually.
      const manualInstalledPackages = await this.$store.dispatch("RunCommand", {
        command: "apt-mark",
        args: "showmanual",
        sudo: false
      });
      // package list with version numbers. (contains packages that system installed automatically.)
      const dpkgReturns = await this.$store.dispatch("RunCommand", {
        command: "dpkg",
        args: "-l | grep '^ii'",
        sudo: false
      });
      const packageNames = manualInstalledPackages.split("\n");
      packageNames.pop(); // remove blank line on end.
      packageNames.forEach(name => {
        const regExp = new RegExp("ii +" + name + " +([^ ]*)");
        const match = dpkgReturns.match(regExp);
        this.tableData.push({ name: name, version: match[1] });
      });
    }
  },
  async mounted() {
    await this.UpdatePackageList();
  },
  name: "Packages"
};
</script>

<style lang="scss" scoped>
.package-table {
  width: 100%;
}
</style>
