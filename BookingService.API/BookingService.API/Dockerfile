# Dockerfile para BookingService.API
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 5000

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY BookingService.API/BookingService.API/BookingService.API.csproj .
COPY RentaFacil.Shared/RentaFacil.Shared/RentaFacil.Shared.csproj ./RentaFacil.Shared/
RUN dotnet restore ./BookingService.API.csproj
COPY BookingService.API/BookingService.API/. .
RUN rm -rf ./bin ./obj
COPY RentaFacil.Shared/RentaFacil.Shared/. ./RentaFacil.Shared/
RUN rm -rf ./RentaFacil.Shared/bin ./RentaFacil.Shared/obj
RUN dotnet publish ./BookingService.API.csproj -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "BookingService.API.dll"] 