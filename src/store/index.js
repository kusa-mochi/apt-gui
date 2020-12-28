import Vue from "vue";
import Vuex from "vuex";
import { ipcRenderer } from "electron";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {
    async RunCommandMutation(state, data) {
      await ipcRenderer.invoke(
        data.sudo === true
          ? "do-command-as-sudo"
          : "do-command-as-general-user",
        { command: data.command, args: data.args }
      );
    }
  },
  actions: {
    RunCommand(context, data) {
      if (
        data.command === undefined ||
        data.command === null ||
        data.command === "" ||
        data.sudo === undefined ||
        data.sudo === null ||
        (data.sudo !== true && data.sudo !== false)
      )
        return;

      context.commit("RunCommandMutation", data);
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
