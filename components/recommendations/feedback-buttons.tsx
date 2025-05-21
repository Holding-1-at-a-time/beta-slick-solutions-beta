"use client"

import { ThumbsUp, ThumbsDown } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FeedbackButtonsProps {
  onFeedback: (feedback: "positive" | "negative") => void
}

export function FeedbackButtons({ onFeedback }: FeedbackButtonsProps) {
  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-muted-foreground mr-2">Was this helpful?</span>
      <Button variant="outline" size="sm" className="h-8 px-2" onClick={() => onFeedback("positive")}>
        <ThumbsUp className="h-4 w-4 mr-1" />
        Yes
      </Button>
      <Button variant="outline" size="sm" className="h-8 px-2" onClick={() => onFeedback("negative")}>
        <ThumbsDown className="h-4 w-4 mr-1" />
        No
      </Button>
    </div>
  )
}
