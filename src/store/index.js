import Vue from "vue";
import Vuex from "vuex";
import { ipcRenderer } from "electron";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {
    async RunCommand(context, data) {
      if (
        data.command === undefined ||
        data.command === null ||
        data.command === "" ||
        data.sudo === undefined ||
        data.sudo === null ||
        (data.sudo !== true && data.sudo !== false)
      )
        return;

      const ret = await ipcRenderer.invoke(
        data.sudo === true
          ? "do-command-as-sudo"
          : "do-command-as-general-user",
        { command: data.command, args: data.args }
      );

      return ret;
    }
  },
  modules: {}
});
