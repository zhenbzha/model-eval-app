param webName string
param location string
param tags object = {}
param containerAppsEnvironmentId string

@secure()
param postgresConnectionString string

param registryLoginServer string
param managedIdentityId string

resource webContainerApp 'Microsoft.App/containerApps@2025-01-01' = {
  name: webName
  location: location
  tags: union(tags, { 'azd-service-name': 'web' })
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: {
      '${managedIdentityId}': {}
    }
  }
  properties: {
    managedEnvironmentId: containerAppsEnvironmentId
    configuration: {
      registries: [
        {
          server: registryLoginServer
          identity: managedIdentityId
        }
      ]
      ingress: {
        external: true
        targetPort: 3000
      }
      secrets: [
        {
          name: 'postgres-connection-string'
          value: postgresConnectionString
        }
      ]
    }
    template: {
      containers: [
        {
          name: 'web'
          image: 'mcr.microsoft.com/azuredocs/containerapps-helloworld:latest'
          resources: {
            cpu: json('0.5')
            memory: '1.0Gi'
          }
          env: [
            {
              name: 'DATABASE_URL'
              secretRef: 'postgres-connection-string'
            }
          ]
        }
      ]
      scale: {
        minReplicas: 1
        maxReplicas: 10
      }
    }
  }
}

output fqdn string = webContainerApp.properties.configuration.ingress.fqdn
output name string = webContainerApp.name
