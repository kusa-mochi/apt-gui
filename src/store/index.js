import Vue from "vue";
import Vuex from "vuex";
import { ipcRenderer } from "electron";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {
    async DoCommandAsGeneralUserMutation(state, data) {
      const ret = await ipcRenderer.invoke("do-command-as-general-user", data);
      if (ret.error) {
        throw ret.error;
      }
    },
    async DoCommandAsSudoMutation(state, data) {
      const ret = await ipcRenderer.invoke("do-command-as-sudo", data);
      if (ret.error) {
        throw ret.error;
      }
    }
  },
  actions: {
    DoCommandAsGeneralUser(context, data) {
      if (
        data.command === undefined ||
        data.command === null ||
        data.command === ""
      ) return;
      
      context.commit("DoCommandAsGeneralUserMutation", data);
    },
    DoCommandAsSudo(context, data) {
      if (
        data.command === undefined ||
        data.command === null ||
        data.command === ""
      ) return;

      context.commit("DoCommandAsSudoMutation", data);
    }
  },
  modules: {}
});
