import type { Metadata } from "next"
import Header from "@/components/marketing/header"
import Footer from "@/components/marketing/footer"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "System Status - VehicleService",
  description: "Check the current status of the VehicleService platform and its components.",
}

export default function StatusPage() {
  // This would typically be fetched from a status API
  const systemStatus = {
    overall: "operational", // operational, degraded, partial_outage, major_outage
    lastUpdated: "2025-05-20T11:30:00Z",
    components: [
      {
        name: "API",
        status: "operational",
        lastIncident: null,
      },
      {
        name: "Web Application",
        status: "operational",
        lastIncident: null,
      },
      {
        name: "Database",
        status: "operational",
        lastIncident: null,
      },
      {
        name: "Authentication",
        status: "operational",
        lastIncident: null,
      },
      {
        name: "Payment Processing",
        status: "operational",
        lastIncident: null,
      },
      {
        name: "Notification System",
        status: "operational",
        lastIncident: null,
      },
    ],
    incidents: [
      {
        id: "inc-2025-05-15",
        title: "Scheduled Maintenance",
        status: "resolved",
        date: "2025-05-15T02:00:00Z",
        duration: "120", // minutes
        affected: ["API", "Web Application"],
        description:
          "Scheduled maintenance to upgrade database infrastructure. All systems are now operating normally.",
      },
      {
        id: "inc-2025-04-22",
        title: "API Performance Degradation",
        status: "resolved",
        date: "2025-04-22T14:30:00Z",
        duration: "45", // minutes
        affected: ["API"],
        description:
          "Some users experienced slow response times when using the API. The issue was identified and resolved.",
      },
    ],
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "operational":
        return <Badge className="bg-green-500">Operational</Badge>
      case "degraded":
        return <Badge className="bg-yellow-500">Degraded</Badge>
      case "partial_outage":
        return <Badge className="bg-orange-500">Partial Outage</Badge>
      case "major_outage":
        return <Badge className="bg-red-500">Major Outage</Badge>
      default:
        return <Badge className="bg-gray-500">Unknown</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    })
  }

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <Header />
      <main className="flex-1 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <h1 className="mb-4 text-4xl font-bold tracking-tight text-white">System Status</h1>
              <p className="text-xl text-gray-300">Current status of the VehicleService platform and its components.</p>
            </div>

            <Card className="mb-8 border-gray-800 bg-gray-900/50">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">System Status</CardTitle>
                  {getStatusBadge(systemStatus.overall)}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">Last updated: {formatDate(systemStatus.lastUpdated)}</p>
              </CardContent>
            </Card>

            <h2 className="mb-4 text-2xl font-bold text-white">Components</h2>
            <div className="mb-12 grid gap-4 md:grid-cols-2">
              {systemStatus.components.map((component) => (
                <Card key={component.name} className="border-gray-800 bg-gray-900/50">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white">{component.name}</CardTitle>
                      {getStatusBadge(component.status)}
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>

            <h2 className="mb-4 text-2xl font-bold text-white">Recent Incidents</h2>
            {systemStatus.incidents.length > 0 ? (
              <div className="space-y-4">
                {systemStatus.incidents.map((incident) => (
                  <Card key={incident.id} className="border-gray-800 bg-gray-900/50">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-white">{incident.title}</CardTitle>
                        <Badge className="bg-green-500">Resolved</Badge>
                      </div>
                      <p className="text-sm text-gray-400">
                        {formatDate(incident.date)} • Duration: {incident.duration} minutes
                      </p>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-2 text-gray-300">{incident.description}</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="text-sm text-gray-400">Affected components:</span>
                        {incident.affected.map((component) => (
                          <Badge key={component} variant="outline" className="border-gray-700 text-gray-300">
                            {component}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-gray-800 bg-gray-900/50">
                <CardContent className="py-6 text-center">
                  <p className="text-gray-300">No incidents reported in the last 90 days.</p>
                </CardContent>
              </Card>
            )}

            <div className="mt-12 text-center">
              <p className="text-gray-300">
                If you're experiencing issues not reflected on this page, please{" "}
                <a href="/contact" className="text-primary hover:underline">
                  contact our support team
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
