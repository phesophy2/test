# KhmerGhost OMEGA API Documentation

## Base URL
https://api.omega.khmerghost.com

## Authentication
All API requests require a Bearer token:
Authorization: Bearer <your_token>

## Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /auth/register | Register new user |
| POST | /auth/login | Login user |
| POST | /auth/refresh | Refresh token |
| POST | /auth/logout | Logout user |

### Social Media
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /social/accounts | Get all accounts |
| POST | /social/accounts | Add account |
| PUT | /social/accounts/:id | Update account |
| DELETE | /social/accounts/:id | Delete account |
| POST | /social/farming/start | Start farming |
| POST | /social/farming/stop | Stop farming |
| POST | /social/posts | Create post |
| GET | /social/posts | Get posts |

### Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /analytics/dashboard | Get dashboard stats |
| GET | /analytics/posts | Get post analytics |
| GET | /analytics/top-posts | Get top posts |
| GET | /analytics/export | Export report |

### Payment
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /payment/stripe/create | Create Stripe payment |
| POST | /payment/wing/create | Create Wing payment |
| POST | /payment/aba/create | Create ABA payment |
| POST | /payment/crypto/create | Create crypto payment |

### Marketplace
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /marketplace/products | Get products |
| POST | /marketplace/orders | Create order |
| GET | /marketplace/orders | Get user orders |

### AI
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /ai/caption | Generate caption |
| POST | /ai/hashtags | Generate hashtags |
| POST | /ai/image | Generate image |
| POST | /ai/video | Generate video |
| POST | /ai/voice | Generate voice |

## Rate Limits
- Free tier: 100 requests/hour
- Pro tier: 1000 requests/hour
- Enterprise: 10000 requests/hour

## Error Codes
| Code | Description |
|------|-------------|
| 200 | Success |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 429 | Too Many Requests |
| 500 | Internal Server Error |
