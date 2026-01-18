@echo off
echo ========================================
echo Power BI Matrix Visual - Build Script
echo ========================================
echo.

echo Checking Node.js installation...
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    echo Make sure to check "Add to PATH" during installation
    pause
    exit /b 1
)

echo Node.js found!
node --version
echo.

echo Checking npm...
where npm >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: npm is not found
    echo Please reinstall Node.js
    pause
    exit /b 1
)

echo npm found!
npm --version
echo.

echo Checking Power BI Visuals Tools...
where pbiviz >nul 2>&1
if %errorlevel% neq 0 (
    echo WARNING: Power BI Visuals Tools not found
    echo Installing Power BI Visuals Tools...
    npm install -g powerbi-visuals-tools
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install Power BI Visuals Tools
        echo Please run manually: npm install -g powerbi-visuals-tools
        pause
        exit /b 1
    )
)

echo Power BI Visuals Tools found!
pbiviz --version
echo.

echo Installing project dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo Building the visual...
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Build failed
    pause
    exit /b 1
)

echo.
echo ========================================
echo Build completed successfully!
echo ========================================
echo.
echo File to import into Power BI Desktop:
echo %CD%\dist\matrixVisualReplica.pbiviz
echo.
echo Steps to import:
echo 1. Open Power BI Desktop
echo 2. Go to Visualizations pane
echo 3. Click "..." at the bottom
echo 4. Select "Import a visual from a file"
echo 5. Navigate to the file above
echo.
pause
