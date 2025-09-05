import { parseResumeWithBase44API } from '../services/resumeParserService.js';

export class ResumeController {
    async handleResumeUpload(req, res) {
        try {
            const file = req.file; 
            const candidateId = req.body.candidateId;
            
            const parsedData = await parseResumeWithBase44API(file, 'ai_powered');
            
            await this.saveResumeToDatabase({
                candidateId,
                originalFilename: parsedData.filename,
                parsedData: parsedData.parsed_data,
                processingTime: parsedData.processing_time,
                confidenceScore: parsedData.confidence_score
            });
            
            res.json({
                success: true,
                message: 'Resume uploaded and parsed successfully',
                data: {
                    candidateId,
                    parsedFields: Object.keys(parsedData.parsed_data),
                    confidence: parsedData.confidence_score
                }
            });
            
        } catch (error) {
            console.error('Resume upload error:', error);
            res.status(500).json({ success: false, error: 'Failed to process resume' });
        }
    }
    
    async saveResumeToDatabase(resumeData) {
        console.log('Saving resume data:', resumeData);
    }
}
