#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod constants;
mod decrypt;
mod encrypt;
mod utils;

use decrypt::decrypt_file;
use encrypt::encrypt_file;
use utils::check_is_encrypted_file;
use utils::get_file_type;
use utils::show_in_fs;

use tauri::{CustomMenuItem, Menu, MenuItem, Submenu};

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            decrypt_file,
            encrypt_file,
            check_is_encrypted_file,
            show_in_fs,
            get_file_type
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
