@echo off
title Kapish Rawat - Portfolio Server
echo ========================================================
echo  Launching Kapish Rawat's Portfolio Website Locally...
echo ========================================================
python "%~dp0server.py"
if errorlevel 1 (
    echo Python not found in PATH or error occurred.
    echo Opening index.html directly in your default browser...
    start "" "%~dp0index.html"
)
pause

