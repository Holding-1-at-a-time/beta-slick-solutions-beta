import { formatDistanceToNow } from "date-fns"
import { Activity } from "lucide-react"

interface ActivityItem {
  id: string
  type: string
  description: string
  timestamp: string
}

interface RecentActivityProps {
  activities: ActivityItem[]
}

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>

      {activities.length === 0 ? (
        <div className="text-center py-8">
          <Activity className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-muted-foreground">No recent activity</p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {activities.map((activity) => (
            <li key={activity.id} className="py-3">
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">{activity.type}</p>
                  <p className="text-sm text-muted-foreground">{activity.description}</p>
                </div>
                <div className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
