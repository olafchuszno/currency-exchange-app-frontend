// , isPublic: boolean = false

export function getEnvVariable (envVariableKey: string, concatWithValue: string = '') {
  // const publicPrefix = isPublic ? 'NEXT_PUBLIC_' : '';
  
  const envVariableValue = process.env[envVariableKey] || '';

  return  `${envVariableValue}${concatWithValue}`;
}