param name string
param location string

@description('Address prefix')
param vnetAddressPrefix string = '10.0.0.0/16'

@description('Container Apps subnet name')
param containerAppsSubnetName string = 'container-apps-subnet'

@description('Container Apps subnet address prefix')
param containerAppsSubnetPrefix string = '10.0.0.0/23'

@description('Private endpoints subnet name')
param privateEndpointsSubnetName string = 'private-endpoints-subnet'

@description('Private endpoints subnet address prefix')
param privateEndpointsSubnetPrefix string = '10.0.3.0/24'

resource containerAppsNsg 'Microsoft.Network/networkSecurityGroups@2024-07-01' = {
  name: '${name}-${containerAppsSubnetName}-nsg'
  location: location
  properties: {
    securityRules: [
      {
        name: 'Allow-HTTPS-Inbound'
        properties: {
          protocol: 'Tcp'
          sourcePortRange: '*'
          destinationPortRange: '443'
          sourceAddressPrefix: '*'
          destinationAddressPrefix: '*'
          access: 'Allow'
          priority: 100
          direction: 'Inbound'
        }
      }
      {
        name: 'Allow-HTTP-Inbound'
        properties: {
          protocol: 'Tcp'
          sourcePortRange: '*'
          destinationPortRange: '80'
          sourceAddressPrefix: '*'
          destinationAddressPrefix: '*'
          access: 'Allow'
          priority: 110
          direction: 'Inbound'
        }
      }
    ]
  }
}

resource vnet 'Microsoft.Network/virtualNetworks@2024-07-01' = {
  name: name
  location: location
  properties: {
    addressSpace: {
      addressPrefixes: [
        vnetAddressPrefix
      ]
    }
    subnets: [
      {
        name: containerAppsSubnetName
        properties: {
          addressPrefix: containerAppsSubnetPrefix
          networkSecurityGroup: {
            id: containerAppsNsg.id
          }
        }
      }
      {
        name: privateEndpointsSubnetName
        properties: {
          addressPrefix: privateEndpointsSubnetPrefix
          privateEndpointNetworkPolicies: 'Disabled'
        }
      }
    ]
  }
}

output vnetId string = vnet.id
output containerAppsSubnetId string = resourceId('Microsoft.Network/virtualNetworks/subnets', vnet.name, containerAppsSubnetName)
output privateEndpointsSubnetId string = resourceId('Microsoft.Network/virtualNetworks/subnets', vnet.name, privateEndpointsSubnetName)
