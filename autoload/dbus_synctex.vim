
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
