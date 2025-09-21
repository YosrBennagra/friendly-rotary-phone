'use client'

import { CVData, CVTheme } from '@/lib/validations'
import { ModernTemplate } from './templates/modern'

interface CVRendererProps {
  data: CVData
  theme: CVTheme
  // Kept for backwards compatibility with callers; ignored since only Modern is supported
  template?: 'MODERN'
  className?: string
  editable?: boolean
}

export function CVRenderer({ data, theme, className, editable }: CVRendererProps) {
  const templateProps = { data, theme, className, editable }
  return <ModernTemplate {...templateProps} />
}