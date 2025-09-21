'use client'

import { CVData, CVTheme } from '@/lib/validations'
import { ClassicTemplate } from './templates/classic'
import { ModernTemplate } from './templates/modern'
import { CompactTemplate } from './templates/compact'

interface CVRendererProps {
  data: CVData
  theme: CVTheme
  template: 'CLASSIC' | 'MODERN' | 'COMPACT'
  className?: string
}

export function CVRenderer({ data, theme, template, className }: CVRendererProps) {
  const templateProps = { data, theme, className }

  switch (template) {
    case 'CLASSIC':
      return <ClassicTemplate {...templateProps} />
    case 'MODERN':
      return <ModernTemplate {...templateProps} />
    case 'COMPACT':
      return <CompactTemplate {...templateProps} />
    default:
      return <ModernTemplate {...templateProps} />
  }
}