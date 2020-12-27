<template>
  <div id="app">
    <el-button @click="TestMethod">ボタン</el-button>
    <img width="20" src="@/assets/icn_search.svg?data" />
  </div>
</template>

<script>
export default {
  methods: {
    TestMethod() {
      alert("button pushed.");
    }
  },
  name: "App"
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
