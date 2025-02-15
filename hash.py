import hashlib

def generate_hash(image_data, biometric_data):
    combined_data = image_data + biometric_data
    return hashlib.sha256(combined_data).hexdigest()

def verify_hash(image_data, biometric_data, stored_hash):
    combined_data = image_data + biometric_data
    return generate_hash(combined_data) == stored_hash


