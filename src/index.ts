import express from 'express';
import { BrandExtractionSchema } from './api/validation';
import { BrandService } from './services/brand_service';
import { logger } from './utils/logger';

const app = express();
app.use(express.json());

const brandService = new BrandService();

app.post('/v1/dna/extract', async (req, res) => {
  try {
    // 1. Boundary Validation
    const validated = BrandExtractionSchema.parse(req.body);

    // 2. Service Execution
    const result = await brandService.extractDNA(validated.url);

    return res.status(200).json(result);
  } catch (error: unknown) {
    // Type-safe error handling to satisfy strict linting
    if (error instanceof Error) {
        if (error.name === 'ZodError') {
          return res.status(400).json({ error: 'INVALID_INPUT', details: error.message });
        }
        logger.error('API execution error', { message: error.message });
    }
    
    return res.status(500).json({ error: 'INTERNAL_SERVER_ERROR' });
  }
});

const PORT = 3000;
app.listen(PORT, () => logger.info(`System running on port ${PORT}`));
