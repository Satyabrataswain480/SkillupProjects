terraform {
  required_providers {
    azurerm = {
      source = "hashicorp/azurerm"
      version = "4.1.0"
    }
  }
}

provider "azurerm" {
  # Configuration options
  subscription_id = "f3277143-169f-4471-9141-ebc4ffec644b"
  tenant_id = "c8bd14a4-e65f-472d-b301-33f9c4046e60"
  client_id = "c8c3749b-bf1c-4080-aefd-462661fb7751"
  client_secret = "dXU8Q~D34ERazWqsSVaUIjBcyh9R9jg_lKFbBbS4" 
  features {}
}