# Frontend command menu.
#
# Run from:
#   C:\Users\saiyu\Desktop\projects\KI_projects\Skin_Lesion_GRADCAM_Classification\Skin_Lesion_Classification_frontend

.PHONY: help install dev build start lint typecheck clean

ifeq ($(OS),Windows_NT)
NPM := npm.cmd
else
NPM := npm
endif

help:
	@echo "Frontend commands"
	@echo "  make install   - Install Node dependencies"
	@echo "  make dev       - Start Next.js dev server on :3000"
	@echo "  make build     - Build the Next.js app"
	@echo "  make start     - Start the built Next.js app"
	@echo "  make lint      - Run Next.js lint"
	@echo "  make typecheck - Run TypeScript checks"
	@echo "  make clean     - Remove local Next.js build output"

install:
	$(NPM) install

dev:
	$(NPM) run dev

build:
	$(NPM) run build

start:
	$(NPM) run start

lint:
	$(NPM) run lint

typecheck:
	$(NPM) run type-check

clean:
	powershell -NoProfile -Command "Remove-Item -Recurse -Force .next,out,dist -ErrorAction SilentlyContinue"
