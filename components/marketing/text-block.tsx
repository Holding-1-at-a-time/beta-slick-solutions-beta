import { cn } from "@/lib/utils"

interface TextBlockProps {
  title: string
  subtitle?: string
  description?: string
  align?: "left" | "center" | "right"
  titleSize?: "sm" | "md" | "lg" | "xl"
  className?: string
  theme?: "light" | "dark"
}

export default function TextBlock({
  title,
  subtitle,
  description,
  align = "left",
  titleSize = "md",
  className,
  theme = "light",
}: TextBlockProps) {
  const alignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  }

  const titleClasses = {
    sm: "text-2xl md:text-3xl",
    md: "text-3xl md:text-4xl",
    lg: "text-4xl md:text-5xl lg:text-6xl",
    xl: "text-5xl md:text-6xl lg:text-7xl",
  }

  const themeClasses = {
    light: {
      title: "text-gray-900",
      subtitle: "text-primary",
      description: "text-gray-600",
    },
    dark: {
      title: "text-white",
      subtitle: "text-primary",
      description: "text-gray-300",
    },
  }

  return (
    <div className={cn(alignClasses[align], className)}>
      {subtitle && (
        <p className={`mb-2 text-sm font-semibold uppercase tracking-wider ${themeClasses[theme].subtitle}`}>
          {subtitle}
        </p>
      )}
      <h2 className={cn("font-bold tracking-tight", titleClasses[titleSize], themeClasses[theme].title)}>{title}</h2>
      {description && <p className={`mt-4 text-lg ${themeClasses[theme].description}`}>{description}</p>}
    </div>
  )
}
