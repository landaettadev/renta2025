# See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

# This stage is used when running from VS in fast mode (Default for Debug configuration)
FROM mcr.microsoft.com/dotnet/runtime:8.0 AS base
USER $APP_UID
WORKDIR /app

# This stage is used to build the service project
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY RentaFacil.Worker/RentaFacil.Worker/RentaFacil.Worker.csproj .
COPY RentaFacil.Shared/RentaFacil.Shared/RentaFacil.Shared.csproj ./RentaFacil.Shared/
RUN dotnet restore "./RentaFacil.Worker.csproj"
# Copiar solo archivos fuente, excluyendo bin y obj
COPY RentaFacil.Worker/RentaFacil.Worker/. .
RUN rm -rf ./bin ./obj
COPY RentaFacil.Shared/RentaFacil.Shared/. ./RentaFacil.Shared/
RUN rm -rf ./RentaFacil.Shared/bin ./RentaFacil.Shared/obj
RUN dotnet build "./RentaFacil.Worker.csproj" -c $BUILD_CONFIGURATION -o /app/build

# This stage is used to publish the service project to be copied to the final stage
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./RentaFacil.Worker.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# This stage is used in production or when running from VS in regular mode (Default when not using the Debug configuration)
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "RentaFacil.Worker.dll"]