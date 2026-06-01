@echo off
set PATH=C:\nvm4w\nodejs;%PATH%
cd /d "C:\Claude Code\littlebites"
echo Node version:
node --version
echo Starting Expo...
npx expo start --clear
