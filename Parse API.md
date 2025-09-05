Resume Parser API Documentation
1. API Endpoint

URL: https://resume-parser.base44.app/api/apps/68a7356f0285cfad28e93976/functions/parseResumeAPI
Method: POST
Request Type: multipart/form-data

Code Examples for Your Backend

Python Example :

import requests

def parse_resume_with_api(file_path):
    # The API endpoint for the resume parser
    api_url = "YOUR_ENDPOINT_URL" # <-- Replace with the actual URL

    # Prepare the file and data for the POST request
    with open(file_path, "rb") as resume_file:
        files = {"file": ("resume.pdf", resume_file)}
        payload = {"method": "ocr"}

        try:
            # Make the API call
            response = requests.post(api_url, files=files, data=payload)
            response.raise_for_status() # Check for HTTP errors

            # Return the parsed JSON data
            api_result = response.json()
            if api_result.get("success"):
                return api_result["data"]["parsed_data"]
            else:
                print(f"API returned an error: {api_result.get('error')}")
                return None

        except requests.exceptions.RequestException as e:
            print(f"Failed to call the API: {e}")
            return None

# --- How to use it ---

# parsed_data = parse_resume_with_api("path/to/user_resume.pdf")
# if parsed_data:
#     # Now you can save this `parsed_data` object to our database
#     print("Successfully parsed the resume.")


Node.js Example :

// Requires `node-fetch` and `form-data` libraries
import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from 'fs';

async function parseResumeWithApi(filePath) {
  // The API endpoint for the resume parser
  const apiUrl = 'YOUR_ENDPOINT_URL'; // <-- Replace with the actual URL

  // Create the form and append the file
  const form = new FormData();
  form.append('file', fs.createReadStream(filePath));
  form.append('method', 'ocr');

  try {
    // Make the API call
    const response = await fetch(apiUrl, { method: 'POST', body: form });
    const result = await response.json();

    // Return the parsed JSON data
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

// --- How to use it ---
// const parsedData = await parseResumeWithApi('path/to/user_resume.pdf');
// if (parsedData) {
//   // Now you can save this `parsedData` object to our database
//   console.log('Successfully parsed the resume.');
// }

Usage Example (cURL):

curl -X POST "https://resume-parser.base44.app/api/apps/68a7356f0285cfad28e93976/functions/parseResumeAPI" \
  -H "Content-Type: application/json" \
  -H "api_key: 1509d055851f48b39d83b1252f15b343" \
  -d '{"param1": "value1", "param2": "value2"}'
