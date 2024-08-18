#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod constants;
mod decrypt;
mod encrypt;
mod utils;

use decrypt::decrypt_data;
use encrypt::encrypt_data;
use tauri::AboutMetadata;
use tauri::Manager;
use tauri::WindowMenuEvent;
use tauri::Wry;
use utils::check_is_encrypted;
use utils::show_file;
use utils::write_data_to_file;

use tauri::{CustomMenuItem, Menu, MenuItem, Submenu};

fn create_menu() -> Menu {
    let settings =
        CustomMenuItem::new("settings".to_string(), "Settings").accelerator("CmdOrCtrl+,");
    let submenu = Submenu::new(
        "File",
        Menu::new()
            .add_native_item(MenuItem::About("mpress".to_string(), AboutMetadata::new()))
            .add_item(settings)
            .add_native_item(MenuItem::Separator)
            .add_native_item(MenuItem::CloseWindow)
            .add_native_item(MenuItem::Quit),
    );
    Menu::new().add_submenu(submenu)
}

fn menu_handler(event: WindowMenuEvent<Wry>) {
    match event.menu_item_id() {
        "settings" => {
            let main = event.window();
            main.emit("open-settings", {})
                .expect("Failed to emit open-settings event");
        }
        _ => {}
    }
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let main = app.get_window("main").unwrap();

            let info = app.package_info();
            let version = &info.version;
            let app_name = &info.name;

            let version_string = format!("v{}.{}.{}", version.major, version.minor, version.patch);
            let title = format!("{} {}", app_name, version_string);

            main.set_title(&title).expect("set_title failed");

            main.set_resizable(false).expect("set_resizable failed");
            main.set_minimizable(false).expect("set_minimizable failed");
            main.set_maximizable(false).expect("set_maximizable failed");
            main.set_always_on_top(true)
                .expect("set_always_on_top failed");
            Ok(())
        })
        .menu(create_menu())
        .on_menu_event(menu_handler)
        .invoke_handler(tauri::generate_handler![
            decrypt_data,
            encrypt_data,
            write_data_to_file,
            check_is_encrypted,
            show_file,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
