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
        data === undefined ||
        data === null ||
        data.commands === undefined ||
        data.commands === null ||
        data.commands.length === undefined ||
        data.commands.length === null ||
        data.commands.length < 1 ||
        (data.sudo !== true && data.sudo !== false)
      )
        return;

      let commandString = "";

      for (let iCommand = 0; iCommand < data.commands.length; iCommand++) {
        if (
          data.commands[iCommand].command === undefined ||
          data.commands[iCommand].command === null ||
          data.commands[iCommand].command === ""
        )
          return;

        commandString += data.commands[iCommand].command;
        if (
          data.commands[iCommand].args !== undefined &&
          data.commands[iCommand].args !== null &&
          data.commands[iCommand].args.length > 0
        ) {
          commandString += " " + data.commands[iCommand].args;
        }

        if (iCommand < data.commands.length - 1) {
          commandString += " | ";
        }
      }

      const ret = await ipcRenderer.invoke(
        data.sudo === true
          ? "do-command-as-sudo"
          : "do-command-as-general-user",
        commandString
      );

      return ret;
    }
  },
  modules: {}
});
