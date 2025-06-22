# AGENT.md - Development Guide

## Project Overview
3D Architecture Diagram for Custody Wallet System using Three.js and TypeScript. Interactive 3D visualization showing different layers of a cryptocurrency custody wallet architecture.

## Build/Test/Lint Commands
- `npm install` - Install dependencies
- `npm run dev` - Start development server (Vite)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run type-check` - TypeScript type checking

## Architecture & Structure
- `src/main.ts` - Main application entry point
- `src/scene.ts` - Three.js scene setup and lighting
- `src/components.ts` - 3D component rendering and interactions
- `src/connections.ts` - Connection lines between components
- `src/controls.ts` - Camera controls (orbit, zoom, pan)
- `src/config.ts` - Architecture configuration and component definitions
- `src/types.ts` - TypeScript type definitions

## Code Style Guidelines
- Use TypeScript strict mode with proper type annotations
- Follow PascalCase for classes, camelCase for variables/functions
- Import Three.js as `import * as THREE from 'three'`
- Group related functionality into classes
- Use descriptive names for component configurations
- Add userData to Three.js objects for identification
