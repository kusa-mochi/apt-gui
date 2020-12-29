<template>
  <div id="packages">
    <div class="table-operations">
      <el-button>Reset All Filters</el-button>
    </div>
    <div class="package-table-container">
      <el-table
        ref="package-table"
        :data="tableData"
        class="package-table"
        height="560"
      >
        <el-table-column type="selection"></el-table-column>
        <el-table-column label="package name" prop="name" sortable>
        </el-table-column>
        <el-table-column label="version" prop="version"> </el-table-column>
        <el-table-column fixed="right" label="Operations" width="160">
          <template>
            <el-button>Update</el-button>
            <el-button type="danger" icon="el-icon-delete" circle></el-button>
          </template>
        </el-table-column>
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
      // reset the list.
      this.tableData = [];

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
        // extract a version number.
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
#packages {
  .package-table {
    width: 100%;
  }
}
</style>
