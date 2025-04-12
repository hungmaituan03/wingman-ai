import subprocess

# Define the curl command
curl_command = [
    "curl", 
    "-X", "POST", 
    "http://localhost:8080/chat", 
    "-H", "Content-Type: application/json", 
    "-d", '{"place": "Shibuya", "radius": "5", "unit": "km", "description": "Comic store"}'
]

# Run the curl command using subprocess
try:
    result = subprocess.run(curl_command, text=True, capture_output=True, check=True)
    print("Response from API:")
    print(result.stdout)  # Print the response from the API
except subprocess.CalledProcessError as e:
    print(f"An error occurred: {e}")
    print(f"Error output: {e.stderr}")