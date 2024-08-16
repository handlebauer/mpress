use base64::{engine::general_purpose::STANDARD as BASE64, Engine as _};

use std::fs::File;
use std::io::Write;

use crate::constants::{APP_SIGNATURE, APP_SIGNATURE_LEN};

#[tauri::command]
pub fn check_is_encrypted(data: Vec<u8>) -> Result<bool, String> {
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
pub fn write_data_to_file(data: Vec<u8>, path: String) -> Result<bool, String> {
    let mut output_file = File::create(path).map_err(|e| e.to_string())?;
    output_file.write_all(&data).map_err(|e| e.to_string())?;

    Ok(true)
}

#[tauri::command(async)]
pub fn show_file(path: String) {
    showfile::show_path_in_file_manager(path)
}
