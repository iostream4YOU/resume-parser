import express from 'express';
import multer from 'multer';
import { parseResumeWithBase44API, parseMultipleResumes } from '../services/resumeParserService.js';

const router = express.Router();

const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed'));
        }
    }
});

// POST /api/resume/parse
router.post('/parse', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, error: 'No file provided' });
        }

        const method = req.body.method || 'ai_powered';
        const file = new File([req.file.buffer], req.file.originalname, { type: req.file.mimetype });

        const result = await parseResumeWithBase44API(file, method);
        
        res.json({ success: true, message: 'Resume parsed successfully', data: result });

    } catch (error) {
        console.error('Resume parsing route error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST /api/resume/parse-multiple
router.post('/parse-multiple', upload.array('files', 10), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ success: false, error: 'No files provided' });
        }

        const method = req.body.method || 'ai_powered';
        const files = req.files.map(file => new File([file.buffer], file.originalname, { type: file.mimetype }));

        const results = await parseMultipleResumes(files, method);
        
        res.json({ success: true, message: `Processed ${results.totalProcessed} resumes`, data: results });

    } catch (error) {
        console.error('Multiple resume parsing route error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
