if (Get-Command "ngrok" -ErrorAction SilentlyContinue) {
    ngrok http 5173
} else {
    Write-Error "No se encontró 'ngrok' en tu sistema. Asegúrate de tenerlo instalado y añadido a las variables de entorno (PATH)."
    exit 1
}
