<template>
  <div id="repository-packages">
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
</template>

<script>
export default {
  data() {
    return {
      repositoryPackageList: [],
      repositorySearchQuery: "",
      repositorySearchSelect: "prefix"
    };
  },
  methods: {
    async OnRepositorySearchInput(keyCode) {
      // if not enter key pressed.
      if (keyCode !== 13) return;

      // reset the list
      this.repositoryPackageList = [];

      // commands and sudo flag.
      let dataToDispatch = null;

      // switch by search mode.
      switch (this.repositorySearchSelect) {
        case "prefix":
          dataToDispatch = {
            sudo: false,
            commands: [
              {
                command: "apt",
                args: `search ^${this.repositorySearchQuery} --names-only`
              },
              {
                command: "grep",
                args: `-E "^${this.repositorySearchQuery}[^\\s]*\\s+.*"`
              }
            ]
          };
          break;
        case "end":
          dataToDispatch = {
            sudo: false,
            commands: [
              {
                command: "apt",
                args: `search ${this.repositorySearchQuery}$ --names-only`
              },
              {
                command: "grep",
                args: `-E "^[^\\s]*${this.repositorySearchQuery}/[^\\s]*\\s+.*"`
              }
            ]
          };
          break;
        case "exact":
          dataToDispatch = {
            sudo: false,
            commands: [
              {
                command: "apt",
                args: `search ^${this.repositorySearchQuery}$ --names-only`
              },
              {
                command: "grep",
                args: `-E "^${this.repositorySearchQuery}[^\\s]*\\s+.*"`
              }
            ]
          };
          break;
        case "partial":
          dataToDispatch = {
            sudo: false,
            commands: [
              {
                command: "apt",
                args: `search ${this.repositorySearchQuery} --names-only`
              },
              {
                command: "grep",
                args: `-E "^[^\\s\\t]*${this.repositorySearchQuery}[^\\s\\t]*\\s+.*"`
              }
            ]
          };
          break;
        default:
          throw "invalid search mode.";
      }
      const packages = await this.$store.dispatch("RunCommand", dataToDispatch);
      const packageNames = packages.split("\n");

      packageNames.forEach(line => {
        const name = line.split("/")[0];
        const version = line.split(" ")[1];
        this.repositoryPackageList.push({
          name: name,
          version: version
        });
      });
    }
  },
  name: "RepositoryPackages"
};
</script>

<style>
.repository-operations {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  align-content: flex-start;
}
</style>
