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

### Node.js :
```javascript
// Requires `node-fetch` and `form-data`
import fetch from "node-fetch";
import FormData from "form-data";
import fs from "fs";

async function parseResumeWithApi(filePath) {
  const apiUrl = "https://resume-parser.base44.app/api/apps/68a7356f0285cfad28e93976/functions/parseResumeAPI";

  const form = new FormData();
  form.append("file", fs.createReadStream(filePath));
  form.append("method", "ocr");

  try {
    const response = await fetch(apiUrl, { method: "POST", body: form });
    const result = await response.json();

    if (result.success) {
      return result.data.parsed_data;
    } else {
      console.error(`API returned an error: ${result.error}`);
      return null;
    }
  } catch (error) {
    console.error(`Failed to call the API: ${error}`);
    return null;
  }
}

// Example Usage
// const parsedData = await parseResumeWithApi("path/to/user_resume.pdf");
// if (parsedData) {
//   console.log("✅ Successfully parsed the resume.");
// }

###cURL :
curl -X POST "https://resume-parser.base44.app/api/apps/68a7356f0285cfad28e93976/functions/parseResumeAPI" \
  -H "api_key: 1509d055851f48b39d83b1252f15b343" \
  -F "file=@resume.pdf" \
  -F "method=ocr"
