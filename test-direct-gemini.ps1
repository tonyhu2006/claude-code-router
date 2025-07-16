Write-Host "🧪 Testing direct Gemini Balance connection..."

$headers = @{
    "Authorization" = "Bearer Hjd-961207hjd"
    "Content-Type" = "application/json"
}

$bodyData = @{
    model = "gemini-1.5-flash"
    messages = @(
        @{
            role = "user"
            content = "Hello! Please respond with a simple greeting."
        }
    )
    max_tokens = 100
}

$body = $bodyData | ConvertTo-Json -Depth 10

Write-Host "📡 URL: http://84.8.145.89:8000/v1/chat/completions"

try {
    $response = Invoke-WebRequest -Uri "http://84.8.145.89:8000/v1/chat/completions" -Method POST -Headers $headers -Body $body
    Write-Host "✅ Status: $($response.StatusCode)"
    Write-Host "📄 Response:"
    Write-Host $response.Content
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)"
}
