import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const STABLE_VERSION_RE = /^\d+\.\d+\.\d+$/;
const BETA_VERSION_RE = /^\d+\.\d+\.\d+-beta-\d+$/;

export function validateReleaseVersion(kind, version) {
  if (!version) {
    throw new Error('Provide a version string.');
  }

  if (kind === 'stable') {
    if (!STABLE_VERSION_RE.test(version)) {
      throw new Error('Expected a stable release version like x.x.x');
    }

    return version;
  }

  if (kind === 'beta') {
    if (!BETA_VERSION_RE.test(version)) {
      throw new Error('Expected a beta release version like x.x.x-beta-x');
    }

    return version;
  }

  throw new Error(`Unsupported release kind: ${kind}`);
}

export function setReleaseVersion(kind, version) {
  const validatedVersion = validateReleaseVersion(kind, version);

  execFileSync(
    'npm',
    ['version', validatedVersion, '--no-git-tag-version', '--allow-same-version'],
    { stdio: 'inherit' }
  );

  return validatedVersion;
}

const isDirectRun =
  process.argv[1] &&
  fileURLToPath(import.meta.url) === process.argv[1];

if (isDirectRun) {
  const [, , kind, version] = process.argv;
  setReleaseVersion(kind, version);
}
