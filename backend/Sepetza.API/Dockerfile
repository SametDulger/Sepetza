# 1. Build aşaması
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /app

# Solution ve proje dosyalarını kopyala
COPY ../../*.sln ./
COPY *.csproj ./
RUN dotnet restore

# Tüm dosyaları kopyala ve publish
COPY . ./
RUN dotnet publish -c Release -o /publish

# 2. Runtime aşaması
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app

# Publish edilen dosyaları kopyala
COPY --from=build /publish .

# Render dynamic port için
ENV ASPNETCORE_URLS=http://+:$PORT
EXPOSE 80

# Start command
ENTRYPOINT ["dotnet", "Sepetza.API.dll"]