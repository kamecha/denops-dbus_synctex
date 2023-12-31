# denops-dbus_synctex
This vim plugin support syncTeX using dbus, especially evince.

# Features
- SyncView  
	<img src="https://github.com/kamecha/denops-dbus_synctex/assets/50443168/da5503a9-8f3c-4a6d-b2c6-34fb3d9beee3" width="60%">

- SyncSource (Easy to customize)  
  	Ex. customize callback using nvim-notify  
	<img src="https://github.com/kamecha/denops-dbus_synctex/assets/50443168/7426ce27-e675-4117-aa66-7a110e3c3be4" width="60%">

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

For init.vim (or .vimrc)
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
	call dbus_synctex#registerSyncSource(dbus_synctex#getPdfPathCWD())
endfunction

autocmd User DenopsPluginPost:dbus_synctex
			\ call s:initSyncTeX()
```

For init.lua
```lua
vim.opt.rtp:append("~/path/to/vim-denops/denops.vim")
vim.opt.rtp:append("~/path/to/kamecha/denops-dbus_synctex")

local syncTex = require("dbus_synctex")

vim.api.nvim_create_autocmd({ "FileType" }, {
	pattern = "tex",
	callback = function ()
		vim.keymap.set("n", "<Leader>s", syncTex.syncViewCWD, { buffer = true })
	end
})

vim.api.nvim_create_autocmd({ "User" }, {
	pattern = "DenopsPluginPost:dbus_synctex",
	callback = function()
		syncTex.createSessionBus()
		syncTex.registerCallback(function (_, line, col, _)
			vim.fn.cursor({ line, col < 0 and 1 or col })
		end)
		syncTex.registerSyncSource(syncTex.getPdfPathCWD())
	end
})
```
