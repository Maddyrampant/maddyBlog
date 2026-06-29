# Database

## Schema Overview

```
User (1) ────< Post (N) ────< Comment (N)
                │
                ├── (N) Category (1)
                │
                └── (N) PostTag (N) ──── Tag (1)
```

## Models

### User

| Field        | Type      | Notes         |
| ------------ | --------- | ------------- |
| id           | UUID      | Primary key   |
| email        | String    | Unique        |
| username     | String    | Unique        |
| passwordHash | String    | bcrypt hashed |
| role         | Role enum | USER or ADMIN |

### Post

| Field      | Type       | Notes                |
| ---------- | ---------- | -------------------- |
| id         | UUID       | Primary key          |
| title      | String     |                      |
| slug       | String     | Unique, URL-friendly |
| content    | String     | HTML content         |
| excerpt    | String?    | Short description    |
| coverImage | String?    | URL to image         |
| status     | PostStatus | DRAFT or PUBLISHED   |
| authorId   | String     | FK → User            |
| categoryId | String?    | FK → Category        |

### Comment

| Field    | Type    | Notes                           |
| -------- | ------- | ------------------------------- |
| id       | UUID    | Primary key                     |
| content  | String  |                                 |
| postId   | String  | FK → Post                       |
| authorId | String  | FK → User                       |
| parentId | String? | Self-referencing FK for replies |

### Category

| Field | Type   | Notes       |
| ----- | ------ | ----------- |
| id    | UUID   | Primary key |
| name  | String |             |
| slug  | String | Unique      |

### Tag

| Field | Type   | Notes       |
| ----- | ------ | ----------- |
| id    | UUID   | Primary key |
| name  | String |             |
| slug  | String | Unique      |

### PostTag (Join Table)

| Field  | Type   | Notes     |
| ------ | ------ | --------- |
| postId | String | FK → Post |
| tagId  | String | FK → Tag  |

## Enums

- **Role**: `USER`, `ADMIN`
- **PostStatus**: `DRAFT`, `PUBLISHED`

## Indexes

- Post: `authorId`, `categoryId`, `slug`
- Comment: `postId`
- Category: `slug`
- Tag: `slug`

## Migrations

```bash
# Create a new migration after schema changes
npx prisma migrate dev --name describe-change

# Apply migrations in production
npx prisma migrate deploy

# Reset database (dev only)
npm run db:reset
```

## Seeding

```bash
npm run seed
```

Creates: 3 users, 4 categories, 6 tags, 5 posts, 4 comments.
