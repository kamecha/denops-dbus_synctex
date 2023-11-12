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
  };
}
