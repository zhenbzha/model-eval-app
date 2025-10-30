param name string
param location string

param postgresAdminLogin string

@secure()
param postgresAdminPassword string

var postgresqlDatabaseName = 'modelevaldb'

resource postgresqlServer 'Microsoft.DBforPostgreSQL/flexibleServers@2025-01-01-preview' = {
  name: name
  location: location
  sku: {
    name: 'Standard_B1ms'
    tier: 'Burstable'
  }
  properties: {
    version: '17'
    administratorLogin: postgresAdminLogin
    administratorLoginPassword: postgresAdminPassword
    storage: {
      storageSizeGB: 32
    }
    backup: {
      backupRetentionDays: 7
      geoRedundantBackup: 'Disabled'
    }
    network: {
      publicNetworkAccess: 'Enabled'
    }
  }
}

resource postgresqlDatabase 'Microsoft.DBforPostgreSQL/flexibleServers/databases@2025-01-01-preview' = {
  parent: postgresqlServer
  name: postgresqlDatabaseName
}

@secure()
output connectionString string = 'postgresql://${postgresAdminLogin}:${postgresAdminPassword}@${postgresqlServer.properties.fullyQualifiedDomainName}:5432/${postgresqlDatabase.name}?sslmode=require'

output serverName string = postgresqlServer.name
output databaseName string = postgresqlDatabase.name
