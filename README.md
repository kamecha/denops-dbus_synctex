# denops-dbus_synctex
This vim plugin support syncTeX using dbus, especially evince.

# Requirements
- [deno](https://deno.com/)   
  JavaScript Runtime   
- [vim-denops/denops.vim](https://github.com/vim-denops/denops.vim)  
  An ecosystem of Vim/Neovim which allows developers to write plugins in Deno.  
  you must install this plugin like other plugin.
- [Evince](https://wiki.gnome.org/Apps/Evince)  
  Simply a document viewer
- dbus support  
  maybe, dbus is usually supported on ubuntu.

# Installation
Below are the minimum settings for making it work.
```vim
set rtp+=~/path/to/vim-denops/denops.vim
set rtp+=~/path/to/kamecha/denops-dbus_synctex

autocmd FileType tex call s:TexKeymap()

function! s:TexKeymap() abort
	nnoremap <buffer> <Leader>s <Cmd>:DbusSyncView<CR>
endfunction

function s:syncSource(texPath, line, col, time) abort
	call cursor([a:line, a:col < 0 ? 1 : a:col])
endfunction

function s:initSyncTeX() abort
	" create bus for link evince and vim
	call dbus_synctex#createSessionBus()
	" register syncSource callback to denops
	call dbus_synctex#registerCallback(function("s:syncSource"))
	" register denops's syncSource callback to evince.
	" if evince window is not opened, this function does nothing.
	" for command version, use :DbusRegisterSyncSource
	call dbus_synctex#registerSyncSource(dbus_synctex#getCWDPdfPath())
endfunction

autocmd User DenopsPluginPost:dbus_synctex
			\ call s:initSyncTeX()
```