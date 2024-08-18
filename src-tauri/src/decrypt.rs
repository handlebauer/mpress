use aes_gcm::{
    aead::{Aead, KeyInit},
    Aes256Gcm,
};
use anyhow::Result;
use base64::{engine::general_purpose, Engine as _};
use pbkdf2::pbkdf2_hmac;
use sha2::Sha256;

use crate::constants::{APP_SIGNATURE, NONCE_SIZE, SALT_ROUNDS, SALT_SIZE};

#[tauri::command]
pub fn decrypt_data(data: Vec<u8>, pass: String) -> Result<Vec<u8>, String> {
    println!("decrypt pass: {}", &pass);

    // Decode the base64 input
    let decoded = general_purpose::STANDARD
        .decode(data)
        .map_err(|e| e.to_string())?;

    // Check for app signature
    if !decoded.starts_with(APP_SIGNATURE) {
        return Err("Not a valid encrypted file for this app".to_string());
    }

    // Remove the signature before decryption
    let data_without_signature = &decoded[APP_SIGNATURE.len()..];

    // Extract salt, nonce, and ciphertext
    let salt = &data_without_signature[..SALT_SIZE];
    let nonce = &data_without_signature[SALT_SIZE..SALT_SIZE + NONCE_SIZE];
    let ciphertext = &data_without_signature[SALT_SIZE + NONCE_SIZE..];

    // Derive the key
    let mut key = [0u8; 32];
    pbkdf2_hmac::<Sha256>(pass.as_bytes(), salt, SALT_ROUNDS, &mut key);

    // Create the cipher
    let cipher =
        Aes256Gcm::new_from_slice(&key).map_err(|e| format!("Failed to create cipher: {}", e))?;

    // Decrypt the data
    let plaintext = cipher
        .decrypt(nonce.into(), ciphertext)
        .map_err(|e| format!("Decryption failed: {}", e))?;

    Ok(plaintext)
}
