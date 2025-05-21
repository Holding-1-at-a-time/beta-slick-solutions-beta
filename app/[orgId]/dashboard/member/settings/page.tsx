import { MemberSettings } from "@/components/member/member-settings"

export default function SettingsPage({
  params,
}: {
  params: { orgId: string }
}) {
  return <MemberSettings orgId={params.orgId} />
}
