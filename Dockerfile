FROM mcr.microsoft.com/dotnet/sdk:8.0

WORKDIR /app

# Restore first to leverage Docker layer cache
COPY src/backend/Parking.Api.csproj src/backend/
RUN dotnet restore ./src/backend/Parking.Api.csproj

# Copy backend source
COPY src/backend ./src/backend

ENV ASPNETCORE_URLS=http://0.0.0.0:5000

WORKDIR /app/src/backend

EXPOSE 5000

CMD ["dotnet", "run", "--urls", "http://0.0.0.0:5000"]
