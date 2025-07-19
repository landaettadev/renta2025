# RentaFacil - Sistema de Gestión de Reservas de Vehículos

## 📋 Descripción

RentaFacil es un sistema completo de gestión de reservas de vehículos desarrollado con arquitectura de microservicios, utilizando .NET 8, Angular 18+ y Azure SQL Database.

## 🏗️ Arquitectura

### Backend (Microservicios)
- **VehicleService**: Gestión de vehículos y consulta de disponibilidad
- **BookingService**: Gestión de reservas y clientes
- **Worker**: Procesamiento de reportes diarios
- **RentaFacil.Shared**: Entidades y DTOs compartidos

### Frontend
- **Angular 18+**: Aplicación web con Material Design
- **Componentes Standalone**: Arquitectura moderna de Angular
- **Responsive Design**: Adaptable a diferentes dispositivos

### Base de Datos
- **Azure SQL Database**: Base de datos en la nube
- **Entity Framework Core**: ORM para .NET
- **Migraciones**: Control de versiones de esquema

## 🚀 Instalación Local

### Prerrequisitos
- .NET 8 SDK
- Node.js 18+
- SQL Server (local o Azure)
- Visual Studio 2022 o VS Code

### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd RentaFacil
```

### 2. Configurar Base de Datos
```bash
# Crear base de datos
CREATE DATABASE rentafacil;

# Ejecutar migraciones
dotnet ef database update --project BookingService.API/BookingService.API/ --startup-project BookingService.API/BookingService.API/
dotnet ef database update --project VehicleService.API/VehicleService.API/ --startup-project VehicleService.API/VehicleService.API/
```

### 3. Configurar APIs
```bash
# BookingService
cd BookingService.API/BookingService.API/
dotnet run

# VehicleService (en otra terminal)
cd VehicleService.API/VehicleService.API/
dotnet run
```

### 4. Configurar Frontend
```bash
cd renta-facil-frontend/renta-facil-frontend/
npm install
ng serve
```

### 5. Acceder a la aplicación
- **Frontend**: http://localhost:4200
- **BookingService Swagger**: https://localhost:7216/swagger
- **VehicleService Swagger**: https://localhost:7280/swagger

## 📊 Funcionalidades

### VehicleService
- ✅ Registrar vehículos
- ✅ Consultar disponibilidad por tipo y fechas
- ✅ API REST con Swagger

### BookingService
- ✅ Crear reservas
- ✅ Asignar clientes a reservas
- ✅ Consultar historial por cliente
- ✅ Validaciones de negocio

### Frontend
- ✅ Buscar vehículos disponibles
- ✅ Crear nuevas reservas
- ✅ Ver historial de reservas
- ✅ Interfaz moderna con Material Design

### Worker
- ✅ Procesamiento de reportes diarios
- ✅ Almacenamiento en base de datos

## 🏛️ Arquitectura y Buenas Prácticas

### Clean Architecture
- **Separación de capas**: API, Application, Domain, Infrastructure
- **Dependency Injection**: Configurado en Program.cs
- **DTOs**: Separación entre entidades de dominio y transferencia de datos

### SOLID Principles
- **Single Responsibility**: Cada servicio tiene una responsabilidad específica
- **Open/Closed**: Extensible sin modificar código existente
- **Liskov Substitution**: Interfaces bien definidas
- **Interface Segregation**: Interfaces específicas por funcionalidad
- **Dependency Inversion**: Dependencias hacia abstracciones

### Patrones de Diseño
- **Repository Pattern**: Entity Framework como implementación
- **Service Layer**: Lógica de negocio encapsulada
- **DTO Pattern**: Transferencia de datos estructurada
- **Factory Pattern**: Creación de objetos complejos

### Domain Driven Design (DDD)
- **Entidades de Dominio**: Vehicle, Booking, Client, BookingHistory
- **Value Objects**: Fechas, estados, identificadores
- **Aggregates**: Agrupación lógica de entidades

## 🔧 Tecnologías Utilizadas

### Backend
- **.NET 8**: Framework principal
- **Entity Framework Core**: ORM
- **SQL Server**: Base de datos
- **Swagger**: Documentación de APIs
- **CORS**: Configuración para frontend

### Frontend
- **Angular 18+**: Framework de frontend
- **Angular Material**: Componentes UI
- **Standalone Components**: Arquitectura moderna
- **TypeScript**: Tipado estático
- **RxJS**: Programación reactiva

### DevOps
- **Git**: Control de versiones
- **Azure SQL Database**: Base de datos en la nube
- **Docker**: Contenedores (preparado para AKS)

## 📝 API Endpoints

### VehicleService
```
POST /api/vehicles - Registrar vehículo
GET /api/vehicles/available - Consultar disponibilidad
```

### BookingService
```
POST /api/bookings - Crear reserva
POST /api/bookings/assign-client - Asignar cliente
GET /api/bookings/history/{clientId} - Historial por cliente
```

## 🧪 Testing

### APIs
- **Swagger UI**: Documentación interactiva
- **Postman**: Colección disponible (pendiente)

### Frontend
- **Unit Tests**: Configurados con Jasmine
- **E2E Tests**: Configurados con Playwright

## 📈 Análisis de Código

### Métricas
- **Fine Code Coverage**: >10% (pendiente)
- **Static Analysis**: Configurado
- **Code Quality**: Seguimiento de buenas prácticas

## 🚀 Despliegue en Azure

### Infraestructura
- **Azure Container Apps (ACA)**: Microservicios
- **Azure SQL Database**: Base de datos
- **Azure Container Registry (ACR)**: Imágenes Docker
- **Azure DevOps**: CI/CD Pipeline

### Configuración
```yaml
# docker-compose.yml (pendiente)
version: '3.8'
services:
  vehicleservice:
    build: ./VehicleService.API
    ports:
      - "5280:80"
  
  bookingservice:
    build: ./BookingService.API
    ports:
      - "5216:80"
  
  worker:
    build: ./RentaFacil.Worker
```

## 📚 Documentación Adicional

### Diagramas
- **Arquitectura del Sistema**: Pendiente
- **Diagrama de Base de Datos**: Pendiente
- **Flujo de Usuario**: Pendiente

### Guías
- **Desarrollo Local**: Este README
- **Despliegue**: Pendiente
- **Troubleshooting**: Pendiente

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para detalles.

## 👥 Autores

- **Desarrollador**: [Tu Nombre]
- **Fecha**: Julio 2025
- **Versión**: 1.0.0

## 🎯 Estado del Proyecto

### ✅ Completado
- [x] Backend con microservicios
- [x] Frontend con Angular 18+
- [x] Base de datos Azure SQL
- [x] APIs REST con Swagger
- [x] Arquitectura Clean Architecture
- [x] Principios SOLID aplicados
- [x] Patrones de diseño implementados
- [x] Git con commits organizados

### ⏳ Pendiente
- [ ] Postman Collection
- [ ] Análisis de cobertura de código
- [ ] Despliegue en Azure DevOps
- [ ] Documentación de diagramas
- [ ] Docker Compose
- [ ] Tests unitarios completos 