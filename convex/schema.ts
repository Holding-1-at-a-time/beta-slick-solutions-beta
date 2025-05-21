import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  appointments: defineTable({
    tenantId: v.string(),
    userId: v.string(), // client user ID
    assignedToId: v.string(), // staff member ID
    vehicleId: v.id("vehicles"),
    assessmentId: v.optional(v.id("assessments")),
    date: v.number(), // timestamp
    time: v.string(),
    duration: v.number(), // in minutes
    serviceType: v.string(),
    status: v.string(), // "scheduled", "in_progress", "completed", "cancelled"
    notes: v.optional(v.string()),
    createdAt: v.number(),
  }),

  invoices: defineTable({
    tenantId: v.string(),
    userId: v.string(), // client user ID
    appointmentId: v.id("appointments"),
    assessmentId: v.optional(v.id("assessments")),
    amount: v.number(),
    status: v.string(), // "draft", "sent", "paid", "overdue"
    dueDate: v.number(), // timestamp
    items: v.array(
      v.object({
        description: v.string(),
        unitPrice: v.number(),
        quantity: v.number(),
      }),
    ),
    createdAt: v.number(),
  }),

  // New payments table for deposits and payments
  payments: defineTable({
    tenantId: v.string(),
    userId: v.string(), // client user ID
    appointmentId: v.optional(v.id("appointments")),
    invoiceId: v.optional(v.id("invoices")),
    amount: v.number(),
    currency: v.string(),
    status: v.string(), // "pending", "succeeded", "failed"
    paymentMethod: v.string(), // "card", "bank_transfer", etc.
    paymentIntentId: v.string(), // Stripe payment intent ID
    metadata: v.optional(v.object({})),
    createdAt: v.number(),
  })
    .index("by_appointment", ["appointmentId", "tenantId"])
    .index("by_invoice", ["invoiceId", "tenantId"])
    .index("by_user", ["userId", "tenantId"]),

  // New activities table for tracking user actions
  activities: defineTable({
    userId: v.string(),
    tenantId: v.string(),
    type: v.string(), // "appointment_booked", "payment_made", etc.
    description: v.string(),
    entityId: v.optional(v.id()),
    entityType: v.optional(v.string()),
    timestamp: v.number(),
  })
    .index("by_user", ["userId", "tenantId"])
    .index("by_tenant", ["tenantId", "timestamp"])
    .index("by_entity", ["entityId", "entityType"]),

  // For storing pricing settings history
  pricingLogs: defineTable({
    tenantId: v.string(),
    updatedBy: v.string(), // userId who made the change
    serviceRates: v.array(
      v.object({
        name: v.string(),
        rate: v.number(),
      }),
    ),
    laborRate: v.number(),
    partsMarkup: v.number(), // percentage
    createdAt: v.number(),
  }),

  // For member notifications
  notifications: defineTable({
    tenantId: v.string(),
    userId: v.string(), // staff member ID
    title: v.string(),
    message: v.string(),
    type: v.string(), // "appointment", "assessment", "invoice", "system"
    entityId: v.optional(v.id()), // ID of related item
    entityType: v.optional(v.string()), // Type of related entity
    vehicleId: v.optional(v.id("vehicles")), // For assessment notifications
    read: v.boolean(),
    readAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_user", ["userId", "tenantId"])
    .index("by_entity", ["entityId", "entityType"]),

  // Client preferences
  clientPreferences: defineTable({
    userId: v.string(),
    tenantId: v.string(),
    branding: v.object({
      primaryColor: v.optional(v.string()),
      secondaryColor: v.optional(v.string()),
      logo: v.optional(v.string()),
      darkMode: v.optional(v.boolean()),
    }),
    notifications: v.optional(
      v.object({
        email: v.optional(v.boolean()),
        sms: v.optional(v.boolean()),
        push: v.optional(v.boolean()),
      }),
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user_tenant", ["userId", "tenantId"]),

  // AI Agent related tables
  media: defineTable({
    tenantId: v.string(),
    assessmentId: v.id("assessments"),
    url: v.string(),
    type: v.string(), // "image", "video"
    metadata: v.optional(v.object({})),
    createdAt: v.number(),
  }).index("by_assessment", ["assessmentId", "tenantId"]),

  mediaAnalysis: defineTable({
    tenantId: v.string(),
    mediaId: v.id("media"),
    analysisType: v.string(), // "damage", "part", "condition"
    results: v.object({}),
    embedding: v.array(v.float64()),
    createdAt: v.number(),
  }).vectorIndex("by_embedding", {
    vectorField: "embedding",
    dimensions: 1536,
    filterFields: ["tenantId"],
  }),

  slots: defineTable({
    tenantId: v.string(),
    start: v.number(), // timestamp
    end: v.number(), // timestamp
    available: v.boolean(),
    createdAt: v.number(),
  }),

  businessInsights: defineTable({
    tenantId: v.string(),
    type: v.string(), // "revenue", "customer", "service"
    period: v.string(), // "daily", "weekly", "monthly", "quarterly", "yearly", "event"
    startDate: v.number(), // timestamp
    endDate: v.number(), // timestamp
    data: v.object({}),
    createdAt: v.number(),
  }),

  agentMemory: defineTable({
    tenantId: v.string(),
    agentName: v.string(),
    content: v.string(),
    embedding: v.optional(v.array(v.float64())),
    timestamp: v.number(),
  }).vectorIndex("by_embedding", {
    vectorField: "embedding",
    dimensions: 1536,
    filterFields: ["tenantId", "agentName"],
  }),

  agentTrajectories: defineTable({
    tenantId: v.string(),
    agentName: v.string(),
    contextId: v.string(),
    steps: v.array(v.object({})),
    feedback: v.optional(v.object({})),
    createdAt: v.number(),
  }),

  // New tables for RL/HER
  replayBuffer: defineTable({
    tenantId: v.string(),
    agentName: v.string(), // "PerceptionAgent", "SchedulerAgent", "DynamicPricingAgent"
    state: v.object({}),
    action: v.object({}),
    reward: v.number(),
    nextState: v.object({}),
    done: v.boolean(),
    timestamp: v.number(),
  }).index("by_agent_tenant", ["agentName", "tenantId"]),

  policies: defineTable({
    tenantId: v.string(),
    agentName: v.string(),
    version: v.number(),
    weights: v.object({}), // Serialized model weights
    hyperparams: v.object({}),
    performance: v.object({}),
    createdAt: v.number(),
  }).index("by_agent_version", ["agentName", "version"]),

  issues: defineTable({
    tenantId: v.string(),
    assessmentId: v.id("assessments"),
    mediaId: v.id("media"),
    type: v.string(), // "damage", "scratch", "dent", etc.
    location: v.string(),
    severity: v.string(), // "low", "medium", "high"
    boundingBox: v.object({
      x: v.number(),
      y: v.number(),
      width: v.number(),
      height: v.number(),
    }),
    confidence: v.number(),
    createdAt: v.number(),
  }).index("by_assessment", ["assessmentId", "tenantId"]),

  recommendations: defineTable({
    tenantId: v.string(),
    userId: v.string(),
    vehicleId: v.optional(v.id("vehicles")),
    type: v.string(), // "service", "maintenance", "repair"
    title: v.string(),
    description: v.string(),
    priority: v.string(), // "low", "medium", "high"
    estimatedCost: v.optional(v.number()),
    createdAt: v.number(),
  }).index("by_user_tenant", ["userId", "tenantId"]),

  agentLogs: defineTable({
    level: v.string(),
    source: v.string(),
    message: v.string(),
    data: v.optional(v.any()),
    timestamp: v.number(),
    orgId: v.optional(v.string()),
    userId: v.optional(v.string()),
    sessionId: v.optional(v.string()),
  })
    .index("by_timestamp", ["timestamp"])
    .index("by_source", ["source"])
    .index("by_level", ["level"])
    .index("by_org", ["orgId"])
    .index("by_user", ["userId"]),
})

export default defineSchema({
  // Users table
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    username: v.optional(v.string()),
    role: v.optional(v.string()),
    tenantId: v.optional(v.id("tenants")),
    lastSignInAt: v.optional(v.number()),
    isDeleted: v.optional(v.boolean()),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_email", ["email"])
    .index("by_tenant", ["tenantId"]),

  // Tenants (Organizations) table
  tenants: defineTable({
    clerkOrgId: v.string(),
    name: v.string(),
    slug: v.string(),
    logo: v.optional(v.string()),
    contactEmail: v.optional(v.string()),
    primaryColor: v.optional(v.string()),
    secondaryColor: v.optional(v.string()),
    requireDeposit: v.optional(v.boolean()),
    depositPercentage: v.optional(v.number()),
    stripeAccountId: v.optional(v.string()),
    businessHours: v.optional(v.array(v.object({
      day: v.string(), // "monday", "tuesday", etc.
      open: v.string(), // "09:00"
      close: v.string(), // "17:00"
      isClosed: v.boolean(),
    }))),
    address: v.optional(v.object({
      street: v.string(),
      city: v.string(),
      state: v.string(),
      zipCode: v.string(),
      country: v.string(),
    })),
    settings: v.optional(v.object({
      allowOnlineBooking: v.boolean(),
      allowOnlinePayments: v.boolean(),
      sendAutomatedReminders: v.boolean(),
      reminderHours: v.number(), // hours before appointment
      taxRate: v.number(),
      currency: v.string(), // "USD", "EUR", etc.
    })),
    isDeleted: v.optional(v.boolean()),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_clerk_org_id", ["clerkOrgId"])
    .index("by_slug", ["slug"]),

  // Invitations table
  invitations: defineTable({
    clerkInvitationId: v.string(),
    clerkOrgId: v.string(),
    tenantId: v.optional(v.id("tenants")),
    email: v.string(),
    role: v.string(),
    status: v.string(), // "pending", "accepted", "revoked"
    acceptedBy: v.optional(v.string()), // Clerk user ID
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_clerk_invitation_id", ["clerkInvitationId"])
    .index("by_clerk_org_id", ["clerkOrgId"])
    .index("by_email", ["email"])
    .index("by_tenant", ["tenantId"]),

  // Domains table
  domains: defineTable({
    clerkDomainId: v.string(),
    clerkOrgId: v.string(),
    tenantId: v.optional(v.id("tenants")),
    name: v.string(),
    status: v.string(), // "verified", "unverified", "pending"
    isDeleted: v.optional(v.boolean()),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_clerk_domain_id", ["clerkDomainId"])
    .index("by_clerk_org_id", ["clerkOrgId"])
    .index("by_tenant", ["tenantId"]),

  // Roles table
  roles: defineTable({
    clerkRoleId: v.string(),
    clerkOrgId: v.optional(v.string()),
    tenantId: v.optional(v.id("tenants")),
    name: v.string(),
    key: v.string(),
    description: v.optional(v.string()),
    permissions: v.array(v.string()),
    isDeleted: v.optional(v.boolean()),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_clerk_role_id", ["clerkRoleId"])
    .index("by_clerk_org_id", ["clerkOrgId"])
    .index("by_tenant", ["tenantId"]),

  // Permissions table
  permissions: defineTable({
    clerkPermissionId: v.string(),
    clerkOrgId: v.optional(v.string()),
    tenantId: v.optional(v.id("tenants")),
    name: v.string(),
    key: v.string(),
    description: v.optional(v.string()),
    type: v.string(),
    isDeleted: v.optional(v.boolean()),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_clerk_permission_id", ["clerkPermissionId"])
    .index("by_clerk_org_id", ["clerkOrgId"])
    .index("by_tenant", ["tenantId"]),

  // Sessions table
  sessions: defineTable({
    clerkSessionId: v.string(),
    clerkUserId: v.string(),
    userId: v.optional(v.id("users")),
    status: v.string(), // "active", "ended", "removed", "revoked", "pending"
    lastActiveAt: v.number(),
    deviceInfo: v.object({
      userAgent: v.optional(v.string()),
      ipAddress: v.optional(v.string()),
      browser: v.optional(v.string()),
      os: v.optional(v.string()),
      deviceType: v.optional(v.string()),
    }),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_clerk_session_id", ["clerkSessionId"])
    .index("by_clerk_user_id", ["clerkUserId"])
    .index("by_user", ["userId"]),

  // Communications table (emails and SMS)
  communications: defineTable({
    type: v.string(), // "email" or "sms"
    clerkEmailId: v.optional(v.string()),
    clerkSmsId: v.optional(v.string()),
    clerkUserId: v.string(),
    userId: v.optional(v.id("users")),
    emailAddress: v.optional(v.string()),
    phoneNumber: v.optional(v.string()),
    subject: v.optional(v.string()),
    message: v.optional(v.string()),
    status: v.string(),
    emailType: v.optional(v.string()),
    smsType: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_clerk_email_id", ["clerkEmailId"])
    .index("by_clerk_sms_id", ["clerkSmsId"])
    .index("by_clerk_user_id", ["clerkUserId"])
    .index("by_user", ["userId"]),

  // Waitlist table
  waitlist: defineTable({
    clerkWaitlistId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    status: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_clerk_waitlist_id", ["clerkWaitlistId"])
    .index("by_email", ["email"]),

  // ==================== NEW TABLES ====================

  // Vehicles table
  vehicles: defineTable({
    tenantId: v.id("tenants"),
    ownerId: v.id("users"),
    make: v.string(),
    model: v.string(),
    year: v.number(),
    vin: v.optional(v.string()),
    licensePlate: v.optional(v.string()),
    color: v.string(),
    mileage: v.number(),
    fuelType: v.optional(v.string()),
    transmissionType: v.optional(v.string()),
    engineType: v.optional(v.string()),
    status: v.string(), // "active", "inactive", "in_service", "sold"
    notes: v.optional(v.string()),
    maintenanceHistory: v.optional(v.array(v.object({
      date: v.number(),
      description: v.string(),
      mileage: v.number(),
      serviceId: v.optional(v.id("services")),
    }))),
    embeddingId: v.optional(v.id("vehicleEmbeddings")),
    isDeleted: v.optional(v.boolean()),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_tenant", ["tenantId"])
    .index("by_owner", ["tenantId", "ownerId"])
    .index("by_make_model", ["tenantId", "make", "model"])
    .index("by_vin", ["tenantId", "vin"])
    .index("by_license_plate", ["tenantId", "licensePlate"])
    .index("by_status", ["tenantId", "status"])
    .index("by_embedding", ["embeddingId"]),

  // Vehicle embeddings table for vector search
  vehicleEmbeddings: defineTable({
    embedding: v.array(v.float64()),
    tenantId: v.id("tenants"),
    make: v.string(),
    model: v.string(),
    year: v.number(),
  }).vectorIndex("by_embedding", {
    vectorField: "embedding",
    dimensions: 1536,
    filterFields: ["tenantId", "make", "model", "year"],
  }),

  // Services table
  services: defineTable({
    tenantId: v.id("tenants"),
    name: v.string(),
    description: v.string(),
    category: v.string(), // "maintenance", "repair", "detailing", "inspection"
    duration: v.number(), // in minutes
    price: v.number(),
    isPackage: v.boolean(), // whether this is a package of multiple services
    packageItems: v.optional(v.array(v.id("serviceItems"))),
    isActive: v.boolean(),
    embeddingId: v.optional(v.id("serviceEmbeddings")),
    isDeleted: v.optional(v.boolean()),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_tenant", ["tenantId"])
    .index("by_category", ["tenantId", "category"])
    .index("by_active", ["tenantId", "isActive"])
    .index("by_embedding", ["embeddingId"]),

  // Service embeddings table for vector search
  serviceEmbeddings: defineTable({
    embedding: v.array(v.float64()),
    tenantId: v.id("tenants"),
    category: v.string(),
  }).vectorIndex("by_embedding", {
    vectorField: "embedding",
    dimensions: 1536,
    filterFields: ["tenantId", "category"],
  }),

  // Service Items table (for individual items within a service package)
  serviceItems: defineTable({
    tenantId: v.id("tenants"),
    serviceId: v.id("services"),
    name: v.string(),
    description: v.string(),
    duration: v.number(), // in minutes
    price: v.number(),
    isActive: v.boolean(),
    isDeleted: v.optional(v.boolean()),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_tenant", ["tenantId"])
    .index("by_service", ["serviceId"]),

  // Assessments table
  assessments: defineTable({
    tenantId: v.id("tenants"),
    vehicleId: v.id("vehicles"),
    technicianId: v.id("users"),
    appointmentId: v.optional(v.id("appointments")),
    date: v.number(),
    status: v.string(), // "draft", "completed", "approved", "rejected"
    overallCondition: v.string(), // "excellent", "good", "fair", "poor"
    notes: v.string(),
    recommendations: v.array(v.object({
      serviceId: v.id("services"),
      priority: v.string(), // "critical", "high", "medium", "low"
      notes: v.optional(v.string()),
    })),
    checklistItems: v.array(v.object({
      category: v.string(),
      item: v.string(),
      status: v.string(), // "pass", "fail", "warning", "not_applicable"
      notes: v.optional(v.string()),
    })),
    mediaIds: v.array(v.id("media")),
    summaryEmbeddingId: v.optional(v.id("assessmentEmbeddings")),
    isDeleted: v.optional(v.boolean()),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_tenant", ["tenantId"])
    .index("by_vehicle", ["tenantId", "vehicleId"])
    .index("by_technician", ["tenantId", "technicianId"])
    .index("by_appointment", ["tenantId", "appointmentId"])
    .index("by_date", ["tenantId", "date"])
    .index("by_status", ["tenantId", "status"])
    .index("by_embedding", ["summaryEmbeddingId"]),

  // Assessment embeddings table for vector search
  assessmentEmbeddings: defineTable({
    embedding: v.array(v.float64()),
    tenantId: v.id("tenants"),
    vehicleId: v.id("vehicles"),
    overallCondition: v.string(),
  }).vectorIndex("by_embedding", {
    vectorField: "embedding",
    dimensions: 1536,
    filterFields: ["tenantId", "vehicleId", "overallCondition"],
  }),

  // Media table (for images, videos, documents)
  media: defineTable({
    tenantId: v.id("tenants"),
    type: v.string(), // "image", "video", "document"
    storageId: v.string(), // Convex storage ID
    fileName: v.string(),
    fileSize: v.number(),
    mimeType: v.string(),
    url: v.string(),
    thumbnailUrl: v.optional(v.string()),
    metadata: v.optional(v.object({
      width: v.optional(v.number()),
      height: v.optional(v.number()),
      duration: v.optional(v.number()), // for videos
      pages: v.optional(v.number()), // for documents
    })),
    tags: v.optional(v.array(v.string())),
    vehicleId: v.optional(v.id("vehicles")),
    assessmentId: v.optional(v.id("assessments")),
    appointmentId: v.optional(v.id("appointments")),
    invoiceId: v.optional(v.id("invoices")),
    uploadedBy: v.id("users"),
    aiAnalysisId: v.optional(v.id("mediaAnalysis")),
    isDeleted: v.optional(v.boolean()),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_tenant", ["tenantId"])
    .index("by_vehicle", ["tenantId", "vehicleId"])
    .index("by_assessment", ["tenantId", "assessmentId"])
    .index("by_appointment", ["tenantId", "appointmentId"])
    .index("by_invoice", ["tenantId", "invoiceId"])
    .index("by_type", ["tenantId", "type"])
    .index("by_tags", ["tenantId", "tags"])
    .index("by_analysis", ["aiAnalysisId"]),

  // Media Analysis table (for AI analysis of images)
  mediaAnalysis: defineTable({
    tenantId: v.id("tenants"),
    mediaId: v.id("media"),
    analysisType: v.string(), // "damage_detection", "part_identification", "condition_assessment"
    results: v.object({
      summary: v.string(),
      confidence: v.number(),
      detections: v.optional(v.array(v.object({
        label: v.string(),
        confidence: v.number(),
        boundingBox: v.optional(v.object({
          x: v.number(),
          y: v.number(),
          width: v.number(),
          height: v.number(),
        })),
      }))),
    }),
    embedding: v.array(v.float64()),
    isDeleted: v.optional(v.boolean()),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_tenant", ["tenantId"])
    .index("by_media", ["mediaId"])
    .vectorIndex("by_embedding", {
      vectorField: "embedding",
      dimensions: 1536,
      filterFields: ["tenantId", "analysisType"],
    }),

  // Appointments table
  appointments: defineTable({
    tenantId: v.id("tenants"),
    customerId: v.id("users"),
    vehicleId: v.id("vehicles"),
    assignedTechnicianId: v.optional(v.id("users")),
    serviceIds: v.array(v.id("services")),
    status: v.string(), // "scheduled", "confirmed", "in_progress", "completed", "cancelled", "no_show"
    startTime: v.number(),
    endTime: v.number(),
    notes: v.optional(v.string()),
    customerNotes: v.optional(v.string()),
    internalNotes: v.optional(v.string()),
    source: v.string(), // "online", "phone", "walk_in", "ai_assistant"
    reminderSent: v.optional(v.boolean()),
    reminderSentAt: v.optional(v.number()),
    googleCalendarEventId: v.optional(v.string()),
    googleCalendarSyncedAt: v.optional(v.number()),
    invoiceId: v.optional(v.id("invoices")),
    assessmentId: v.optional(v.id("assessments")),
    isDeleted: v.optional(v.boolean()),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_tenant", ["tenantId"])
    .index("by_customer", ["tenantId", "customerId"])
    .index("by_vehicle", ["tenantId", "vehicleId"])
    .index("by_technician", ["tenantId", "assignedTechnicianId"])
    .index("by_status", ["tenantId", "status"])
    .index("by_date", ["tenantId", "startTime"])
    .index("by_date_range", ["tenantId", "startTime", "endTime"])
    .index("by_invoice", ["tenantId", "invoiceId"])
    .index("by_assessment", ["tenantId", "assessmentId"])
    .index("by_google_calendar", ["tenantId", "googleCalendarEventId"]),

  // Invoices table
  invoices: defineTable({
    tenantId: v.id("tenants"),
    customerId: v.id("users"),
    vehicleId: v.id("vehicles"),
    appointmentId: v.optional(v.id("appointments")),
    invoiceNumber: v.string(),
    status: v.string(), // "draft", "sent", "paid", "partially_paid", "overdue", "cancelled"
    issueDate: v.number(),
    dueDate: v.number(),
    items: v.array(v.object({
      serviceId: v.optional(v.id("services")),
      serviceItemId: v.optional(v.id("serviceItems")),
      description: v.string(),
      quantity: v.number(),
      unitPrice: v.number(),
      discount: v.optional(v.number()),
      taxRate: v.optional(v.number()),
      total: v.number(),
    })),
    subtotal: v.number(),
    taxAmount: v.number(),
    discountAmount: v.optional(v.number()),
    total: v.number(),
    amountPaid: v.number(),
    balance: v.number(),
    notes: v.optional(v.string()),
    termsAndConditions: v.optional(v.string()),
    paymentTerms: v.optional(v.string()),
    stripeInvoiceId: v.optional(v.string()),
    stripePaymentIntentId: v.optional(v.string()),
    mediaIds: v.optional(v.array(v.id("media"))),
    isDeleted: v.optional(v.boolean()),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_tenant", ["tenantId"])
    .index("by_customer", ["tenantId", "customerId"])
    .index("by_vehicle", ["tenantId", "vehicleId"])
    .index("by_appointment", ["tenantId", "appointmentId"])
    .index("by_invoice_number", ["tenantId", "invoiceNumber"])
    .index("by_status", ["tenantId", "status"])
    .index("by_date", ["tenantId", "issueDate"])
    .index("by_due_date", ["tenantId", "dueDate"])
    .index("by_stripe_invoice", ["tenantId", "stripeInvoiceId"]),

  // Payments table
  payments: defineTable({
    tenantId: v.id("tenants"),
    invoiceId: v.id("invoices"),
    customerId: v.id("users"),
    amount: v.number(),
    paymentMethod: v.string(), // "credit_card", "cash", "check", "bank_transfer", "other"
    paymentDate: v.number(),
    status: v.string(), // "pending", "completed", "failed", "refunded"
    stripePaymentIntentId: v.optional(v.string()),
    stripeChargeId: v.optional(v.string()),
    receiptUrl: v.optional(v.string()),
    notes: v.optional(v.string()),
    isDeleted: v.optional(v.boolean()),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_tenant", ["tenantId"])
    .index("by_invoice", ["tenantId", "invoiceId"])
    .index("by_customer", ["tenantId", "customerId"])
    .index("by_date", ["tenantId", "paymentDate"])
    .index("by_status", ["tenantId", "status"])
    .index("by_stripe_payment", ["tenantId", "stripePaymentIntentId"]),

  // Business Insights table
  businessInsights: defineTable({
    tenantId: v.id("tenants"),
    type: v.string(), // "revenue_forecast", "customer_retention", "service_popularity", "technician_efficiency"
    period: v.string(), // "daily", "weekly", "monthly", "quarterly", "yearly"
    startDate: v.number(),
    endDate: v.number(),
    data: v.object({
      summary: v.string(),
      metrics: v.array(v.object({
        name: v.string(),
        value: v.number(),
        change: v.optional(v.number()), // percentage change from previous period
        trend: v.optional(v.array(v.number())), // array of values for trend visualization
      })),
      recommendations: v.optional(v.array(v.string())),
    }),
    embeddingId: v.optional(v.id("insightEmbeddings")),
    isDeleted: v.optional(v.boolean()),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_tenant", ["tenantId"])
    .index("by_type", ["tenantId", "type"])
    .index("by_period", ["tenantId", "period"])
    .index("by_date_range", ["tenantId", "startDate", "endDate"])
    .index("by_embedding", ["embeddingId"]),

  // Business Insight embeddings table for vector search
  insightEmbeddings: defineTable({
    embedding: v.array(v.float64()),
    tenantId: v.id("tenants"),
    type: v.string(),
    period: v.string(),
  }).vectorIndex("by_embedding", {
    vectorField: "embedding",
    dimensions: 1536,
    filterFields: ["tenantId", "type", "period"],
  }),

  // Notifications table
  notifications: defineTable({
    tenantId: v.id("tenants"),
    userId: v.id("users"),
    type: v.string(), // "appointment_reminder", "invoice_due", "payment_received", "assessment_completed", "system_alert"
    title: v.string(),
    message: v.string(),
    status: v.string(), // "unread", "read", "archived"
    priority: v.string(), // "low", "medium", "high", "urgent"
    action: v.optional(v.object({
      type: v.string(), // "link", "button"
      label: v.string(),
      url: v.string(),
    })),
    relatedEntityType: v.optional(v.string()), // "appointment", "invoice", "assessment", "vehicle", "payment"
    relatedEntityId: v.optional(v.string()), // ID of the related entity
    scheduledFor: v.optional(v.number()), // timestamp for scheduled notifications
    sentVia: v.optional(v.array(v.string())), // ["app", "email", "sms"]
    isDeleted: v.optional(v.boolean()),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_tenant", ["tenantId"])
    .index("by_user", ["tenantId", "userId"])
    .index("by_status", ["tenantId", "userId", "status"])
    .index("by_type", ["tenantId", "type"])
    .index("by_priority", ["tenantId", "priority"])
    .index("by_scheduled", ["tenantId", "scheduledFor"])
    .index("by_related_entity", ["tenantId", "relatedEntityType", "relatedEntityId"]),
});
