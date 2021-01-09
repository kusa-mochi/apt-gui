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
        <el-table-column label="newest" prop="newVersion"></el-table-column>
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
        // html class name on an upgradable package row.
        // Its style is defined in style tag below.
        return "upgradable-row";
      }
      // html class name on a non-upgradable package row.
      // Its style is defined in style tag below.
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
            command: "dpkg",
            args: "-l"
          },
          {
            command: "grep",
            args: '-E "^[^|]+\\s+.*"'
          },
          {
            command: "awk",
            args: "'{print $2}'"
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

      // upgradable package list
      const upgradablePackages = await this.$store.dispatch("RunCommand", {
        sudo: false,
        commands: [
          {
            command: "apt",
            args: "list --upgradable"
          }
        ]
      });
      const upgradablePackageList = upgradablePackages.split("\n");

      const packageNames = manualInstalledPackages.split("\n");
      packageNames.pop(); // remove blank line at the end.
      packageNames.forEach(name => {
        const nameForRegex = name.replace("+", "\\+").replace(".", "\\.");
        // extract a current version number.
        const regExp = new RegExp("[^ ]+ +" + nameForRegex + " +([^ ]*)");
        const match = dpkgReturns.match(regExp);
        let newestVersion = "---";
        const upgradablePackage = upgradablePackageList.filter(line => {
          if (line.split("/")[0] === name) {
            // extract the newest version number.
            newestVersion = line.split("/")[1].split(" ")[1];
            return true;
          }
          return false;
        });
        const updateExist = upgradablePackage.length > 0;

        this.installedPackageList.push({
          name: name,
          version: match[1],
          newVersion: newestVersion,
          upgradable: updateExist
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
  .table-operations {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
    align-content: flex-start;
  }

  .installed-packages-input {
    width: unset;
  }
}
</style>
