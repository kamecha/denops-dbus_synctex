
local M = {}

--- get pdf Path under specified directory
-- @param dir string
-- @return string
function M.getPdfPath(dir)
	return vim.fn["dbus_synctex#getPdfPath"](dir)
end

--- get pdf Path under current directory
-- @return string
function M.getPdfPathCurrent()
	return M.getPdfPath(vim.fn.getcwd())
end

return M
