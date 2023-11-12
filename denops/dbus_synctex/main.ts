import { dbus } from "./deps.ts";
import type { Denops } from "./deps.ts";

export async function main(denops: Denops) {
  const bus = dbus.sessionBus();
  await bus.requestName("denops.dbus", 0);
  const obj = await bus.getProxyObject(
    "org.gnome.evince.Daemon",
    "/org/gnome/evince/Daemon",
  );

  denops.dispatcher = {
    async syncView(
      texPath: unknown,
      pdfPath: unknown,
      line: unknown,
      column: unknown,
    ): Promise<void> {
      const daemon = obj.getInterface("org.gnome.evince.Daemon");
      const pdfURI = `file://${pdfPath}`;
      const owner: string = await daemon.FindDocument(
        pdfURI,
        false,
      );
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
      await window.SyncView(
        texPath,
        [line, column],
        0,
      );
    },
    async registerSyncSource(
      pdfPath: unknown,
      callback: unknown,
    ): Promise<void> {
      const daemon = obj.getInterface("org.gnome.evince.Daemon");
      const pdfURI = `file://${pdfPath}`;
      const owner: string = await daemon.FindDocument(
        pdfURI,
        false,
      );
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
      window.on(
        "SyncSource",
        async (path: string, point: [number, number], time: number) => {
          await denops.call(
            "denops#callback#call",
            callback,
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
