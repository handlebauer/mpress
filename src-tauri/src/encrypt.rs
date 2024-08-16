#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use aes_gcm::{
    aead::{Aead, KeyInit, OsRng},
    Aes256Gcm, Nonce,
};
use anyhow::Result;
use base64::{engine::general_purpose, Engine as _};
use pbkdf2::pbkdf2_hmac;
use rand::RngCore;
use sha2::Sha256;

use crate::constants::{APP_SIGNATURE, NONCE_SIZE, SALT_ROUNDS, SALT_SIZE};

#[tauri::command(async)]
pub fn encrypt_data(data: Vec<u8>, pass: String) -> Result<String, String> {
    println!("encrypt pass: {}", &pass);

    // Generate a random salt
    let mut salt = [0u8; SALT_SIZE];
    OsRng.fill_bytes(&mut salt);

    // Derive a key from the pass and salt
    let mut key = [0u8; 32];
    pbkdf2_hmac::<Sha256>(pass.as_bytes(), &salt, SALT_ROUNDS, &mut key);

    // Create a new AES-GCM cipher
    let cipher = Aes256Gcm::new_from_slice(&key).map_err(|e| e.to_string())?;

    // Generate a random nonce
    let mut nonce = [0u8; 12];
    OsRng.fill_bytes(&mut nonce);
    let nonce = Nonce::from_slice(&nonce);

    // Encrypt the data
    let ciphertext = cipher
        .encrypt(&nonce, data.as_ref())
        .map_err(|e| e.to_string())?;

    // Combine salt, nonce, and ciphertext
    let mut result = Vec::with_capacity(SALT_SIZE + NONCE_SIZE + ciphertext.len());
    result.extend_from_slice(&salt);
    result.extend_from_slice(nonce.as_slice());
    result.extend_from_slice(&ciphertext);

    // Prepend the app signature
    let mut result_with_signature = APP_SIGNATURE.to_vec();
    result_with_signature.extend(result);

    Ok(general_purpose::STANDARD.encode(result_with_signature))
}
