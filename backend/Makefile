all_linux: install_docker_linux start

all_mac: install_docker_mac start

install_docker_linux:
	@which docker > /dev/null 2>&1 || (echo "Installing Docker..." && sudo apt update && sudo apt install -y docker.io docker-compose)

install_docker_mac:
	@which docker > /dev/null 2>&1 || (echo "Installing Docker..." && brew install --cask docker)
	@which docker-compose > /dev/null 2>&1 || (echo "Installing Docker Compose..." && brew install docker-compose)

start:
	@npm install
	@sudo docker compose up -d
