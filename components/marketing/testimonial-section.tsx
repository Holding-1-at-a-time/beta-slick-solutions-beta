import { Card, CardContent } from "@/components/ui/card"
import TextBlock from "@/components/marketing/text-block"
import { Quote } from "lucide-react"

interface TestimonialProps {
  quote: string
  author: string
  role: string
  company: string
}

function Testimonial({ quote, author, role, company }: TestimonialProps) {
  return (
    <Card className="h-full border-gray-200">
      <CardContent className="flex h-full flex-col p-6">
        <Quote className="h-8 w-8 text-primary/40" />
        <p className="mt-4 flex-1 text-lg text-gray-700">{quote}</p>
        <div className="mt-6">
          <p className="font-semibold text-gray-900">{author}</p>
          <p className="text-sm text-gray-600">
            {role}, {company}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default function TestimonialSection() {
  const testimonials = [
    {
      quote:
        "This platform has completely transformed how we manage our auto repair shop. The scheduling system alone has saved us countless hours and reduced no-shows by 35%.",
      author: "Michael Rodriguez",
      role: "Owner",
      company: "Elite Auto Service",
    },
    {
      quote:
        "The customer portal is a game-changer. Our clients love being able to see their vehicle history, upcoming appointments, and invoices all in one place.",
      author: "Sarah Johnson",
      role: "Service Manager",
      company: "Precision Motors",
    },
    {
      quote:
        "As a multi-location dealership, we needed a solution that could scale with us. This platform delivers with robust reporting and seamless communication across all our service centers.",
      author: "David Chen",
      role: "Operations Director",
      company: "Metro Auto Group",
    },
  ]

  return (
    <section id="testimonials" className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <TextBlock
          title="Trusted by Automotive Professionals"
          description="Don't just take our word for it. Here's what our customers have to say about our platform."
          align="center"
          className="mb-12"
        />

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Testimonial
              key={index}
              quote={testimonial.quote}
              author={testimonial.author}
              role={testimonial.role}
              company={testimonial.company}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
