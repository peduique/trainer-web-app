.PHONY: dev build run stop logs shell lint format utest utest-watch mtest e2e test-all

dev:
	npm run dev

build:
	npm run build

run:
	docker build -t trainer-portal . && docker run -p 3000:3000 --name trainer-portal trainer-portal

stop:
	docker stop trainer-portal && docker rm trainer-portal

logs:
	docker logs -f trainer-portal

shell:
	docker exec -it trainer-portal sh

lint:
	npm run lint

format:
	npm run format

utest:
	npm run test:coverage

utest-watch:
	npm run test:watch

mtest:
	npx stryker run

e2e:
	npm run test:e2e

test-all: utest mtest e2e
