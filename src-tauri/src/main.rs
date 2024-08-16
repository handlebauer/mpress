#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod constants;
mod decrypt;
mod encrypt;
mod utils;

use decrypt::decrypt_data;
use encrypt::encrypt_data;
use tauri::Manager;
use tauri::WindowBuilder;
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
            .add_item(settings)
            .add_native_item(MenuItem::Separator)
            .add_native_item(MenuItem::CloseWindow)
            .add_native_item(MenuItem::Quit),
    );
    Menu::new().add_submenu(submenu)
}

#[derive(Clone, serde::Serialize)]
struct Payload {
    message: String,
}

fn menu_handler(event: WindowMenuEvent<Wry>) {
    match event.menu_item_id() {
        "settings" => {
            let main = event.window();
            main.emit("open-settings", {});
            // let window = WindowBuilder::new(
            //     &handle,
            //     "settings".to_string(),
            //     tauri::WindowUrl::App("index.html".into()),
            // )
            // .build()
            // .expect("Settings window failed to build");
            // window.listen(event, handler)
        }
        _ => {}
    }
}

fn main() {
    tauri::Builder::default()
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

// fn main() {
//     let password = "secret123".to_string();
//     let data = [8u8; 10];
//     let input_path = "/Users/dg/Projects/demos/hello-tauri/src-tauri/dummy/data".to_string();
//     let output_path = "/Users/dg/Projects/demos/hello-tauri/src-tauri/dummy/data.enc".to_string();
//     let test_decrypt_path =
//         "/Users/dg/Projects/demos/hello-tauri/src-tauri/dummy/data.dec".to_string();

//     match is_encrypted_file(password) {
//         Ok(is_encrypted) => {
//             println!("Is encrypted file: {}", &is_encrypted)
//         }
//         Err(e) => {
//             println!("Fn error: {}", e)
//         }
//     }
// }

// Read the file
// let mut file = File::open(&file_path).map_err(|e| e.to_string())?;
// let mut contents = Vec::new();
// file.read_to_end(&mut contents).map_err(|e| e.to_string())?;

//     match encrypt_file(&input_path, &password, &output_path) {
//         Ok(_) => {
//             println!("Wrote encrypted file to {}", &output_path);
//         }
//         Err(e) => println!("Encryption error: {}", e),
//     }

//     match decrypt_file(&output_path, &password, &test_decrypt_path) {
//         Ok(decrypted) => {
//             println!("Decrypted: {}", &decrypted);
//         }
//         Err(e) => println!("Decryption error: {}", e),
//     }
// }
