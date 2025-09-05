# 📄 Resume Parser API Documentation

## API Endpoint
**URL:**  
`https://resume-parser.base44.app/api/apps/68a7356f0285cfad28e93976/functions/parseResumeAPI`  

**Method:** `POST`  
**Request Type:** `multipart/form-data`  

---

## Usage Examples

### Python
```python
import requests

def parse_resume_with_api(file_path):
    api_url = "https://resume-parser.base44.app/api/apps/68a7356f0285cfad28e93976/functions/parseResumeAPI"

    with open(file_path, "rb") as resume_file:
        files = {"file": ("resume.pdf", resume_file)}
        payload = {"method": "ocr"}

        try:
            response = requests.post(api_url, files=files, data=payload)
            response.raise_for_status()
            api_result = response.json()
            if api_result.get("success"):
                return api_result["data"]["parsed_data"]
            else:
                print(f"API returned an error: {api_result.get('error')}")
                return None
        except requests.exceptions.RequestException as e:
            print(f"Failed to call the API: {e}")
            return None

# Example Usage
# parsed_data = parse_resume_with_api("path/to/user_resume.pdf")
# if parsed_data:
#     print("✅ Successfully parsed the resume.")
