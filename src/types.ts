export interface ComponentConfig {
  name: string;
  position: [number, number, number];
  color: string;
  size: [number, number, number];
  type: ComponentType;
}

export enum ComponentType {
  CLIENT = 'client',
  GATEWAY = 'gateway',
  SERVICE = 'service',
  DATABASE = 'database',
  BLOCKCHAIN = 'blockchain',
  SECURITY = 'security'
}

export interface Connection {
  from: string;
  to: string;
  type: 'data' | 'api' | 'secure';
}
