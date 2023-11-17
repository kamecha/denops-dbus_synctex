
local M = {}

--- get pdf Path under specified directory
-- @param dir string
-- @return string
function M.getPdfPath(dir)
	return vim.fn["dbus_synctex#getPdfPath"](dir)
end

--- get pdf Path under current directory
-- @return string
function M.getPdfPathCWD()
	return M.getPdfPath(vim.fn.getcwd())
end

--- create Session Bus for DBus
-- @return nil
function M.createSessionBus()
	vim.fn["dbus_synctex#createSessionBus"]()
end

--- destroy Session Bus for DBus
-- @return nil
function M.destroySessionBus()
	vim.fn["dbus_synctex#destroySessionBus"]()
end

--- sync View
-- @param texPath string
-- @param pdfPath string
-- @param line number
-- @param col number
-- @return nil
function M.syncView(texPath, pdfPath, line, col)
	vim.fn["dbus_synctex#syncView"](texPath, pdfPath, line, col)
end

--- sync View to the pdf under current directory
-- @return nil
function M.syncViewCWD()
	local pdfPath = M.getPdfPathCWD()
	if pdfPath == "" then
		return
	end
	M.syncView(vim.fn.expand("%:p"), pdfPath, vim.fn.line("."), vim.fn.col("."))
end

--- register callback to denops
-- @param func function
-- @return nil
function M.registerCallback(func)
	vim.fn["dbus_synctex#registerCallback"](func)
end

--- register callback which registerd to denops to dbus
-- @param pdfPath string
-- @return nil
function M.registerSyncSource(pdfPath)
	vim.fn["dbus_synctex#registerSyncSource"](pdfPath)
end

return M
