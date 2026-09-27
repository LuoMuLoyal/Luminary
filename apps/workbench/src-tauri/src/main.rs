// Windows 发布版隐藏控制台窗口；debug 版保留以便看日志。
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    workbench_lib::run()
}
