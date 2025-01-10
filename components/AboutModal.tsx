'use client'

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Github, Twitter } from 'lucide-react'
import Link from 'next/link'

export function AboutModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost">About</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>About TypeScript to Python Converter</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <DialogDescription asChild>
            <p>
              TypeScript to Python Converter is a tool that converts Supabase <code>database.types.ts</code> files into Pydantic models for Python.
            </p>
          </DialogDescription>
          <DialogDescription asChild>
            <p>
              This tool simplifies the process of creating Python models from your Supabase TypeScript definitions, making it easier to work with your database schema in Python projects.
            </p>
          </DialogDescription>
          <DialogDescription asChild>
            <p>
              Created as part of a v0 project demonstration.
            </p>
          </DialogDescription>
          <DialogDescription asChild>
            <p>
              How to use:
              <ol className="list-decimal list-inside mt-2">
                <li>Upload your <code>database.types.ts</code> file</li>
                <li>Click &quot;Convert to Python&quot;</li>
                <li>Review the generated Python code</li>
                <li>Download or copy the code to use in your project</li>
              </ol>
            </p>
          </DialogDescription>
          <DialogDescription asChild>
            <p>
              Found a bug or have a feature request? Let me know on Twitter:
            </p>
          </DialogDescription>
          <DialogDescription asChild>
            <div className="flex items-center justify-center">
              <Link href="https://x.com/0xyjkim" target="_blank" rel="noopener noreferrer" className="inline-flex items-center space-x-2 text-blue-500 hover:underline">
                <span>@0xyjkim</span>
              </Link>
            </div>
          </DialogDescription>

          <DialogDescription asChild>
            <p className="text-sm text-gray-500 text-center">
              Note: This tool is not affiliated with Supabase or Pydantic.
            </p>
          </DialogDescription>
        </div>
      </DialogContent>
    </Dialog>
  )
}

