@echo off
set GITHUB_TOKEN=
git add .
git commit -m "Desabilita rotacao lateral (rotateY) nos efeitos 3D tilt ao passar o mouse"
git push origin main
