
function dbus_synctex#getPdfPath(dir) abort
	return denops#request('dbus_synctex', 'findPdfPath', [a:dir])
endfunction

function dbus_synctex#getPdfPathCWD() abort
	return dbus_synctex#getPdfPath(getcwd())
endfunction

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

function dbus_synctex#syncViewCWD() abort
	let pdfPath = dbus_synctex#getCWDPdfPath()
	if pdfPath ==# ''
		return
	endif
	call dbus_synctex#syncView(expand('%:p'), pdfPath, line('.'), col('.'))
endfunction

function dbus_synctex#registerCallback(func) abort
	let callback = denops#callback#register(a:func)
	call denops#request('dbus_synctex', 'registerCallback', [callback])
endfunction

function dbus_synctex#registerSyncSource(pdfPath) abort
	call denops#request('dbus_synctex', 'registerSyncSource', [a:pdfPath])
endfunction
