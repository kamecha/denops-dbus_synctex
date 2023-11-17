
command! DbusSyncView call dbus_synctex#syncViewCWD()

command! DbusRegisterSyncSource call dbus_synctex#registerSyncSource(dbus_synctex#getPdfPathCWD())
