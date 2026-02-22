export function splitStatements(script: string): string[] {
  const statements: string[] = [];
  let buffer = '';

  let isSingleQuoted = false;
  let isDoubleQuoted = false;
  let isBacktickQuoted = false;
  let isLineComment = false;
  let isBlockComment = false;

  for (let index = 0; index < script.length; index += 1) {
    const current = script[index];
    const next = script[index + 1];

    if (isLineComment) {
      buffer += current;
      if (current === '\n') {
        isLineComment = false;
      }
      continue;
    }

    if (isBlockComment) {
      buffer += current;
      if (current === '*' && next === '/') {
        buffer += next;
        index += 1;
        isBlockComment = false;
      }
      continue;
    }

    if (!isSingleQuoted && !isDoubleQuoted && !isBacktickQuoted) {
      if (current === '-' && next === '-') {
        buffer += current + next;
        index += 1;
        isLineComment = true;
        continue;
      }

      if (current === '/' && next === '*') {
        buffer += current + next;
        index += 1;
        isBlockComment = true;
        continue;
      }
    }

    if (current === '\'' && !isDoubleQuoted && !isBacktickQuoted) {
      isSingleQuoted = !isSingleQuoted;
      buffer += current;
      continue;
    }

    if (current === '"' && !isSingleQuoted && !isBacktickQuoted) {
      isDoubleQuoted = !isDoubleQuoted;
      buffer += current;
      continue;
    }

    if (current === '`' && !isSingleQuoted && !isDoubleQuoted) {
      isBacktickQuoted = !isBacktickQuoted;
      buffer += current;
      continue;
    }

    if (current === ';' && !isSingleQuoted && !isDoubleQuoted && !isBacktickQuoted) {
      const statement = buffer.trim();
      if (statement.length > 0) {
        statements.push(statement);
      }
      buffer = '';
      continue;
    }

    buffer += current;
  }

  const finalStatement = buffer.trim();
  if (finalStatement.length > 0) {
    statements.push(finalStatement);
  }

  return statements;
}
