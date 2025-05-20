// This is a placeholder file that will be replaced when you run `npx convex dev`
// It allows the project to build before the real generated files exist

export const api = {
  mutations: {
    createUser: "mutations:createUser",
    updateUser: "mutations:updateUser",
    markUserDeleted: "mutations:markUserDeleted",
    createTenant: "mutations:createTenant",
    addUserToTenant: "mutations:addUserToTenant",
    createVehicle: "mutations:createVehicle",
    createAssessment: "mutations:createAssessment",
    createTestRecord: "mutations:createTestRecord",
  },
  queries: {
    getUserByClerkId: "queries:getUserByClerkId",
    listVehicles: "queries:listVehicles",
    getClientOverview: "queries:getClientOverview",
    listTestRecords: "queries:listTestRecords",
  },
}
