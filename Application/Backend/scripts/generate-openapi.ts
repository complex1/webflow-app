import fs from 'fs';
import path from 'path';
import { swaggerSpec } from '../src/config/swagger';

const outputPath = path.resolve(__dirname, '../openapi.json');

fs.writeFileSync(outputPath, JSON.stringify(swaggerSpec, null, 2));

console.log(`OpenAPI specification generated at: ${outputPath}`);
