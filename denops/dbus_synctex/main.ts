import { assert, dbus, is } from "./deps.ts";
import type { Denops } from "./deps.ts";

export function main(denops: Denops) {
  let bus: dbus.MessageBus | undefined;
  let tmpCallback: string | undefined;

  async function findWindowInterface(
    pdfPath: string,
  ): Promise<dbus.ClientInterface | undefined> {
    if (bus === undefined) {
      console.warn("Session bus is not created");
      return undefined;
    }
    const obj = await bus.getProxyObject(
      "org.gnome.evince.Daemon",
      "/org/gnome/evince/Daemon",
    );
    const daemon = obj.getInterface("org.gnome.evince.Daemon");
    const pdfURI = `file://${pdfPath}`;
    const owner: string = await daemon.FindDocument(
      pdfURI,
      false,
    );
    if (owner === "") {
      return undefined;
    }
    const evince = await bus.getProxyObject(
      owner,
      "/org/gnome/evince/Evince",
    );
    const app = evince.getInterface("org.gnome.evince.Application");
    const windowList = await app.GetWindowList();
    if (windowList.length === 0) {
      throw new Error("No window found");
    }
    const windowPath = windowList[0];
    const windowProxy = await bus.getProxyObject(owner, windowPath);
    const window = windowProxy.getInterface("org.gnome.evince.Window");
    return window;
  }

  denops.dispatcher = {
    createSessionBus(): Promise<void> {
      bus = dbus.sessionBus();
      return Promise.resolve();
    },
    destroySessionBus(): Promise<void> {
      if (bus === undefined) {
        return Promise.resolve();
      }
      bus.disconnect();
      bus = undefined;
      return Promise.resolve();
    },
    async syncView(
      texPath: unknown,
      pdfPath: unknown,
      line: unknown,
      column: unknown,
    ): Promise<void> {
      assert(texPath, is.String);
      assert(pdfPath, is.String);
      assert(line, is.Number);
      assert(column, is.Number);
      const window = await findWindowInterface(pdfPath);
      if (window === undefined) {
        console.warn("No window found");
        return;
      }
      await window.SyncView(
        texPath,
        [line, column],
        0,
      );
    },
    registerCallback(
      callback: unknown,
    ): Promise<void> {
      assert(callback, is.String);
      if (bus === undefined) {
        throw new Error("Session bus is not created");
      }
      tmpCallback = callback;
      return Promise.resolve();
    },
    async registerSyncSource(
      pdfPath: unknown,
    ): Promise<void> {
      assert(pdfPath, is.String);
      const window = await findWindowInterface(pdfPath);
      if (tmpCallback === undefined) {
        throw new Error("Callback is not registered");
      }
      if (window === undefined) {
        console.warn("No window found");
        return;
      }
      window.on(
        "SyncSource",
        async (path: string, point: [number, number], time: number) => {
          await denops.call(
            "denops#callback#call",
            tmpCallback,
            path,
            point[0],
            point[1],
            time,
          );
        },
      );
    },
  };
}
