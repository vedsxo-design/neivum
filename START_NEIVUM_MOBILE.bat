@echo off
setlocal
cd /d "%~dp0"
set "PORT=8080"
set "LOCAL_IP="

for /f "usebackq delims=" %%I in (`powershell -NoProfile -Command "$ip = Get-NetIPAddress -AddressFamily IPv4 ^| Where-Object { $_.IPAddress -notlike '127.*' -and $_.AddressState -eq 'Preferred' } ^| Select-Object -First 1 -ExpandProperty IPAddress; if ($ip) { $ip }"`) do set "LOCAL_IP=%%I"

echo.
echo  NEIVUM 0.1 / MOBILE TEST SERVER
echo  --------------------------------
if defined LOCAL_IP (
  echo  Open on your phone: http://%LOCAL_IP%:%PORT%/
) else (
  echo  Local IP was not detected. Run ipconfig and use your IPv4 address.
)
echo  Phone and PC must be connected to the same Wi-Fi network.
echo  Allow Python through Windows Firewall for private networks if requested.
echo.

py -m http.server %PORT% --bind 0.0.0.0
if errorlevel 1 python -m http.server %PORT% --bind 0.0.0.0
pause

