const RESUME_PARSER_API_URL = process.env.RESUME_PARSER_API_URL || 'https://resume-parser.base44.app/api/apps/68a7356f0285cfad28e93976/functions/parseResumeAPI';

export async function parseResumeWithBase44API(file, method = 'ocr') {
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('method', method);

        console.log(`Starting resume parsing for: ${file.name || 'uploaded file'}`);

        const response = await fetch(RESUME_PARSER_API_URL, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`API Error: ${errorData.error || 'Unknown error'}`);
        }

        const result = await response.json();
        
        if (!result.success) {
            throw new Error(`Parsing failed: ${result.error}`);
        }

        console.log(`Resume parsing completed successfully in ${result.data.processing_time}s`);
        
        return result.data;

    } catch (error) {
        console.error('Resume parsing error:', error);
        throw new Error(`Failed to parse resume: ${error.message}`);
    }
}

export async function parseMultipleResumes(files, method = 'ocr', onProgress = null) {
    const results = [];
    const errors = [];

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        try {
            if (onProgress) {
                onProgress({ 
                    current: i + 1, 
                    total: files.length, 
                    filename: file.name,
                    status: 'processing' 
                });
            }

            const result = await parseResumeWithBase44API(file, method);
            results.push(result);

            if (onProgress) {
                onProgress({ 
                    current: i + 1, 
                    total: files.length, 
                    filename: file.name,
                    status: 'completed',
                    result: result
                });
            }

        } catch (error) {
            console.error(`Failed to parse ${file.name}:`, error);
            errors.push({ filename: file.name, error: error.message });
            
            if (onProgress) {
                onProgress({ 
                    current: i + 1, 
                    total: files.length, 
                    filename: file.name,
                    status: 'failed',
                    error: error.message
                });
            }
        }
    }

    return { 
        successful: results, 
        failed: errors,
        totalProcessed: files.length,
        successCount: results.length,
        failureCount: errors.length
    };
}
