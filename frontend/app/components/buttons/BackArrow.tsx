import React from 'react'
import { ArrowLeft, Link } from 'lucide-react'

export const BACK_ARROW_TEXT = "Back";

export function BackArrow({ link }: { link: string }) {
  return (
    <Link href={link} className="btn btn-ghost btn-sm gap-2">
      <ArrowLeft size={16} />
      {BACK_ARROW_TEXT}
    </Link>
  )
}
