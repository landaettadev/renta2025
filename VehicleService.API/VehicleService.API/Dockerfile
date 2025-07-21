# Dockerfile para VehicleService.API
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 5001

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY VehicleService.API/VehicleService.API/VehicleService.API.csproj .
COPY RentaFacil.Shared/RentaFacil.Shared/RentaFacil.Shared.csproj ./RentaFacil.Shared/
RUN dotnet restore ./VehicleService.API.csproj
COPY VehicleService.API/VehicleService.API/. .
RUN rm -rf ./bin ./obj
COPY RentaFacil.Shared/RentaFacil.Shared/. ./RentaFacil.Shared/
RUN rm -rf ./RentaFacil.Shared/bin ./RentaFacil.Shared/obj
RUN dotnet publish ./VehicleService.API.csproj -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "VehicleService.API.dll"] 