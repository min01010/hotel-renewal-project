# server/Dockerfile

FROM node:18

# 앱 실행 디렉토리 설정
WORKDIR /app

# 종속성 설치
COPY package*.json ./
RUN npm install

# 앱 코드 복사
COPY . .

# 앱 실행 포트
EXPOSE 3000

# 실행 명령어
CMD ["node", "index.js"]
