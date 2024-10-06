resource "azurerm_kubernetes_cluster" "aks" {
  name                = local.kubernetes_name
  location            = local.location
  resource_group_name = local.resource_group_name
  dns_prefix          = "myaks"

  default_node_pool {
    name       = "default"
    node_count = 1
    vm_size    = "Standard_D2_v2"
  }

  identity {
    type = "SystemAssigned"
  }

  network_profile {
    network_plugin = "azure"
    load_balancer_sku = "standard"
  }

  role_based_access_control_enabled = true

  depends_on = [ azurerm_resource_group.appgrp ]
}