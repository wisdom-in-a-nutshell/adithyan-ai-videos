#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import {fal} from '@fal-ai/client';

const SCHEMA_VERSION = '1.0';
const ENDPOINT = 'bytedance/seedance-2.0/fast/reference-to-video';
const DEFAULT_SECRET_ENV_FILE = path.join(os.homedir(), '.secrets', 'fal', 'env');
const VALID_RESOLUTIONS = new Set(['480p', '720p']);
const VALID_ASPECT_RATIOS = new Set(['auto', '21:9', '16:9', '4:3', '1:1', '3:4', '9:16']);
const VALID_LIFECYCLES = new Set(['never', 'immediate', '1h', '1d', '7d', '30d', '1y']);
const DOCTOR_CHECK_FILENAME = 'fal-seedance-doctor.txt';

const nowIso = () => new Date().toISOString();
const requestId = () => `fal-seedance-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;

const printResult = ({startedAt, command, status, data = null, error = null, request_id}) => {
  const durationMs = Date.now() - startedAt;
  const envelope = {
    schema_version: SCHEMA_VERSION,
    command,
    status,
    data,
    error,
    meta: {
      request_id,
      duration_ms: durationMs,
      timestamp_utc: nowIso(),
    },
  };
  process.stdout.write(`${JSON.stringify(envelope, null, 2)}\n`);
};

class CliError extends Error {
  constructor(code, message, {exitCode = 1, retryable = false, hint = null} = {}) {
    super(message);
    this.code = code;
    this.exitCode = exitCode;
    this.retryable = retryable;
    this.hint = hint;
  }
}

const fail = (code, message, options) => {
  throw new CliError(code, message, options);
};

const parseArgs = (argv) => {
  const options = {
    command: 'run',
    refs: [],
    videoUrls: [],
    audioUrls: [],
    prompt: null,
    promptFile: null,
    project: null,
    outputDir: null,
    receiptDir: null,
    name: null,
    duration: 'auto',
    resolution: '720p',
    aspectRatio: 'auto',
    generateAudio: false,
    seed: null,
    dryRun: false,
    noInput: false,
    remote: false,
    json: true,
    plain: false,
    progress: 'plain',
    secretEnvFile: DEFAULT_SECRET_ENV_FILE,
    lifecycle: '30d',
    download: true,
    timeoutMs: 900000,
    pollIntervalMs: 1000,
    startTimeoutSeconds: null,
  };

  const args = [...argv];
  if (args[0] && !args[0].startsWith('-')) {
    options.command = args.shift();
  }

  const readValue = (flag, index) => {
    const value = args[index + 1];
    if (!value || value.startsWith('-')) {
      fail('E_USAGE', `Missing value for ${flag}`, {exitCode: 2, hint: `Pass ${flag} <value>.`});
    }
    return value;
  };

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    switch (arg) {
      case '--ref':
      case '--image-url':
        options.refs.push(readValue(arg, i));
        i += 1;
        break;
      case '--video-url':
        options.videoUrls.push(readValue(arg, i));
        i += 1;
        break;
      case '--audio-url':
        options.audioUrls.push(readValue(arg, i));
        i += 1;
        break;
      case '--prompt':
        options.prompt = readValue(arg, i);
        i += 1;
        break;
      case '--prompt-file':
        options.promptFile = readValue(arg, i);
        i += 1;
        break;
      case '--project':
        options.project = readValue(arg, i);
        i += 1;
        break;
      case '--output-dir':
        options.outputDir = readValue(arg, i);
        i += 1;
        break;
      case '--receipt-dir':
        options.receiptDir = readValue(arg, i);
        i += 1;
        break;
      case '--name':
        options.name = readValue(arg, i);
        i += 1;
        break;
      case '--duration':
        options.duration = readValue(arg, i);
        i += 1;
        break;
      case '--resolution':
        options.resolution = readValue(arg, i);
        i += 1;
        break;
      case '--aspect-ratio':
        options.aspectRatio = readValue(arg, i);
        i += 1;
        break;
      case '--generate-audio':
        options.generateAudio = true;
        break;
      case '--no-generate-audio':
        options.generateAudio = false;
        break;
      case '--seed':
        options.seed = Number(readValue(arg, i));
        i += 1;
        break;
      case '--dry-run':
        options.dryRun = true;
        break;
      case '--no-input':
        options.noInput = true;
        break;
      case '--remote':
        options.remote = true;
        break;
      case '--json':
        options.json = true;
        options.plain = false;
        break;
      case '--plain':
        options.plain = true;
        options.json = false;
        break;
      case '--progress':
        options.progress = readValue(arg, i);
        i += 1;
        break;
      case '--secret-env-file':
        options.secretEnvFile = readValue(arg, i);
        i += 1;
        break;
      case '--lifecycle':
        options.lifecycle = readValue(arg, i);
        i += 1;
        break;
      case '--download':
        options.download = true;
        break;
      case '--no-download':
        options.download = false;
        break;
      case '--timeout-ms':
        options.timeoutMs = Number(readValue(arg, i));
        i += 1;
        break;
      case '--poll-interval-ms':
        options.pollIntervalMs = Number(readValue(arg, i));
        i += 1;
        break;
      case '--start-timeout-seconds':
        options.startTimeoutSeconds = Number(readValue(arg, i));
        i += 1;
        break;
      case '-h':
      case '--help':
        options.command = 'help';
        break;
      default:
        fail('E_USAGE', `Unknown option: ${arg}`, {exitCode: 2, hint: 'Run with --help for supported flags.'});
    }
  }

  return options;
};

const usage = () => `Usage:
  node scripts/fal_seedance_ref2v.mjs run --project <id> --prompt <text> --ref <path-or-url> [--ref <path-or-url> ...]
  node scripts/fal_seedance_ref2v.mjs validate [--secret-env-file <path>]
  node scripts/fal_seedance_ref2v.mjs doctor [--remote]

Common flags:
  --project <id>                 Project folder under projects/<id>
  --prompt <text>                Seedance prompt. Refer to images as @Image1, @Image2, ...
  --prompt-file <path>           Read prompt from a UTF-8 text file
  --ref <path-or-url>            Reference image path or URL; repeat up to 9
  --video-url <url>              Reference video URL; repeat up to 3
  --audio-url <url>              Reference audio URL; repeat up to 3
  --duration <auto|4..15>        Default: auto
  --resolution <480p|720p>       Default: 720p
  --aspect-ratio <ratio|auto>    Default: auto
  --generate-audio               Enable Seedance synchronized audio
  --seed <integer>               Fixed seed for reproducibility
  --dry-run                      Validate and print planned request without calling fal
  --remote                       doctor only: verify fal auth with a tiny storage upload; no video inference
  --secret-env-file <path>       Default: ~/.secrets/fal/env
  --no-download                  Keep only fal output URL and receipt
  --plain                        Print only the local video path or remote URL on success
`;

const isUrl = (value) => /^https?:\/\//i.test(value);

const shellUnquote = (value) => {
  const trimmed = value.trim();
  if (trimmed.startsWith("'") && trimmed.endsWith("'")) {
    return trimmed.slice(1, -1).replace(/'\\''/g, "'");
  }
  if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
    return trimmed.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
  }
  return trimmed;
};

const readSecretEnvFile = (secretEnvFile) => {
  const expanded = path.resolve(secretEnvFile.replace(/^~(?=$|\/)/, os.homedir()));
  if (!fs.existsSync(expanded)) {
    fail('E_AUTH_MISSING', `Secret env file not found: ${expanded}`, {
      exitCode: 3,
      hint: 'Sync it with: /Users/dobby/GitHub/scripts/sync/keyvault-sync-machine-secrets.sh --apply --integration fal',
    });
  }

  const text = fs.readFileSync(expanded, 'utf8');
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const match = line.match(/^export\s+FAL_KEY=(.*)$/);
    if (match) {
      const value = shellUnquote(match[1]);
      if (!value) break;
      return {value, path: expanded};
    }
  }

  fail('E_AUTH_MISSING', `FAL_KEY was not found in ${expanded}`, {
    exitCode: 3,
    hint: 'Confirm /Users/dobby/GitHub/scripts/sync/machine-secrets/fal.env.map maps FAL_KEY=fal--api-key, then re-run the machine-secret sync.',
  });
};

const validateOptions = (options) => {
  if (!['run', 'validate', 'doctor', 'help'].includes(options.command)) {
    fail('E_USAGE', `Unknown command: ${options.command}`, {exitCode: 2, hint: 'Use run, validate, doctor, or --help.'});
  }
  if (options.command !== 'run') return;

  if (!options.prompt && !options.promptFile) {
    fail('E_USAGE', 'Missing prompt', {exitCode: 2, hint: 'Pass --prompt <text> or --prompt-file <path>.'});
  }
  if (options.prompt && options.promptFile) {
    fail('E_USAGE', 'Use either --prompt or --prompt-file, not both', {exitCode: 2});
  }
  if (options.refs.length === 0 && options.videoUrls.length === 0 && options.audioUrls.length === 0) {
    fail('E_USAGE', 'At least one reference input is required', {exitCode: 2, hint: 'Pass one or more --ref image paths/URLs.'});
  }
  if (options.refs.length > 9) {
    fail('E_USAGE', 'Seedance Ref2V accepts at most 9 image references', {exitCode: 2});
  }
  if (options.videoUrls.length > 3) {
    fail('E_USAGE', 'Seedance Ref2V accepts at most 3 video references', {exitCode: 2});
  }
  if (options.audioUrls.length > 3) {
    fail('E_USAGE', 'Seedance Ref2V accepts at most 3 audio references', {exitCode: 2});
  }
  if (options.refs.length + options.videoUrls.length + options.audioUrls.length > 12) {
    fail('E_USAGE', 'Seedance Ref2V accepts at most 12 total reference files', {exitCode: 2});
  }
  if (!VALID_RESOLUTIONS.has(options.resolution)) {
    fail('E_USAGE', `Invalid resolution: ${options.resolution}`, {exitCode: 2, hint: 'Use 480p or 720p.'});
  }
  if (!VALID_ASPECT_RATIOS.has(options.aspectRatio)) {
    fail('E_USAGE', `Invalid aspect ratio: ${options.aspectRatio}`, {exitCode: 2});
  }
  if (options.duration !== 'auto') {
    const parsedDuration = Number(options.duration);
    if (!Number.isInteger(parsedDuration) || parsedDuration < 4 || parsedDuration > 15) {
      fail('E_USAGE', `Invalid duration: ${options.duration}`, {exitCode: 2, hint: 'Use auto or an integer from 4 to 15.'});
    }
    options.duration = parsedDuration;
  }
  if (options.seed !== null && (!Number.isInteger(options.seed) || options.seed < 0)) {
    fail('E_USAGE', `Invalid seed: ${options.seed}`, {exitCode: 2});
  }
  if (!VALID_LIFECYCLES.has(options.lifecycle)) {
    fail('E_USAGE', `Invalid lifecycle: ${options.lifecycle}`, {exitCode: 2, hint: 'Use one of: never, immediate, 1h, 1d, 7d, 30d, 1y.'});
  }
  if (!Number.isInteger(options.timeoutMs) || options.timeoutMs <= 0) {
    fail('E_USAGE', 'Invalid --timeout-ms', {exitCode: 2});
  }
  if (!Number.isInteger(options.pollIntervalMs) || options.pollIntervalMs <= 0) {
    fail('E_USAGE', 'Invalid --poll-interval-ms', {exitCode: 2});
  }
};

const readPrompt = (options) => {
  if (options.prompt) return options.prompt;
  const promptPath = path.resolve(options.promptFile);
  if (!fs.existsSync(promptPath)) {
    fail('E_NOT_FOUND', `Prompt file not found: ${promptPath}`, {exitCode: 2});
  }
  const prompt = fs.readFileSync(promptPath, 'utf8').trim();
  if (!prompt) {
    fail('E_USAGE', `Prompt file is empty: ${promptPath}`, {exitCode: 2});
  }
  return prompt;
};

const slugify = (value) =>
  String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'seedance-ref2v';

const resolveOutputPaths = (options) => {
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const baseName = slugify(options.name || `seedance-ref2v-${stamp}`);
  const projectRoot = options.project ? path.join('projects', options.project) : null;
  const outputDir = options.outputDir || (projectRoot ? path.join(projectRoot, 'seedance', 'renders') : null);
  const receiptDir = options.receiptDir || (projectRoot ? path.join(projectRoot, 'seedance', 'receipts') : null);
  if (!outputDir || !receiptDir) {
    fail('E_USAGE', 'Missing output location', {
      exitCode: 2,
      hint: 'Pass --project <id>, or both --output-dir and --receipt-dir.',
    });
  }
  return {
    baseName,
    outputDir: path.resolve(outputDir),
    receiptDir: path.resolve(receiptDir),
    videoPath: path.resolve(outputDir, `${baseName}.mp4`),
    receiptPath: path.resolve(receiptDir, `${baseName}.json`),
  };
};

const mimeFromPath = (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
  if (ext === '.png') return 'image/png';
  if (ext === '.webp') return 'image/webp';
  if (ext === '.mp4') return 'video/mp4';
  if (ext === '.mov') return 'video/quicktime';
  if (ext === '.mp3') return 'audio/mpeg';
  if (ext === '.wav') return 'audio/wav';
  return 'application/octet-stream';
};

const uploadLocalFile = async ({client, filePath, lifecycle}) => {
  const absPath = path.resolve(filePath);
  if (!fs.existsSync(absPath)) {
    fail('E_NOT_FOUND', `Reference file not found: ${absPath}`, {exitCode: 2});
  }
  const stat = fs.statSync(absPath);
  if (!stat.isFile()) {
    fail('E_USAGE', `Reference is not a file: ${absPath}`, {exitCode: 2});
  }
  const bytes = fs.readFileSync(absPath);
  const blob = new File([bytes], path.basename(absPath), {type: mimeFromPath(absPath)});
  const url = await client.storage.upload(blob, {lifecycle: {expiresIn: lifecycle}});
  return {
    source: absPath,
    url,
    uploaded: true,
    bytes: stat.size,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex'),
  };
};

const prepareReferences = async ({client, refs, lifecycle, dryRun}) => {
  const prepared = [];
  for (const ref of refs) {
    if (isUrl(ref)) {
      prepared.push({source: ref, url: ref, uploaded: false});
      continue;
    }
    if (dryRun) {
      const absPath = path.resolve(ref);
      if (!fs.existsSync(absPath)) {
        fail('E_NOT_FOUND', `Reference file not found: ${absPath}`, {exitCode: 2});
      }
      const stat = fs.statSync(absPath);
      prepared.push({source: absPath, url: null, uploaded: false, upload_required: true, bytes: stat.size});
      continue;
    }
    prepared.push(await uploadLocalFile({client, filePath: ref, lifecycle}));
  }
  return prepared;
};

const makeInput = ({prompt, options, imageUrls}) => {
  const input = {
    prompt,
    image_urls: imageUrls,
    video_urls: options.videoUrls,
    audio_urls: options.audioUrls,
    resolution: options.resolution,
    duration: options.duration,
    aspect_ratio: options.aspectRatio,
    generate_audio: options.generateAudio,
  };
  if (options.seed !== null) input.seed = options.seed;
  return input;
};

const downloadVideo = async ({url, outPath}) => {
  fs.mkdirSync(path.dirname(outPath), {recursive: true});
  const tmp = `${outPath}.tmp-${process.pid}-${Date.now()}`;
  const response = await fetch(url);
  if (!response.ok) {
    fail('E_NETWORK', `Failed to download generated video: ${response.status} ${response.statusText}`, {
      exitCode: 4,
      retryable: true,
      hint: url,
    });
  }
  const arrayBuffer = await response.arrayBuffer();
  fs.writeFileSync(tmp, Buffer.from(arrayBuffer));
  fs.renameSync(tmp, outPath);
  return {
    path: outPath,
    bytes: fs.statSync(outPath).size,
    sha256: crypto.createHash('sha256').update(fs.readFileSync(outPath)).digest('hex'),
  };
};

const writeReceipt = ({receiptPath, receipt}) => {
  fs.mkdirSync(path.dirname(receiptPath), {recursive: true});
  fs.writeFileSync(receiptPath, `${JSON.stringify(receipt, null, 2)}\n`, 'utf8');
};

const run = async ({options, startedAt, localRequestId}) => {
  validateOptions(options);
  const paths = resolveOutputPaths(options);
  const prompt = readPrompt(options);

  let secret = null;
  let client = null;
  if (!options.dryRun) {
    secret = readSecretEnvFile(options.secretEnvFile);
    fal.config({credentials: secret.value});
    client = fal;
  }

  const references = await prepareReferences({
    client,
    refs: options.refs,
    lifecycle: options.lifecycle,
    dryRun: options.dryRun,
  });
  const imageUrls = references.map((ref) => ref.url).filter(Boolean);
  const plannedInput = makeInput({prompt, options, imageUrls});

  if (options.dryRun) {
    const dryRunInput = makeInput({
      prompt,
      options,
      imageUrls: references.map((ref, index) => ref.url || `upload://Image${index + 1}`),
    });
    printResult({
      startedAt,
      command: 'fal-seedance.ref2v.run',
      status: 'ok',
      request_id: localRequestId,
      data: {
        dry_run: true,
        endpoint: ENDPOINT,
        input: dryRunInput,
        references,
        output: paths,
        secret_env_file: path.resolve(options.secretEnvFile.replace(/^~(?=$|\/)/, os.homedir())),
      },
    });
    return 0;
  }

  if (options.progress !== 'off') {
    process.stderr.write(`Submitting fal Seedance request to ${ENDPOINT}\n`);
  }

  const abortController = new AbortController();
  const timeout = setTimeout(() => abortController.abort(), options.timeoutMs);
  let result;
  try {
    result = await fal.subscribe(ENDPOINT, {
      input: plannedInput,
      logs: options.progress !== 'off',
      pollInterval: options.pollIntervalMs,
      timeout: options.timeoutMs,
      startTimeout: options.startTimeoutSeconds || undefined,
      abortSignal: abortController.signal,
      storageSettings: {expiresIn: options.lifecycle},
      onEnqueue: (request_id) => {
        if (options.progress !== 'off') process.stderr.write(`fal request id: ${request_id}\n`);
      },
      onQueueUpdate: (update) => {
        if (options.progress === 'off') return;
        if (update.status === 'IN_QUEUE') {
          process.stderr.write(`queue: position ${update.queue_position}\n`);
        } else if (update.status === 'IN_PROGRESS') {
          const lastLog = Array.isArray(update.logs) ? update.logs.at(-1) : null;
          if (lastLog?.message) process.stderr.write(`progress: ${lastLog.message}\n`);
          else process.stderr.write('progress: IN_PROGRESS\n');
        }
      },
    });
  } catch (error) {
    if (abortController.signal.aborted) {
      fail('E_TIMEOUT', `fal request timed out after ${options.timeoutMs} ms`, {
        exitCode: 5,
        retryable: true,
        hint: 'Retry with a larger --timeout-ms, or inspect the fal dashboard for the request state.',
      });
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }

  const videoUrl = result?.data?.video?.url;
  if (!videoUrl) {
    fail('E_PROVIDER_OUTPUT', 'fal result did not include data.video.url', {
      exitCode: 1,
      hint: 'Inspect the receipt payload and fal dashboard request.',
    });
  }

  let downloaded = null;
  if (options.download) {
    downloaded = await downloadVideo({url: videoUrl, outPath: paths.videoPath});
  }

  const receipt = {
    schema_version: SCHEMA_VERSION,
    endpoint: ENDPOINT,
    local_request_id: localRequestId,
    fal_request_id: result.requestId,
    created_at_utc: nowIso(),
    input: plannedInput,
    references,
    result: result.data,
    output: {
      video_url: videoUrl,
      local_video: downloaded,
      receipt_path: paths.receiptPath,
    },
    secret_env_file: secret.path,
  };
  writeReceipt({receiptPath: paths.receiptPath, receipt});

  if (options.plain) {
    process.stdout.write(`${downloaded?.path || videoUrl}\n`);
    return 0;
  }

  printResult({
    startedAt,
    command: 'fal-seedance.ref2v.run',
    status: 'ok',
    request_id: localRequestId,
    data: {
      endpoint: ENDPOINT,
      fal_request_id: result.requestId,
      video: result.data.video,
      seed: result.data.seed ?? null,
      local_video: downloaded,
      receipt_path: paths.receiptPath,
      references,
    },
  });
  return 0;
};

const validate = ({options, startedAt, localRequestId}) => {
  const secretPath = path.resolve(options.secretEnvFile.replace(/^~(?=$|\/)/, os.homedir()));
  let secretPresent = false;
  let hint = null;
  try {
    readSecretEnvFile(secretPath);
    secretPresent = true;
  } catch (error) {
    if (error instanceof CliError && error.code === 'E_AUTH_MISSING') {
      hint = error.hint;
    } else {
      throw error;
    }
  }

  printResult({
    startedAt,
    command: 'fal-seedance.ref2v.validate',
    status: 'ok',
    request_id: localRequestId,
    data: {
      endpoint: ENDPOINT,
      secret_env_file: secretPath,
      secret_present: secretPresent,
      sync_hint: hint,
      mapping_file: '/Users/dobby/GitHub/scripts/sync/machine-secrets/fal.env.map',
    },
  });
};

const runRemoteDoctorCheck = async ({secret, localRequestId}) => {
  fal.config({credentials: secret.value});
  const payload = `fal-seedance doctor ${localRequestId}\n`;
  const file = new File([payload], DOCTOR_CHECK_FILENAME, {type: 'text/plain'});
  const url = await fal.storage.upload(file, {lifecycle: {expiresIn: 'immediate'}});
  let urlHost = null;
  try {
    urlHost = new URL(url).host;
  } catch {
    urlHost = null;
  }
  return {
    requested: true,
    status: 'ok',
    method: 'fal.storage.upload',
    inference: false,
    uploaded_bytes: payload.length,
    url_host: urlHost,
  };
};

const doctor = async ({options, startedAt, localRequestId}) => {
  const secretPath = path.resolve(options.secretEnvFile.replace(/^~(?=$|\/)/, os.homedir()));
  const secret = readSecretEnvFile(secretPath);
  const remoteCheck = options.remote
    ? await runRemoteDoctorCheck({secret, localRequestId})
    : {
        requested: false,
        status: 'skipped',
        method: null,
        inference: false,
        hint: 'Pass --remote to verify fal provider auth via storage upload without video inference.',
      };

  printResult({
    startedAt,
    command: 'fal-seedance.ref2v.doctor',
    status: 'ok',
    request_id: localRequestId,
    data: {
      endpoint: ENDPOINT,
      secret_env_file: secretPath,
      secret_present: true,
      mapping_file: '/Users/dobby/GitHub/scripts/sync/machine-secrets/fal.env.map',
      remote_check: remoteCheck,
      production_inference_performed: false,
    },
  });
};

const classifyUnexpectedError = (error) => {
  const message = error instanceof Error ? error.message : String(error);
  const providerDetail =
    error && typeof error === 'object' && error.body && typeof error.body === 'object'
      ? error.body.detail || error.body.message || null
      : null;
  const providerStatus = error && typeof error === 'object' ? error.status || null : null;
  const combinedMessage = [message, providerDetail].filter(Boolean).join(' ');

  if (providerStatus === 403 && /exhausted balance|top up|billing|balance/i.test(combinedMessage)) {
    return new CliError('E_BILLING_REQUIRED', 'fal account is locked because the balance is exhausted', {
      exitCode: 3,
      retryable: false,
      hint: 'Top up the fal account balance at https://fal.ai/dashboard/billing, then rerun doctor --remote.',
    });
  }
  if (/401|403|unauthori[sz]ed|forbidden|invalid.*key|api key|authentication/i.test(combinedMessage)) {
    return new CliError('E_AUTH_PROVIDER', 'fal rejected the configured credentials', {
      exitCode: 3,
      retryable: false,
      hint: 'Refresh ~/.secrets/fal/env from Key Vault and verify fal--api-key is valid.',
    });
  }
  if (/fetch|network|ENOTFOUND|ECONN|ETIMEDOUT|timeout|socket|TLS|DNS/i.test(combinedMessage)) {
    return new CliError('E_NETWORK', 'fal network request failed', {
      exitCode: 4,
      retryable: true,
      hint: 'Retry later or check network connectivity and fal status.',
    });
  }
  return new CliError('E_UNEXPECTED', providerDetail || message, {
    exitCode: 1,
    retryable: false,
    hint: 'Run doctor --remote for provider connectivity, then retry with --dry-run before generation.',
  });
};

const main = async () => {
  const startedAt = Date.now();
  const localRequestId = requestId();
  let command = 'fal-seedance.ref2v.run';
  try {
    const options = parseArgs(process.argv.slice(2));
    if (options.command === 'help') {
      process.stdout.write(usage());
      return 0;
    }
    command = `fal-seedance.ref2v.${options.command}`;
    if (options.command === 'validate') {
      validate({options, startedAt, localRequestId});
      return 0;
    }
    if (options.command === 'doctor') {
      await doctor({options, startedAt, localRequestId});
      return 0;
    }
    return await run({options, startedAt, localRequestId});
  } catch (error) {
    const cliError =
      error instanceof CliError
        ? error
        : classifyUnexpectedError(error);
    printResult({
      startedAt,
      command,
      status: 'error',
      request_id: localRequestId,
      error: {
        code: cliError.code,
        message: cliError.message,
        retryable: cliError.retryable,
        hint: cliError.hint,
      },
    });
    return cliError.exitCode;
  }
};

process.exitCode = await main();
