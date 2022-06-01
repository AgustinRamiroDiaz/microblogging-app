# syntax = docker/dockerfile:experimental
FROM golang:1.17-buster

WORKDIR /app

COPY go.mod .
COPY go.sum .
RUN go mod download

RUN go install github.com/cosmtrek/air@latest

COPY . .
RUN --mount=type=cache,target=/root/.cache/go-build CGO_ENABLED=0 GOOS=linux go build -v -o api server.go

EXPOSE 8080
