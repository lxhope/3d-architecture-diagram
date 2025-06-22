import { ComponentConfig, ComponentType, Connection } from './types';

export const components: ComponentConfig[] = [
  // Top Layer - Client Applications (Y: 10)
  { name: 'Web App', position: [-3, 10, 0], color: '#00ff88', size: [2.2, 1.4, 1.2], type: ComponentType.CLIENT },
  { name: 'Mobile App', position: [0, 10, 0], color: '#00ff88', size: [2.2, 1.4, 1.2], type: ComponentType.CLIENT },
  { name: 'Admin Panel', position: [3, 10, 0], color: '#00ff88', size: [2.2, 1.4, 1.2], type: ComponentType.CLIENT },

  // Second Layer - Gateway (Y: 7)
  { name: 'Load Balancer', position: [-1.5, 7, 0], color: '#ff6600', size: [2.8, 1.2, 1.4], type: ComponentType.GATEWAY },
  { name: 'API Gateway', position: [1.5, 7, 0], color: '#ff6600', size: [2.8, 1.2, 1.4], type: ComponentType.GATEWAY },

  // Third Layer - Core Services (Y: 4)
  { name: 'Auth Service', position: [-3, 4, 0], color: '#0088ff', size: [2.4, 1.6, 1.4], type: ComponentType.SERVICE },
  { name: 'Wallet Service', position: [0, 4, 0], color: '#0088ff', size: [2.4, 1.6, 1.4], type: ComponentType.SERVICE },
  { name: 'Transaction Service', position: [3, 4, 0], color: '#0088ff', size: [2.4, 1.6, 1.4], type: ComponentType.SERVICE },
  { name: 'Notification Service', position: [6, 4, 0], color: '#0088ff', size: [2.4, 1.6, 1.4], type: ComponentType.SERVICE },

  // Fourth Layer - Security & Databases (Y: 1)
  { name: 'Key Management', position: [-4, 1, 0], color: '#ff3366', size: [2.2, 2.0, 1.6], type: ComponentType.SECURITY },
  { name: 'HSM', position: [-1.5, 1, 0], color: '#ff3366', size: [2.0, 2.0, 1.6], type: ComponentType.SECURITY },
  { name: 'Encryption Service', position: [1.5, 1, 0], color: '#ff3366', size: [2.2, 2.0, 1.6], type: ComponentType.SECURITY },

  { name: 'User DB', position: [-3, 1, -3], color: '#aa00ff', size: [2.2, 1.2, 2.2], type: ComponentType.DATABASE },
  { name: 'Wallet DB', position: [0, 1, -3], color: '#aa00ff', size: [2.2, 1.2, 2.2], type: ComponentType.DATABASE },
  { name: 'Transaction DB', position: [3, 1, -3], color: '#aa00ff', size: [2.2, 1.2, 2.2], type: ComponentType.DATABASE },
  { name: 'Audit DB', position: [4, 1, 0], color: '#aa00ff', size: [2.2, 1.2, 2.2], type: ComponentType.DATABASE },

  // Bottom Layer - Blockchain (Y: -2)
  { name: 'Bitcoin Node', position: [-2, -2, 0], color: '#ffaa00', size: [2.0, 2.0, 2.0], type: ComponentType.BLOCKCHAIN },
  { name: 'Ethereum Node', position: [0, -2, 0], color: '#ffaa00', size: [2.0, 2.0, 2.0], type: ComponentType.BLOCKCHAIN },
  { name: 'Blockchain Monitor', position: [2, -2, 0], color: '#ffaa00', size: [2.0, 2.0, 2.0], type: ComponentType.BLOCKCHAIN },
];

export const connections: Connection[] = [
  // Client Layer to Gateway Layer (Top to Second)
  { from: 'Web App', to: 'Load Balancer', type: 'api' },
  { from: 'Mobile App', to: 'Load Balancer', type: 'api' },
  { from: 'Admin Panel', to: 'API Gateway', type: 'api' },
  
  // Gateway Layer to Service Layer (Second to Third)
  { from: 'Load Balancer', to: 'Auth Service', type: 'api' },
  { from: 'Load Balancer', to: 'Wallet Service', type: 'api' },
  { from: 'API Gateway', to: 'Transaction Service', type: 'api' },
  { from: 'API Gateway', to: 'Notification Service', type: 'api' },
  
  // Service Layer to Security Layer (Third to Fourth)
  { from: 'Auth Service', to: 'Encryption Service', type: 'secure' },
  { from: 'Wallet Service', to: 'Key Management', type: 'secure' },
  { from: 'Transaction Service', to: 'HSM', type: 'secure' },
  
  // Service Layer to Database Layer (Third to Fourth)
  { from: 'Auth Service', to: 'User DB', type: 'data' },
  { from: 'Wallet Service', to: 'Wallet DB', type: 'data' },
  { from: 'Transaction Service', to: 'Transaction DB', type: 'data' },
  { from: 'Notification Service', to: 'Audit DB', type: 'data' },
  
  // Security/Database Layer to Blockchain Layer (Fourth to Bottom)
  { from: 'HSM', to: 'Bitcoin Node', type: 'secure' },
  { from: 'HSM', to: 'Ethereum Node', type: 'secure' },
  { from: 'Key Management', to: 'Blockchain Monitor', type: 'api' },
  
  // Additional hierarchical connections
  { from: 'Transaction Service', to: 'Bitcoin Node', type: 'api' },
  { from: 'Transaction Service', to: 'Ethereum Node', type: 'api' },
  { from: 'Wallet Service', to: 'Blockchain Monitor', type: 'api' },
];
