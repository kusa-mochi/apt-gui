<template>
  <div id="installed-packages">
    <div class="table-operations">
      <el-input
        @input="OnInstalledPackageSearchInput"
        placeholder="Search for installed packages"
        prefix-icon="el-icon-search"
        v-model="packageSearchQuery"
        class="installed-packages-input"
        clearable
      >
      </el-input>
      <el-button @click="AptUpdate" type="text" class="apt-update-button">
        <img width="20" src="@/assets/icn_update.svg?data" />
      </el-button>
    </div>
    <div class="package-table-container">
      <el-table
        ref="package-table"
        :data="installedPackageList"
        :row-class-name="TableRowStatus"
        class="package-table"
        height="560"
      >
        <el-table-column type="selection"></el-table-column>
        <el-table-column label="package name" prop="name" sortable>
        </el-table-column>
        <el-table-column label="version" prop="version"> </el-table-column>
        <el-table-column fixed="right" label="Operations" width="160">
          <template slot-scope="scope">
            <el-button :disabled="!scope.row.upgradable">Update</el-button>
            <el-button type="info" icon="el-icon-delete" circle></el-button>
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
      packageSearchQuery: "",
      installedPackageList: []
    };
  },
  methods: {
    async AptUpdate() {
      await this.$store.dispatch("RunCommand", {
        sudo: true,
        commands: [
          {
            command: "apt",
            args: "update"
          }
        ]
      });
    },
    OnInstalledPackageSearchInput(value) {
      console.log(value);
    },
    TableRowStatus({ row }) {
      if (row.upgradable) {
        return "upgradable-row";
      }
      return "newest-row";
    },
    async UpdatePackageList() {
      // reset the list.
      this.installedPackageList = [];

      // list packages that user installed manually.
      const manualInstalledPackages = await this.$store.dispatch("RunCommand", {
        sudo: false,
        commands: [
          {
            command: "apt-mark",
            args: "showmanual"
          }
        ]
      });

      // package list with version numbers. (contains packages that system installed automatically.)
      const dpkgReturns = await this.$store.dispatch("RunCommand", {
        sudo: false,
        commands: [
          {
            command: "dpkg",
            args: "-l"
          }
        ]
      });

      const packageNames = manualInstalledPackages.split("\n");
      packageNames.pop(); // remove blank line at the end.
      packageNames.forEach(name => {
        // // package status
        // const desiredState = line.substring(0, 1);
        // const currentState = line.substring(1, 2);
        // const errorState =
        //   line.substring(2, 3) === " " ? "" : line.substring(2, 3);

        // extract a version number.
        const regExp = new RegExp("[^ ]+ +" + name + " +([^ ]*)");
        const match = dpkgReturns.match(regExp);

        // TODO: for debugging
        const updateExist = name === "code";

        this.installedPackageList.push({
          name: name,
          version: match[1],
          upgradable: updateExist
          // desiredPackageState: desiredState,
          // currentPackageState: currentState,
          // errorState: errorState
        });
      });
    }
  },
  async mounted() {
    await this.UpdatePackageList();
  },
  name: "InstalledPackages"
};
</script>

<style lang="scss" scoped>
#installed-packages {
  .installed-packages-input {
    width: unset;
  }
}
</style>
