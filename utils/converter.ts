// converter.js

function extractDatabaseType(content) {
  // Extract the Database type definition
  const dbPattern = /type Database = {([^}]+)}/s;
  const match = content.match(dbPattern);
  if (!match) return null;

  // Parse the database structure
  const dbContent = match[1];
  return {
    public: {
      Enums: extractEnumsFromContent(dbContent),
      // Add other needed sections if required
    }
  };
}

function resolveDbReference(type, dbStructure) {
  // Handle Database reference patterns like Database["public"]["Enums"]["LanguageOptions"]
  const refPattern = /Database\["([^"]+)"\]\["([^"]+)"\]\["([^"]+)"\]/;
  const match = type.match(refPattern);
  
  if (match) {
    const [_, schema, category, name] = match;
    try {
      return dbStructure[schema][category][name];
    } catch (e) {
      console.warn(`Could not resolve database reference: ${type}`);
      return type;
    }
  }
  return null;
}

export function parse_type_definition(type_str, dbStructure) {
  // Basic type mappings
  const typeMapping = {
    'string': 'str',
    'number': 'float',
    'boolean': 'bool',
    'null': 'None',
    'Json': 'Dict[str, Any]',
    'string[]': 'List[str]',
    'Database': 'Dict[str, Any]',  // Add this line to handle Database type
  };

  // First try to resolve any database references
  if (type_str.includes('Database[')) {
    const resolvedType = resolveDbReference(type_str, dbStructure);
    if (resolvedType) {
      // If it resolves to a union type (like in enums), handle it
      if (Array.isArray(resolvedType)) {
        return `Literal[${resolvedType.map(v => `"${v}"`).join(', ')}]`;
      }
      return resolvedType;
    }
  }

  // Check if it's a basic type
  if (typeMapping[type_str]) {
    return typeMapping[type_str];
  }

  // Handle arrays
  if (type_str.endsWith('[]')) {
    const baseType = type_str.slice(0, -2);
    return `List[${parse_type_definition(baseType, dbStructure)}]`;
  }

  // Handle union types
  if (type_str.includes('|')) {
    const types = type_str.split('|').map(t => t.trim());
    const parsedTypes = types.map(t => parse_type_definition(t, dbStructure));
    
    if (parsedTypes.includes('None')) {
      const otherTypes = parsedTypes.filter(t => t !== 'None');
      if (otherTypes.length === 1) {
        return `Optional[${otherTypes[0]}]`;
      }
      return `Optional[Union[${otherTypes.join(', ')}]]`;
    }
    return `Union[${parsedTypes.join(', ')}]`;
  }

  return type_str;
}

function extractEnumsFromContent(content) {
  const enums = {};
  
  // Match enum definitions in the format "EnumName": "value1" | "value2" | ...
  const enumPattern = /(\w+):\s*((?:"[^"]+"(?:\s*\|\s*"[^"]+")*)|(?:\s*\|\s*"[^"]+")+)/g;
  let match;
  
  while ((match = enumPattern.exec(content)) !== null) {
    const enumName = match[1];
    const enumValuesStr = match[2];
    
    // Extract the individual values
    const valuePattern = /"([^"]+)"/g;
    let valueMatch;
    
    while ((valueMatch = valuePattern.exec(enumValuesStr)) !== null) {
      values.push(valueMatch[1]);
    }
    
    if (values.length > 0) {
      enums[enumName] = values;
    }
  }
  
  return enums;
}

export function extract_table_types(content) {
  const tables = {};
  
  // Find all table definitions
  const tablePattern = /(\w+):\s*{\s*Row:\s*{([^}]+)}/g;
  let match;

  // First extract the database structure for type resolution
  const dbStructure = extractDatabaseType(content);

  while ((match = tablePattern.exec(content)) !== null) {
    const tableName = match[1];
    const fieldsContent = match[2];
    
    // Extract field definitions
    const fields = {};
    const fieldPattern = /(\w+):\s*([^;\n]+)/g;
    let fieldMatch;
    
    while ((fieldMatch = fieldPattern.exec(fieldsContent)) !== null) {
      const fieldName = fieldMatch[1];
      const fieldType = fieldMatch[2].trim();
      fields[fieldName] = fieldType;
    }
    
    tables[tableName] = fields;
  }
  
  return { tables, dbStructure };
}

export function extract_enums(content) {
  // Extract enums from the Database type definition
  const dbStructure = extractDatabaseType(content);
  return dbStructure?.public?.Enums || {};
}

export function generate_pydantic_models(tableData, enums) {
  const { tables, dbStructure } = tableData;
  
  let output = `from typing import Dict, List, Optional, Union, Any, Literal
from datetime import datetime
from pydantic import BaseModel, Field
from enum import Enum

# Define Database type
Database = Dict[str, Any]

`;
  
  // Generate enum classes
  for (const [enumName, enumValues] of Object.entries(enums)) {
    output += `class ${enumName}(str, Enum):\n`;
    for (const value of enumValues) {
      const enumVarName = value.replace(/ /g, '_').replace(/-/g, '_').toUpperCase();
      output += `    ${enumVarName} = '${value}'\n`;
    }
    output += '\n';
  }
  
  // Generate model classes
  for (const [tableName, fields] of Object.entries(tables)) {
    const className = tableName
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
    
    output += `class ${className}(BaseModel):\n`;
    
    for (const [fieldName, fieldType] of Object.entries(fields)) {
      let pythonType = parse_type_definition(fieldType, dbStructure);
      
      // Handle special cases
      if (fieldName.includes('created_at') || fieldName.includes('updated_at')) {
        pythonType = 'datetime';
      }
      
      // Add Field with original name if it contains underscore
      if (fieldName.includes('_')) {
        output += `    ${fieldName}: ${pythonType} = Field(alias='${fieldName}')\n`;
      } else {
        output += `    ${fieldName}: ${pythonType}\n`;
      }
    }
    
    output += '\n    class Config:\n        populate_by_name = True\n\n';
  }
  
  return output;
}

