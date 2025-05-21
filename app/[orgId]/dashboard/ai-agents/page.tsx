import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  PerceptionAgent,
  SchedulerAgent,
  DynamicPricingAgent,
  InsightsAgent,
  RecommendationAgent,
  SupervisorAgent,
} from "@/components/agents"

export default function AIAgentsPage({ params }: { params: { orgId: string } }) {
  const { orgId } = params

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">AI Agents</h1>
        <p className="text-muted-foreground">
          Intelligent agents to assist with various tasks in your vehicle service business
        </p>
      </div>

      <Tabs defaultValue="perception">
        <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full">
          <TabsTrigger value="perception">Perception</TabsTrigger>
          <TabsTrigger value="scheduler">Scheduler</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="recommendation">Recommendation</TabsTrigger>
          <TabsTrigger value="supervisor">Supervisor</TabsTrigger>
        </TabsList>

        <TabsContent value="perception">
          <Card>
            <CardHeader>
              <CardTitle>Perception Agent</CardTitle>
              <CardDescription>Analyzes vehicle images to detect damage and issues</CardDescription>
            </CardHeader>
            <CardContent>
              <PerceptionAgent assessmentId="mock-assessment-id" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduler">
          <Card>
            <CardHeader>
              <CardTitle>Scheduler Agent</CardTitle>
              <CardDescription>Optimizes appointment scheduling based on availability</CardDescription>
            </CardHeader>
            <CardContent>
              <SchedulerAgent orgId={orgId} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing">
          <Card>
            <CardHeader>
              <CardTitle>Dynamic Pricing Agent</CardTitle>
              <CardDescription>Calculates optimal pricing based on service complexity</CardDescription>
            </CardHeader>
            <CardContent>
              <DynamicPricingAgent contextId="mock-context-id" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights">
          <Card>
            <CardHeader>
              <CardTitle>Insights Agent</CardTitle>
              <CardDescription>Analyzes business metrics to provide actionable insights</CardDescription>
            </CardHeader>
            <CardContent>
              <InsightsAgent orgId={orgId} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendation">
          <Card>
            <CardHeader>
              <CardTitle>Recommendation Agent</CardTitle>
              <CardDescription>Suggests personalized services based on customer history</CardDescription>
            </CardHeader>
            <CardContent>
              <RecommendationAgent orgId={orgId} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="supervisor">
          <Card>
            <CardHeader>
              <CardTitle>Supervisor Agent</CardTitle>
              <CardDescription>Orchestrates multiple agents to solve complex tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <SupervisorAgent
                orgId={orgId}
                task="Analyze vehicle damage, recommend services, and schedule an appointment"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
