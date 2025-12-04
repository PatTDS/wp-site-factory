/**
 * WPF v2.0 Error Recovery System
 *
 * Automated error detection and recovery
 * No LLM needed - deterministic fixes for known issues
 */
import fsExtra from 'fs-extra';
const { readFile } = fsExtra;
import { parse as parseYaml } from 'yaml';
import { execa } from 'execa';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const KB_DIR = path.join(__dirname, '../../kb');

// Types
export type Severity = 'critical' | 'error' | 'warning' | 'info';

export interface ErrorAction {
  action: 'wait' | 'command' | 'retry' | 'log' | 'notify';
  seconds?: number;
  cmd?: string;
  message?: string;
  type?: string;
}

export interface ErrorHandler {
  pattern: string;
  severity: Severity;
  category: string;
  description: string;
  actions: ErrorAction[];
  max_retries: number;
  fallback: string;
}

export interface ErrorHandlers {
  version: string;
  handlers: Record<string, ErrorHandler>;
}

export interface RecoveryContext {
  container?: string;
  port?: string;
  plugin?: string;
  url?: string;
  title?: string;
  domain?: string;
  projectPath?: string;
}

export interface RecoveryResult {
  handled: boolean;
  recovered: boolean;
  handlerName?: string;
  retriesUsed?: number;
  message: string;
}

// Load error handlers from YAML
let cachedHandlers: ErrorHandlers | null = null;

async function loadHandlers(): Promise<ErrorHandlers> {
  if (cachedHandlers) return cachedHandlers;

  const handlersPath = path.join(KB_DIR, 'error-handlers.yaml');
  const content = await readFile(handlersPath, 'utf-8');
  cachedHandlers = parseYaml(content) as ErrorHandlers;
  return cachedHandlers;
}

/**
 * Find matching error handler for an error message
 */
export async function findHandler(
  errorMessage: string
): Promise<{ name: string; handler: ErrorHandler } | null> {
  const { handlers } = await loadHandlers();

  for (const [name, handler] of Object.entries(handlers)) {
    const regex = new RegExp(handler.pattern, 'i');
    if (regex.test(errorMessage)) {
      return { name, handler };
    }
  }

  return null;
}

/**
 * Replace template variables in string
 */
function replaceVariables(str: string, context: RecoveryContext): string {
  let result = str;
  for (const [key, value] of Object.entries(context)) {
    if (value) {
      result = result.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }
  }
  return result;
}

/**
 * Execute a single recovery action
 */
async function executeAction(
  action: ErrorAction,
  context: RecoveryContext
): Promise<boolean> {
  switch (action.action) {
    case 'wait':
      console.log(`  ⏳ Waiting ${action.seconds}s...`);
      await new Promise((resolve) =>
        setTimeout(resolve, (action.seconds || 5) * 1000)
      );
      return true;

    case 'command':
      if (!action.cmd) return false;
      const cmd = replaceVariables(action.cmd, context);
      console.log(`  🔧 Running: ${cmd}`);
      try {
        await execa('bash', ['-c', cmd], {
          cwd: context.projectPath,
          stdio: 'pipe'
        });
        return true;
      } catch {
        console.log(`  ⚠️ Command failed`);
        return false;
      }

    case 'log':
      console.log(`  📝 ${action.message || 'Error logged'}`);
      return true;

    case 'notify':
      console.log(`  📣 User notification: ${action.message || 'Action required'}`);
      return true;

    case 'retry':
      // Retry is handled at higher level
      return true;

    default:
      return false;
  }
}

/**
 * Attempt to recover from an error
 */
export async function attemptRecovery(
  errorMessage: string,
  context: RecoveryContext,
  retryCount: number = 0
): Promise<RecoveryResult> {
  const match = await findHandler(errorMessage);

  if (!match) {
    return {
      handled: false,
      recovered: false,
      message: 'No handler found for this error'
    };
  }

  const { name, handler } = match;

  if (retryCount >= handler.max_retries) {
    return {
      handled: true,
      recovered: false,
      handlerName: name,
      retriesUsed: retryCount,
      message: replaceVariables(handler.fallback, context)
    };
  }

  console.log(`\n🔄 Attempting recovery: ${handler.description}`);

  // Execute actions in sequence
  let shouldRetry = false;
  for (const action of handler.actions) {
    if (action.action === 'retry') {
      shouldRetry = true;
      break;
    }
    await executeAction(action, context);
  }

  if (shouldRetry) {
    return {
      handled: true,
      recovered: true,
      handlerName: name,
      retriesUsed: retryCount + 1,
      message: `Recovery attempt ${retryCount + 1}/${handler.max_retries}`
    };
  }

  return {
    handled: true,
    recovered: true,
    handlerName: name,
    retriesUsed: retryCount,
    message: 'Recovery actions completed'
  };
}

/**
 * Wrap an async operation with automatic error recovery
 */
export async function withRecovery<T>(
  operation: () => Promise<T>,
  context: RecoveryContext,
  maxRetries: number = 3
): Promise<T> {
  let lastError: Error | null = null;
  let retryCount = 0;

  while (retryCount < maxRetries) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      const errorMessage = lastError.message || String(lastError);

      const result = await attemptRecovery(errorMessage, context, retryCount);

      if (!result.handled) {
        // Unknown error, don't retry
        throw lastError;
      }

      if (!result.recovered) {
        // Handler exists but recovery failed
        console.error(`\n❌ Recovery failed: ${result.message}`);
        throw new Error(result.message);
      }

      retryCount++;
      console.log(`  ↻ Retry ${retryCount}/${maxRetries}...`);
    }
  }

  throw lastError || new Error('Max retries exceeded');
}

/**
 * Get all error handlers for a category
 */
export async function getHandlersByCategory(
  category: string
): Promise<Record<string, ErrorHandler>> {
  const { handlers } = await loadHandlers();
  const result: Record<string, ErrorHandler> = {};

  for (const [name, handler] of Object.entries(handlers)) {
    if (handler.category === category) {
      result[name] = handler;
    }
  }

  return result;
}

/**
 * Check if an error is recoverable
 */
export async function isRecoverable(errorMessage: string): Promise<boolean> {
  const match = await findHandler(errorMessage);
  return match !== null && match.handler.max_retries > 0;
}

/**
 * Get severity of an error
 */
export async function getErrorSeverity(
  errorMessage: string
): Promise<Severity | null> {
  const match = await findHandler(errorMessage);
  return match?.handler.severity || null;
}
