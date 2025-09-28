# MEV Platform Screenshot Capture Script
# This script helps capture screenshots of each page

Write-Host "MEV Platform Screenshot Capture Tool" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""

Write-Host "Please follow these steps to capture screenshots:" -ForegroundColor Yellow
Write-Host ""

Write-Host "1. HOME PAGE (/)" -ForegroundColor Cyan
Write-Host "   - Navigate to: http://localhost:3000/"
Write-Host "   - Press Windows + Shift + S to capture"
Write-Host "   - Save as: 01-home-page.png"
Write-Host ""

Write-Host "2. MEV VISUALIZER (/visualizer)" -ForegroundColor Cyan
Write-Host "   - Navigate to: http://localhost:3000/visualizer"
Write-Host "   - Press Windows + Shift + S to capture"
Write-Host "   - Save as: 02-mev-visualizer.png"
Write-Host ""

Write-Host "3. ARBITRAGE CALCULATOR (/calculator)" -ForegroundColor Cyan
Write-Host "   - Navigate to: http://localhost:3000/calculator"
Write-Host "   - Press Windows + Shift + S to capture"
Write-Host "   - Save as: 03-arbitrage-calculator.png"
Write-Host ""

Write-Host "4. MEV PROTECTION CHECKER (/protection)" -ForegroundColor Cyan
Write-Host "   - Navigate to: http://localhost:3000w/protection"
Write-Host "   - Press Windows + Shift + S to capture"
Write-Host "   - Save as: 04-mev-protection.png"
Write-Host ""

Write-Host "5. GAS FEE PREDICTOR (/gas-predictor)" -ForegroundColor Cyan
Write-Host "   - Navigate to: http://localhost:3000/gas-predictor"
Write-Host "   - Press Windows + Shift + S to capture"
Write-Host "   - Save as: 05-gas-fee-predictor.png"
Write-Host ""

Write-Host "6. POPULAR POOLS (/popular-pools)" -ForegroundColor Cyan
Write-Host "   - Navigate to: http://localhost:3000/popular-pools"
Write-Host "   - Press Windows + Shift + S to capture"
Write-Host "   - Save as: 06-popular-pools.png"
Write-Host ""

Write-Host "7. MEV MARKET DASHBOARD (/dashboard/market)" -ForegroundColor Cyan
Write-Host "   - Navigate to: http://localhost:3000/dashboard/market"
Write-Host "   - Press Windows + Shift + S to capture"
Write-Host "   - Save as: 07-market-dashboard.png"
Write-Host ""

Write-Host "8. SEARCHER LEADERBOARD (/dashboard/leaderboard)" -ForegroundColor Cyan
Write-Host "   - Navigate to: http://localhost:3000/dashboard/leaderboard"
Write-Host "   - Press Windows + Shift + S to capture"
Write-Host "   - Save as: 08-leaderboard.png"
Write-Host ""

Write-Host "9. DEX EFFICIENCY TRACKER (/dashboard/dex-efficiency)" -ForegroundColor Cyan
Write-Host "   - Navigate to: http://localhost:3000/dashboard/dex-efficiency"
Write-Host "   - Press Windows + Shift + S to capture"
Write-Host "   - Save as: 09-dex-efficiency.png"
Write-Host ""

Write-Host "10. CROSS-CHAIN MEV MONITOR (/dashboard/cross-chain)" -ForegroundColor Cyan
Write-Host "    - Navigate to: http://localhost:3000/dashboard/cross-chain"
Write-Host "    - Press Windows + Shift + S to capture"
Write-Host "    - Save as: 10-cross-chain-monitor.png"
Write-Host ""

Write-Host ""
Write-Host "SCREENSHOT TIPS:" -ForegroundColor Yellow
Write-Host "- Use Windows + Shift + S for best quality"
Write-Host "- Capture the full page content"
Write-Host "- Include the navigation bar in each shot"
Write-Host "- Save in PNG format for best quality"
Write-Host "- Use consistent naming convention"
Write-Host ""

Write-Host "Press any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
