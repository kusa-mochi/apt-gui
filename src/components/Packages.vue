<template>
  <div id="packages">
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
      <el-button @click="repositoryDialogVisible = true"
        >Install New Package</el-button
      >
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
    <el-dialog
      id="repository-dialog"
      :visible.sync="repositoryDialogVisible"
      fullscreen
      title="Package Repository"
      top="20px"
    >
      <div class="repository-dialog__body">
        <div class="repository-operations">
          <el-input
            @keydown.enter.native="OnRepositorySearchInput($event.keyCode)"
            placeholder="Search for repository"
            prefix-icon="el-icon-search"
            v-model="repositorySearchQuery"
            class="search-repository-input"
            clearable
          >
            <el-select
              v-model="repositorySearchSelect"
              slot="prepend"
              placeholder="method"
            >
              <el-option label="prefix search" value="prefix"></el-option>
              <el-option label="end match" value="end"></el-option>
              <el-option label="exact match" value="exact"></el-option>
              <el-option label="partial match" value="partial"></el-option>
            </el-select>
          </el-input>
          <el-button type="text" class="apt-update-button">
            <img width="20" src="@/assets/icn_update.svg?data" />
          </el-button>
        </div>
        <div class="repository-package-table-container">
          <el-table
            ref="repository-package-table"
            :data="repositoryPackageList"
            class="repository-package-table"
            height="366"
          >
            <el-table-column label="package name" prop="name" sortable>
            </el-table-column>
            <el-table-column label="version" prop="version"> </el-table-column>
          </el-table>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="repositoryDialogVisible = false"
          >OK</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      packageSearchQuery: "",
      repositoryDialogVisible: false,
      repositoryPackageList: [],
      repositorySearchQuery: "",
      repositorySearchSelect: "prefix",
      installedPackageList: []
    };
  },
  methods: {
    OnInstalledPackageSearchInput(value) {
      console.log(value);
    },
    async OnRepositorySearchInput(keyCode) {
      if(keyCode !== 13) return;

      // reset the list
      this.repositoryPackageList = [];

      // apt args
      let commandArgs = "";

      console.log(this.repositorySearchSelect);

      switch (this.repositorySearchSelect) {
        case "prefix":
          commandArgs = `search ^${this.repositorySearchQuery} --names-only | grep -E "^${this.repositorySearchQuery}[^\\s]*\\s+.*" | awk -F'[/]' '{print $1 $2}'`;
          break;
        case "end":
          commandArgs = `search ${this.repositorySearchQuery}$ --names-only | grep -E "[^\\s]*${this.repositorySearchQuery}\\s+.*" | awk -F'[/]' '{print $1 $2}'`;
          break;
        case "exact":
          commandArgs = `search ^${this.repositorySearchQuery}$ --names-only | grep -E "^${this.repositorySearchQuery}\\s+.*" | awk -F'[/]' '{print $1 $2}'`;
          break;
        case "partial":
          commandArgs = `search ${this.repositorySearchQuery} --names-only | grep -E "[^\\s]*${this.repositorySearchQuery}[^\\s]*\\s+.*" | awk -F'[/]' '{print $1 $2}'`;
          break;
        default:
          throw "invalid search mode.";
      }
      const packages = await this.$store.dispatch("RunCommand", {
        command: "apt",
        args: commandArgs,
        sudo: false
      });
      const packageNames = packages.split("\n");

      packageNames.forEach(line => {
        const name = line.split("/")[0];
        const version = line.split(" ")[1];
        this.repositoryPackageList.push({
          name: name,
          version: version
        });
      });

      console.log(packages);
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

        // TODO: for debugging
        const updateExist = name === "code";

        this.installedPackageList.push({
          name: name,
          version: match[1],
          upgradable: updateExist
        });
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

#repository-dialog {
  .repository-operations {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: flex-start;
    align-content: center;
  }

  .search-repository-input {
    width: unset;
  }

  .apt-update-button {
    padding: 8px;
  }

  .repository-package-table {
  }
}
</style>
