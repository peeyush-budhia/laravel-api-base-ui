import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { format, resolveConfig } from 'prettier';

const contractUrl = new URL('../openapi/openapi.json', import.meta.url);
const outputUrl = new URL('../src/types/generated/api.ts', import.meta.url);
const schemaNames = ['UserStatus', 'AuditEvent'];

const contract = JSON.parse(readFileSync(contractUrl, 'utf8'));
const schemas = contract.components?.schemas;

if (!schemas || typeof schemas !== 'object') {
  throw new Error('The OpenAPI contract does not contain components.schemas.');
}

const generatedTypes = schemaNames.map((schemaName) => {
  const schema = schemas[schemaName];

  if (
    schema?.type !== 'string' ||
    !Array.isArray(schema.enum) ||
    schema.enum.length === 0 ||
    !schema.enum.every((value) => typeof value === 'string')
  ) {
    throw new Error(
      `OpenAPI schema ${schemaName} must be a non-empty string enum.`,
    );
  }

  const values = schema.enum
    .map((value) => `  | '${value.replaceAll("'", "\\'")}'`)
    .join('\n');

  return `export type ${schemaName} =\n${values};`;
});

const rawOutput = `// This file is generated from openapi/openapi.json.
// Run \`npm run api:generate\` after updating the API contract.

${generatedTypes.join('\n\n')}
`;
const prettierConfig = await resolveConfig(fileURLToPath(outputUrl));
const output = await format(rawOutput, {
  ...prettierConfig,
  parser: 'typescript',
});

if (process.argv.includes('--check')) {
  let currentOutput = '';

  try {
    currentOutput = readFileSync(outputUrl, 'utf8');
  } catch {
    throw new Error(
      `Generated API types are missing at ${fileURLToPath(outputUrl)}. Run npm run api:generate.`,
    );
  }

  if (currentOutput !== output) {
    throw new Error('Generated API types are stale. Run npm run api:generate.');
  }
} else {
  writeFileSync(outputUrl, output);
}
