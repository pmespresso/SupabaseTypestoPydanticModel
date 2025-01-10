import { NextRequest, NextResponse } from 'next/server'
import {
  parse_type_definition,
  extract_table_types,
  extract_enums,
  generate_pydantic_models,
} from '@/utils/converter'

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const file = formData.get('file') as File

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
  }

  const content = await file.text()

  const tables = extract_table_types(content)
  const enums = extract_enums(content)
  const pythonCode = generate_pydantic_models(tables, enums)

  return new NextResponse(pythonCode, {
    headers: {
      'Content-Type': 'text/plain',
      'Content-Disposition': 'attachment; filename="converted_models.py"',
    },
  })
}

