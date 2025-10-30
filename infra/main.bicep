targetScope = 'subscription'

@minLength(1)
@maxLength(64)
@description('Name of the environment for resource naming')
param environmentName string

@minLength(1)
@description('Primary location for all resources')
param location string

@description('PostgreSQL administrator login')
param postgresAdminLogin string

@secure()
@description('PostgreSQL administrator password')
param postgresAdminPassword string

var abbrs = loadJsonContent('./abbreviations.json')
var resourceToken = toLower(uniqueString(subscription().id, environmentName, location))
var tags = { 'azd-env-name': environmentName }

// Resource group
resource rg 'Microsoft.Resources/resourceGroups@2024-11-01' = {
  name: '${abbrs.resourcesResourceGroups}${environmentName}'
  location: location
  tags: tags
}

// Virtual Network
module vnet './core/vnet.bicep' = {
  name: 'vnet'
  scope: rg
  params: {
    name: '${abbrs.networkVirtualNetworks}${resourceToken}'
    location: location
  }
}

// Container Registry
module containerRegistry './core/container-registry.bicep' = {
  name: 'container-registry'
  scope: rg
  params: {
    name: '${abbrs.containerRegistryRegistries}${resourceToken}'
    location: location
    tags: tags
  }
}

// Managed Identity
module managedIdentity './core/managed-identity.bicep' = {
  name: 'managed-identity'
  scope: rg
  params: {
    name: '${abbrs.managedIdentityUserAssignedIdentities}${resourceToken}'
    location: location
    tags: tags
  }
}

// Container Apps Environment
module containerAppsEnvironment './core/container-env.bicep' = {
  name: 'container-env'
  scope: rg
  params: {
    name: '${abbrs.appManagedEnvironments}${resourceToken}'
    location: location
    containerAppsSubnetId: vnet.outputs.containerAppsSubnetId
  }
}

// ACR Role Assignment
module acrRoleAssignment './core/acr-role-assignment.bicep' = {
  name: 'acr-role-assignment'
  scope: rg
  params: {
    managedIdentityPrincipalId: managedIdentity.outputs.managedIdentityPrincipalId
    registryId: containerRegistry.outputs.registryId
  }
}

// PostgreSQL
module postgres './app/postgres.bicep' = {
  name: 'postgres'
  scope: rg
  params: {
    name: '${abbrs.dBforPostgreSQLServers}${resourceToken}'
    location: location
    postgresAdminLogin: postgresAdminLogin
    postgresAdminPassword: postgresAdminPassword
  }
}

// Web Container App
module web './app/containerapp-web.bicep' = {
  name: 'web'
  scope: rg
  params: {
    webName: '${abbrs.appContainerApps}web-${resourceToken}'
    location: location
    tags: tags
    containerAppsEnvironmentId: containerAppsEnvironment.outputs.containerAppsEnvironmentId
    postgresConnectionString: postgres.outputs.connectionString
    registryLoginServer: containerRegistry.outputs.registryLoginServer
    managedIdentityId: managedIdentity.outputs.managedIdentityId
  }
}

// Outputs
output AZURE_LOCATION string = location
output AZURE_CONTAINER_REGISTRY_ENDPOINT string = containerRegistry.outputs.registryLoginServer
output AZURE_CONTAINER_REGISTRY_NAME string = containerRegistry.outputs.registryName
output WEB_URI string = 'https://${web.outputs.fqdn}'
output POSTGRES_SERVER_NAME string = postgres.outputs.serverName
output POSTGRES_DATABASE_NAME string = postgres.outputs.databaseName
