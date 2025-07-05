import { ImportDataTypeStringMappings } from './ImportDataTypeStringMappings';

export type ImportDataTypeStrings = (typeof ImportDataTypeStringMappings)[keyof typeof ImportDataTypeStringMappings]; 