
export function autoGeneratePlaceholders(code: string): string {
  let index = 1;
  let transformedCode = code;

  const functionRegex = /function\s+([a-zA-Z0-9_]+)\s*\(([^)]*)\)/g;

  transformedCode = transformedCode.replace(
    functionRegex,
    (match, funcName, params) => {
      const namePlaceholder = `\${${index++}:${funcName}}`;

      let paramsPlaceholder = "";
      if (params.trim()) {
        paramsPlaceholder = params
          .split(",")
          .map((p: string) => `\${${index++}:${p.trim()}}`)
          .join(", ");
      }

      return `function ${namePlaceholder}(${paramsPlaceholder})`;
    },
  );

  const arrowFuncRegex =
    /(const|let|var)\s+([a-zA-Z0-9_]+)\s*=\s*\(([^)]*)\)\s*=>/g;

  transformedCode = transformedCode.replace(
    arrowFuncRegex,
    (match, keyword, funcName, params) => {
      const namePlaceholder = `\${${index++}:${funcName}}`;

      let paramsPlaceholder = "";
      if (params.trim()) {
        paramsPlaceholder = params
          .split(",")
          .map((p: string) => `\${${index++}:${p.trim()}}`)
          .join(", ");
      }

      return `${keyword} ${namePlaceholder} = (${paramsPlaceholder}) =>`;
    },
  );

  const returnRegex = /return\s+([^;]+);/g;
  transformedCode = transformedCode.replace(returnRegex, (match, returnVal) => {
    return `return \${${index++}:${returnVal.trim()}};`;
  });

  return `${transformedCode}\n$0`;
}
