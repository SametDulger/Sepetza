# 1. Build
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /app

# Solution ve tüm proje dosyalarını kopyala
COPY Sepetza.sln ./
COPY backend/Sepetza.API/*.csproj ./backend/Sepetza.API/
COPY backend/Sepetza.Core/*.csproj ./backend/Sepetza.Core/
COPY backend/Sepetza.Data/*.csproj ./backend/Sepetza.Data/
COPY backend/Sepetza.Business/*.csproj ./backend/Sepetza.Business/

# Restore
RUN dotnet restore

# Tüm dosyaları kopyala
COPY . ./

# Publish
RUN dotnet publish backend/Sepetza.API -c Release -o /publish

# 2. Runtime
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build /publish .

# Render dynamic port
ENV ASPNETCORE_URLS=http://+:$PORT
EXPOSE 80

ENTRYPOINT ["dotnet", "Sepetza.API.dll"]