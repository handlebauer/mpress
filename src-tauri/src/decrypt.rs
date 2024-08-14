use aes_gcm::{
    aead::{Aead, KeyInit},
    Aes256Gcm,
};
use anyhow::{anyhow, Context, Result};
use base64::{engine::general_purpose, Engine as _};
use pbkdf2::pbkdf2_hmac;
use sha2::Sha256;
use std::fs::File;
use std::io::Write;

use crate::constants::{APP_SIGNATURE, NONCE_SIZE, SALT_ROUNDS, SALT_SIZE};

fn decrypt_data(encrypted_data: Vec<u8>, pass: String) -> Result<Vec<u8>> {
    // Decode the base64 input
    let decoded = general_purpose::STANDARD
        .decode(encrypted_data)
        .context("Failed to decode base64")?;

    // Check for app signature
    if !decoded.starts_with(APP_SIGNATURE) {
        return Err(anyhow!("Not a valid encrypted file for this app"));
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
    let cipher = Aes256Gcm::new_from_slice(&key).context("Failed to create cipher")?;

    // Decrypt the data
    let plaintext = cipher
        .decrypt(nonce.into(), ciphertext)
        .map_err(|e| anyhow!("{}", e)) // Convert to anyhow::Error
        .context("Decryption failed")?;

    Ok(plaintext)
}

#[tauri::command(async)]
pub fn decrypt_file(data: Vec<u8>, pass: String, path: String) -> Result<bool, String> {
    // Decrypt the contents
    let decrypted_data = decrypt_data(data, pass).map_err(|e| e.to_string())?;

    // Write decrypted data to the output file
    let mut output_file = File::create(path).map_err(|e| e.to_string())?;
    output_file
        .write_all(&decrypted_data)
        .map_err(|e| e.to_string())?;

    Ok(true)
}
