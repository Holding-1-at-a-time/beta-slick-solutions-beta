import { MemberAnalytics } from "@/components/member/member-analytics"

export default function AnalyticsPage({
  params,
}: {
  params: { orgId: string }
}) {
  return <MemberAnalytics orgId={params.orgId} />
}
