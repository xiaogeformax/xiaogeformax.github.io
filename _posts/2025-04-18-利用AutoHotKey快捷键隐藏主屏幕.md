### 利用AutoHotKey实现隐藏主桌面窗口快捷键

win+d  双屏情况下，win+d只隐藏主桌面窗口
```
#NoEnv
SendMode Input
SetWorkingDir %A_ScriptDir%

#D::
    ; 获取主显示器信息
    SysGet, MonitorPrimary, MonitorPrimary
    SysGet, MonitorWorkArea, MonitorWorkArea, %MonitorPrimary%

    ; 遍历所有窗口
    WinGet, windowList, List
    Loop, %windowList%
    {
        windowID := windowList%A_Index%
        WinGetTitle, title, ahk_id %windowID%
        WinGet, style, Style, ahk_id %windowID%
        WinGet, exStyle, ExStyle, ahk_id %windowID%
        WinGet, isMinimized, MinMax, ahk_id %windowID%

        ; 跳过无效窗口（无标题、隐藏、工具窗口、已最小化）
        if (title = "" || !(style & 0x10000000) || (exStyle & 0x80) || isMinimized = -1)
            continue

        ; 获取窗口位置和大小
        WinGetPos, winX, winY, winW, winH, ahk_id %windowID%

        ; 计算窗口中心点
        centerX := winX + winW / 2
        centerY := winY + winH / 2

        ; 检查窗口中心是否在主显示器工作区内
        if (centerX >= MonitorWorkAreaLeft && centerX <= MonitorWorkAreaRight
            && centerY >= MonitorWorkAreaTop && centerY <= MonitorWorkAreaBottom)
        {
            ; 最小化窗口
            WinMinimize, ahk_id %windowID%
        }
    }
return
```


