@echo off
set GITHUB_TOKEN=
git add .
git commit -m "Adiciona testes de unidade automatizados (test.html e portal.test.js com Jest)"
git push origin main
