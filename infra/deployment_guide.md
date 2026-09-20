# AWS Deployment Guide (EC2 with Docker Compose)

This guide walks you through deploying your `frontend` and `backend` on a single AWS EC2 instance. This is the simplest and most cost-effective way to get your app online quickly.

## 1. Create an AWS EC2 Instance
1. Log in to the **AWS Management Console**.
2. Go to **EC2** -> **Launch Instance**.
3. Name your instance (e.g., `Nexus-Crime-Server`).
4. Select **Ubuntu Server 22.04 LTS** as the AMI.
5. Choose an instance type (e.g., `t2.micro` for free tier, or `t3.small` if you need more RAM).
6. Create or select a **Key Pair** (download the `.pem` file).
7. Under **Network Settings**, allow:
   - **SSH traffic** from anywhere
   - **HTTP traffic** from the internet
   - **HTTPS traffic** from the internet
8. Launch the instance.

## 2. Connect to the Instance
Open your terminal and SSH into the instance using the downloaded key pair:
```bash
# Fix permissions on your key
chmod 400 your-key.pem

# Connect (replace with your instance's Public IPv4 address)
ssh -i /path/to/your-key.pem ubuntu@<your-ec2-public-ip>
```

## 3. Install Docker and Docker Compose
Run the following commands on your EC2 instance:
```bash
sudo apt update
sudo apt install docker.io docker-compose -y
sudo systemctl start docker
sudo systemctl enable docker

# Allow ubuntu user to run docker without sudo
sudo usermod -aG docker ubuntu
```
*(You may need to log out `exit` and log back in for the group change to take effect).*

## 4. Get Your Code on the Server
You can clone your repository onto the server:
```bash
git clone <your-github-repo-url>
cd Nexus-Crime
```

*Note: Since `.env` files are not pushed to GitHub (usually), you must create it on the server.*
```bash
cd backend
nano .env # Paste your env variables here, save and exit
cd ..
```

## 5. Build and Run the App
From the root of the `Nexus-Crime` project directory (where `docker-compose.yml` is located), run:

```bash
docker-compose up --build -d
```
- `--build` forces Docker to build the images based on the Dockerfiles.
- `-d` runs the containers in the background (detached mode).

## 6. Access Your App
- **Frontend**: Go to `http://<your-ec2-public-ip>` in your browser.
- **Backend API**: Accessible at `http://<your-ec2-public-ip>:8000` (or `http://<your-ec2-public-ip>/api/` if using the Nginx proxy defined in `frontend/nginx.conf`).

## How to Update the App Later
When you make changes to your code and push to GitHub:
```bash
# On your EC2 server:
cd Nexus-Crime
git pull
docker-compose up --build -d
```
