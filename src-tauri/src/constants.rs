use base64::{engine::general_purpose, Engine as _};
use once_cell::sync::Lazy;

pub const SALT_SIZE: usize = 16;
pub const SALT_ROUNDS: u32 = 100_000;
pub const NONCE_SIZE: usize = 12;

pub const APP_SIGNATURE: &[u8] = b"MEMPRESS";
pub static APP_SIGNATURE_LEN: Lazy<usize> =
    Lazy::new(|| general_purpose::STANDARD.encode(APP_SIGNATURE).len());
