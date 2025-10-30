param name string
param location string
param containerAppsSubnetId string

resource containerAppsEnvironment 'Microsoft.App/managedEnvironments@2025-02-02-preview' = {
  name: name
  location: location
  properties: {
    vnetConfiguration: {
      internal: false
      infrastructureSubnetId: containerAppsSubnetId
    }
  }
}

output containerAppsEnvironmentId string = containerAppsEnvironment.id
