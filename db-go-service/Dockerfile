# -----------------------
# Stage 1: Build the binary
# -----------------------
FROM golang:1.24-alpine AS builder

WORKDIR /app

# Install git (needed for dependencies)
RUN apk add --no-cache git

# Copy go.mod and go.sum first to cache dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy all source files
COPY . .

# Build the Go binary
RUN go build -o main .

# -----------------------
# Stage 2: Minimal runtime image
# -----------------------
FROM alpine:latest

WORKDIR /root/

# Copy binary from builder
COPY --from=builder /app/main .

# Run the binary
CMD ["./main"]