import Vue from "vue";
import Vuex from "vuex";
import { ipcRenderer } from "electron";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {
    async DoCommandAsGeneralUserMutation(state, data) {
      await ipcRenderer.invoke("do-command-as-general-user", data);
    },
    async DoCommandAsSudoMutation(state, data) {
      await ipcRenderer.invoke("do-command-as-sudo", data);
    }
  },
  actions: {
    DoCommandAsGeneralUser(context, data) {
      if (
        data.command === undefined ||
        data.command === null ||
        data.command === ""
      )
        return;

      context.commit("DoCommandAsGeneralUserMutation", data);
    },
    DoCommandAsSudo(context, data) {
      if (
        data.command === undefined ||
        data.command === null ||
        data.command === ""
      )
        return;

      context.commit("DoCommandAsSudoMutation", data);
    }
  },
  modules: {}
});

ipcRenderer.on("do-command-as-general-user__reply", (event, arg) => {
  alert(arg);
});
ipcRenderer.on("do-command-as-general-user__error", (event, arg) => {
  alert(`error occured !!! : ${arg}`);
});
ipcRenderer.on("do-command-as-sudo__reply", (event, arg) => {
  alert(arg);
});
ipcRenderer.on("do-command-as-sudo__error", (event, arg) => {
  alert(`error occured !!! : ${arg}`);
});
