### SVN利用AutoHotKey快捷键


```
#NoEnv  ; 推荐使用
SetWorkingDir %A_ScriptDir%  ; 确保一致的起始目录
#SingleInstance, Force

; 获取当前活动窗口路径的函数
GetActiveWindowPath() {
    If WinActive("ahk_class CabinetWClass") || WinActive("ahk_class ExploreWClass") || WinActive("ahk_class 004B4A88"){
        WinHWND := WinActive()
        For win in ComObjCreate("Shell.Application").Windows
            If (win.HWND = WinHWND) {
		currdir := SubStr(win.LocationURL, 9)
		currdir := RegExReplace(currdir, "%20", " ")
                Break
            }
    }
	  return currdir ? currdir : "C:\Users\xxx"
}

; SVN操作函数
SVNCommand(command) {
    path := GetActiveWindowPath()
    Run, TortoiseProc.exe /command:%command% /path:"%path%" /closeonend:2,, UseErrorLevel
    if (ErrorLevel) {
        MsgBox, 执行SVN %command% 命令时出错。请确保TortoiseSVN已正确安装。
    }
}

; SVN快捷键定义
^!u::  ; Ctrl+Alt+U - Update
SVNCommand("update")
return

^!c::  ; Ctrl+Alt+C - Commit
SVNCommand("commit")
return

^!l::  ; Ctrl+Alt+L - Log
SVNCommand("log")
return

^!d::  ; Ctrl+Alt+D - Diff
SVNCommand("diff")
return

^!a::  ; Ctrl+Alt+A - Add
SVNCommand("add")
return

^!r::  ; Ctrl+Alt+R - Revert
SVNCommand("revert")
return

^!s::  ; Ctrl+Alt+S - Status
SVNCommand("repostatus")
return

^!b::  ; Ctrl+Alt+B - Branch/Tag
SVNCommand("copy")
return

^!m::  ; Ctrl+Alt+M - Merge
SVNCommand("merge")
return

^!k::  ; Ctrl+Alt+K - Check for modifications
SVNCommand("check")
return

; 显示帮助信息
^!h::  ; Ctrl+Alt+H - Help
MsgBox, 
(
SVN快捷键:
Ctrl+Alt+U: Update
Ctrl+Alt+C: Commit
Ctrl+Alt+L: Log
Ctrl+Alt+D: Diff
Ctrl+Alt+A: Add
Ctrl+Alt+R: Revert
Ctrl+Alt+S: Status
Ctrl+Alt+B: Branch/Tag
Ctrl+Alt+M: Merge
Ctrl+Alt+K: Check for modifications
Ctrl+Alt+H: 显示此帮助
)
return
```
