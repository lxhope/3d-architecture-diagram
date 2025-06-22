import { ComponentConfig, ComponentType, Connection } from './types';

export const components: ComponentConfig[] = [
  // Client Layer
  { name: 'Web App', position: [-8, 4, 0], color: '#4CAF50', size: [1.5, 1, 0.8], type: ComponentType.CLIENT },
  { name: 'Mobile App', position: [-8, 2, 0], color: '#4CAF50', size: [1.5, 1, 0.8], type: ComponentType.CLIENT },
  { name: 'Admin Panel', position: [-8, 0, 0], color: '#4CAF50', size: [1.5, 1, 0.8], type: ComponentType.CLIENT },

  // Gateway Layer
  { name: 'Load Balancer', position: [-4, 3, 0], color: '#FF9800', size: [1.2, 0.8, 0.6], type: ComponentType.GATEWAY },
  { name: 'API Gateway', position: [-4, 1, 0], color: '#FF9800', size: [1.2, 0.8, 0.6], type: ComponentType.GATEWAY },

  // Service Layer
  { name: 'Auth Service', position: [0, 4, 0], color: '#2196F3', size: [1.8, 1.2, 1], type: ComponentType.SERVICE },
  { name: 'Wallet Service', position: [0, 2, 0], color: '#2196F3', size: [1.8, 1.2, 1], type: ComponentType.SERVICE },
  { name: 'Transaction Service', position: [0, 0, 0], color: '#2196F3', size: [1.8, 1.2, 1], type: ComponentType.SERVICE },
  { name: 'Notification Service', position: [0, -2, 0], color: '#2196F3', size: [1.8, 1.2, 1], type: ComponentType.SERVICE },

  // Security Layer
  { name: 'Key Management', position: [4, 3, 2], color: '#F44336', size: [1.5, 1.5, 1.2], type: ComponentType.SECURITY },
  { name: 'HSM', position: [4, 1, 2], color: '#F44336', size: [1.2, 1.2, 1], type: ComponentType.SECURITY },
  { name: 'Encryption Service', position: [4, -1, 2], color: '#F44336', size: [1.5, 1, 1], type: ComponentType.SECURITY },

  // Database Layer
  { name: 'User DB', position: [4, 4, -2], color: '#9C27B0', size: [1.5, 0.8, 1.2], type: ComponentType.DATABASE },
  { name: 'Wallet DB', position: [4, 2, -2], color: '#9C27B0', size: [1.5, 0.8, 1.2], type: ComponentType.DATABASE },
  { name: 'Transaction DB', position: [4, 0, -2], color: '#9C27B0', size: [1.5, 0.8, 1.2], type: ComponentType.DATABASE },
  { name: 'Audit DB', position: [4, -2, -2], color: '#9C27B0', size: [1.5, 0.8, 1.2], type: ComponentType.DATABASE },

  // Blockchain Layer
  { name: 'Bitcoin Node', position: [8, 2, 0], color: '#FFD700', size: [1.2, 1.2, 1.2], type: ComponentType.BLOCKCHAIN },
  { name: 'Ethereum Node', position: [8, 0, 0], color: '#FFD700', size: [1.2, 1.2, 1.2], type: ComponentType.BLOCKCHAIN },
  { name: 'Blockchain Monitor', position: [8, -2, 0], color: '#FFD700', size: [1.2, 1.2, 1.2], type: ComponentType.BLOCKCHAIN },
];

export const connections: Connection[] = [
  // Client to Gateway
  { from: 'Web App', to: 'Load Balancer', type: 'api' },
  { from: 'Mobile App', to: 'Load Balancer', type: 'api' },
  { from: 'Admin Panel', to: 'API Gateway', type: 'api' },
  
  // Gateway to Services
  { from: 'Load Balancer', to: 'Auth Service', type: 'api' },
  { from: 'API Gateway', to: 'Wallet Service', type: 'api' },
  { from: 'API Gateway', to: 'Transaction Service', type: 'api' },
  { from: 'API Gateway', to: 'Notification Service', type: 'api' },
  
  // Services to Security
  { from: 'Wallet Service', to: 'Key Management', type: 'secure' },
  { from: 'Transaction Service', to: 'HSM', type: 'secure' },
  { from: 'Auth Service', to: 'Encryption Service', type: 'secure' },
  
  // Services to Database
  { from: 'Auth Service', to: 'User DB', type: 'data' },
  { from: 'Wallet Service', to: 'Wallet DB', type: 'data' },
  { from: 'Transaction Service', to: 'Transaction DB', type: 'data' },
  { from: 'Transaction Service', to: 'Audit DB', type: 'data' },
  
  // Services to Blockchain
  { from: 'Transaction Service', to: 'Bitcoin Node', type: 'api' },
  { from: 'Transaction Service', to: 'Ethereum Node', type: 'api' },
  { from: 'Wallet Service', to: 'Blockchain Monitor', type: 'api' },
];
