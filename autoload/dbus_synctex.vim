function dbus_synctex#createSessionBus() abort
	call denops#request('dbus_synctex', 'createSessionBus', [])
endfunction

function dbus_synctex#destroySessionBus() abort
	call denops#request('dbus_synctex', 'destroySessionBus', [])
endfunction

function dbus_synctex#syncView(texPath, pdfPath, line, col) abort
	call denops#request(
				\'dbus_synctex',
				\'syncView',
				\[
				\	a:texPath,
				\	a:pdfPath,
				\	a:line,
				\	a:col,
				\])
endfunction

function dbus_synctex#registerCallback(func) abort
	let callback = denops#callback#register(a:func)
	call denops#request(
				\'dbus_synctex',
				\'registerCallback',
				\[
				\	callback,
				\])
endfunction

function dbus_synctex#registerSyncSource(pdfPath) abort
	call denops#request('dbus_synctex', 'registerSyncSource', [a:pdfPath])
endfunction
