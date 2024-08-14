use base64::{engine::general_purpose::STANDARD as BASE64, Engine as _};

use crate::constants::{APP_SIGNATURE, APP_SIGNATURE_LEN};

#[tauri::command]
pub fn check_is_encrypted_file(data: Vec<u8>) -> Result<bool, String> {
    if data.len() < *APP_SIGNATURE_LEN {
        return Ok(false);
    }

    let buffer = &data[..*APP_SIGNATURE_LEN];

    // Attempt to decode the base64 content
    match BASE64.decode(buffer) {
        Ok(decoded) => Ok(decoded.starts_with(APP_SIGNATURE)),
        Err(_) => Ok(false), // If decoding fails, it's not our encrypted format
    }
}

#[tauri::command(async)]
pub fn show_in_fs(path: String) {
    showfile::show_path_in_file_manager(path)
}

#[tauri::command(async)]
pub fn get_file_type(data: Vec<u8>) -> Result<String, bool> {
    match infer::get(&data) {
        Some(kind) => {
            let extension = kind.extension();
            Ok(extension.to_string())
        }
        None => Err(false),
    }
}
