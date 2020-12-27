<template>
  <div id="app">
    <el-tabs tab-position="left">
      <el-tab-pane label="Packages">
        <packages></packages>
      </el-tab-pane>
      <el-tab-pane label="Config">
        <config></config>
      </el-tab-pane>
      <el-tab-pane label="About">
        <about></about>
      </el-tab-pane>
    </el-tabs>
    <!-- <el-button @click="TestMethod">ボタン</el-button>
    <img width="20" src="@/assets/icn_search.svg?data" /> -->
  </div>
</template>

<script>
import Packages from "@/components/Packages";
import Config from "@/components/Config";
import About from "@/components/About";

export default {
  components: {
    Packages,
    Config,
    About
  },
  methods: {
    TestMethod() {
      alert("button pushed.");
    }
  },
  name: "App"
};
</script>
