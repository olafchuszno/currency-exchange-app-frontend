export default function getEnvVariable (envVariableKey: string, concatWithValue: string = '') {
  
  const envVariableValue = process.env[envVariableKey] || '';

  return  `${envVariableValue}${concatWithValue}`;
}