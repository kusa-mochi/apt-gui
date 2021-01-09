<template>
  <div id="packages">
    <el-tabs tab-position="top">
      <el-tab-pane label="Installed">
        <installed-packages></installed-packages>
      </el-tab-pane>
      <el-tab-pane label="repository">
        <repository-packages></repository-packages>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import InstalledPackages from "@/components/InstalledPackages";
import RepositoryPackages from "@/components/RepositoryPackages";

export default {
  components: {
    InstalledPackages,
    RepositoryPackages
  },
  data() {
    return {
      packageSearchQuery: "",
      repositoryPackageList: [],
      repositorySearchQuery: "",
      repositorySearchSelect: "prefix",
      installedPackageList: []
    };
  },
  name: "Packages"
};
</script>

<style lang="scss" scoped>
#packages {
  .package-table {
    width: 100%;
  }

  .table-operations {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: flex-start;
    align-content: flex-start;
  }

  .installed-packages-input {
    width: 250px;
  }
}
</style>
