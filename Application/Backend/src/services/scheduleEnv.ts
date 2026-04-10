import EnvConfig from '../models/EnvConfig';
import WebFlowEnvFile from '../models/WebFlowEnvFile';

export async function resolveEnvForLinkedEnvFile(
  userId: number,
  webFlowId: number,
  envFileId: number | null
): Promise<Record<string, string>> {
  if (envFileId == null) {
    return {};
  }
  const link = await WebFlowEnvFile.findOne({
    where: { webFlowId, envFileId, userId },
  });
  if (!link) {
    throw new Error('Env file is not linked to this web flow');
  }
  const configs = await EnvConfig.findAll({ where: { envFileId } });
  const out: Record<string, string> = {};
  for (const c of configs) {
    out[c.key] = c.value;
  }
  return out;
}
