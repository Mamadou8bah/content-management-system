# Content Management System (CMS)
**A robust, scalable full-stack CMS with secure permission-based RBAC**
---

## Project Purpose

This project is a full-stack Content Management System (CMS) engineered for organizations demanding strict, auditable control over content and user actions. It implements true permission-based Role-Based Access Control (RBAC) within the backend—ensuring all operations are explicitly authorized, never trusted to the frontend. The system is designed for scalability, security, and flexibility.

---

## API & Route Reference

### Frontend (Angular) Routes

| Path                | Component/Page         | Description                       |
|---------------------|-----------------------|-----------------------------------|
| `/`                 | Redirect              | Redirects to `/articles`          |
| `/login`            | LoginPage             | User login                        |
| `/articles`         | ArticlesPage          | List all articles                 |
| `/articles/:id`     | ArticleDetails        | View article details              |
| `/articles-library` | ArticlesLibrary       | Article library (CRUD)            |
| `/users`            | UsersPage             | Manage users (admin/manager only) |
| `/roles`            | RolesPage             | Manage roles & permissions        |

---

### Backend (Express API) Endpoints

#### Auth Routes (`/auth`)
| Method | Path             | Description                | Auth Required |
|--------|------------------|----------------------------|---------------|
| POST   | `/register`      | Register new user          | No            |
| POST   | `/login`         | Login                      | No            |
| POST   | `/logout`        | Logout                     | No            |
| POST   | `/refresh`       | Refresh access token       | No            |
| POST   | `/revoke-token`  | Revoke refresh token       | Yes           |
| GET    | `/me`            | Get current user profile   | Yes           |

#### User Routes (`/users`)
| Method | Path         | Description                | Auth Required | Permission         |
|--------|--------------|----------------------------|---------------|--------------------|
| GET    | `/`          | List all users             | Yes           | `view_users`       |
| GET    | `/:id`       | Get user by ID             | Yes           | `view_users`       |
| PUT    | `/:id`       | Change user role           | Yes           | `change_user_role` |




#### Role Routes (`/roles`)
| Method | Path                | Description                  | Auth Required | Permission           |
|--------|---------------------|------------------------------|---------------|----------------------|
| POST   | `/`                 | Create new role              | No            | -                    |
| GET    | `/`                 | List all roles               | No            | -                    |
| GET    | `/:id`              | Get role by ID               | No            | -                    |
| PUT    | `/:id`              | Update role                  | No            | -                    |
| DELETE | `/:id`              | Delete role                  | No            | -                    |
| PUT    | `/:id/permissions`  | Set role permissions         | No            | -                    |

#### Permission Routes (`/permissions`)
| Method | Path         | Description                | Auth Required |
|--------|--------------|----------------------------|---------------|
| GET    | `/`          | List all permissions       | No            |

#### Article Routes (`/articles`)
| Method | Path                | Description                        | Auth Required | Permission           |
|--------|---------------------|------------------------------------|---------------|----------------------|
| POST   | `/`                 | Create article                     | Yes           | `create_article`     |
| GET    | `/:id`              | Get article by ID                  | Yes           | `view_article`       |
| GET    | `/`                 | List all articles                  | Yes           | `view_article`       |
| PUT    | `/:id`              | Update article                     | Yes           | `edit_article`       |
| DELETE | `/:id`              | Soft delete article                | Yes           | `delete_article`     |
| PUT    | `/:id/restore`      | Restore soft-deleted article       | Yes           | `restore_article`    |
| PUT    | `/:id/publish`      | Publish article                    | Yes           | `publish_article`    |

---
## Core Features
##  Core Features

### Authentication & Security

<p align="center">
    <img src="client/public/logo.png" width="120" alt="Project Logo"/>
</p>



---
<!-- YOLO test -->


<table>
        <td align="center"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg" width="40" height="40" alt="Angular"/><br>Angular</td>
        <td align="center"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" width="40" height="40" alt="TypeScript"/><br>TypeScript</td>
        <td align="center"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" width="40" height="40" alt="Node.js"/><br>Node.js</td>
        <td align="center"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" width="40" height="40" alt="Express"/><br>Express</td>
        <td align="center"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" width="40" height="40" alt="MongoDB"/><br>MongoDB</td>
        <td align="center"><img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white" width="40" height="40" alt="Tailwind CSS"/><br>Tailwind CSS</td>
        <td align="center"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg" width="40" height="40" alt="Vercel"/><br>Vercel</td>
        <td align="center"><img src="https://img.shields.io/badge/Cloudinary-3448C5?logo=cloudinary&logoColor=white" width="90" alt="Cloudinary"/><br>Cloudinary</td>
    </tr>
</table>

---

## System Architecture
```mermaid
flowchart TD
    subgraph Frontend [Angular UI]
        A1[Login Page]
        A3[Articles Page]
        A4[Article Details Page]
        A5[Articles Library Page]
        A6[Users Page]
        A7[Roles & Permissions Page]
    end
    subgraph Backend [Node.js + Express]
        B1[Auth Module]
        B2[User Module]
        B3[Article Module]
        B4[Roles & Permissions Module]
        B5[RBAC Middleware]
        B6[Cloudinary Service]
    end
    subgraph Database [MongoDB]
        C1[Users]
        C2[Articles]
        C3[Roles]
        C4[Permissions]
    end
    A1-->|Login|B1
    A3-->|Fetch Articles|B3
    A4-->|Fetch Details|B3
    A5-->|CRUD|B3
    A6-->|Users|B2
    A7-->|Roles/Perms|B4
    B1-->|JWT/Auth|B5
    B2-->|RBAC|B5
    B3-->|RBAC|B5
    B4-->|RBAC|B5
    B1-->|User Data|C1
    B2-->|User Data|C1
    B3-->|Article Data|C2
    B4-->|Role Data|C3
    B4-->|Perm Data|C4
    B3-->|Image Upload|B6
    B1-->|Profile Img|B6
    B6-->|Store Img|Cloudinary[(Cloudinary)]
```

---

## Key Features

###  Authentication & Security
- **JWT Authentication** (access/refresh tokens)
- **Strong password requirements**
- **Session management** and token refresh
- **Secure password hashing** (bcrypt)
- **CORS** and HTTP security headers

###  Permission-Based RBAC
- **Backend-enforced permissions** 
- **Fine-grained permissions** (e.g., `article:publish`, `user:manage`)
- **Dynamic, seedable roles**
- **Role assignment + protected system roles** (SuperAdmin, Manager, Contributor, Viewer)
- **Permission middleware** for all protected routes

###  Article Lifecycle Management
- **Draft, edit, delete, publish, and view articles** (permission-mapped)
- **Image upload with Cloudinary**

###  User & Role Management
- **User CRUD** (create, edit, delete, update)
- **Role assignment** with visual feedback
- **User status (active/suspended)**
- **System roles protected**


###  Secure, Scalable Authorization
- **MongoDB-persisted permissions & roles**
- **Authorization enforced via middleware**
- **Comprehensive error handling**

###  Modern RESTful API
- **Consistent, versioned endpoints**
- **RESTful best practices**
- **Standardized responses**

###  Modern, Role-Aware Frontend
- **Angular + Tailwind CSS UI**
- **Protected routes & access guards**

- **Responsive, mobile-first**
- **Theme/dark mode** *(planned)*
- **Toasts & notifications**



---

## Technology Overview

| Layer    | Main Tools    | Highlights |
|----------|---------------|------------|
| Backend  | ![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white) <br> ![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white) <br> ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white) <br> ![Mongoose](https://img.shields.io/badge/Mongoose-880000?logo=mongoose&logoColor=white) | JWT, Permissions Middleware |
| Frontend | ![Angular](https://img.shields.io/badge/Angular-DD0031?logo=angular&logoColor=white) <br> ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white) <br> ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white) | Route Guards, Animations |
| Auth     | ![JWT](https://img.shields.io/badge/JWT-000000?logo=jsonwebtokens&logoColor=white) <br> ![bcrypt](https://img.shields.io/badge/bcrypt-00599C?logo=security&logoColor=white) | Secure tokens & sessions |
| DevOps   | ![GitHub](https://img.shields.io/badge/GitHub-181717?logo=github&logoColor=white) <br> ![Git](https://img.shields.io/badge/Git-F05032?logo=git&logoColor=white) <br> ![VSCode](https://img.shields.io/badge/VS_Code-007ACC?logo=visual-studio-code&logoColor=white) | GitHub Actions (planned) |
| Cloud    | ![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?logo=cloudinary&logoColor=white) | Image upload |

---

##  Project Structure

```
Content-Management-System/
├── client/         # Angular frontend
│   ├── src/
│   └── ...
├── server/         # Node.js backend
│   ├── config/
│   ├── controller/
│   ├── middleware/
│   ├── model/
│   ├── route/
│   ├── service/
│   ├── utils/
│   └── ...
├── docs/           # Documentation and assets
├── README.md
└── ...
```

---

##  Getting Started

### 1.  Clone the repository

```bash
git clone https://github.com/Mamadou8bah/content-management-system.git
cd content-management-system
```

---

### 2. 🔧 Backend Setup

```bash
cd server
npm install
node index.js
```
<sub><sup>Defaults to http://localhost:3000 </sup></sub>

---

### 3. 💻 Frontend Setup

```bash
cd client
npm install
ng serve
```
<sub><sup>Frontend available at http://localhost:4200 </sup></sub>

---

### 4. 🗝️ Environment Variables

Add a `.env` file in `server/`:

```env
MONGO_URI=mongodb://localhost:27017/cms-example
JWT_SECRET=a-very-strong-secret
PORT=3000
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

---

### 5. 🌐 Access the Application

- Frontend: [http://localhost:4200](http://localhost:4200)

---

## Live Visual Demo





---

## 🌉 Example Role Permissions

| **Role**      | Can View  | Edit  | Delete | Publish | Manage Users | Manage Roles | 
|---------------|-----------|-------|--------|---------|--------------|--------------|
| SuperAdmin    | Yes       | Yes   | Yes    | Yes     | Yes          | Yes          |
| Manager       | Yes       | Yes   | Yes    | Yes     | Yes (limited)| No           |
| Contributor   | Yes       | Yes   | Yes    | No      | No           | No           |
| Viewer        | Yes       | No    | No     | No      | No           | No           |

*All UI sections and API endpoints are protected by backend-enforced permissions.*

---

## Screenshots

Below are screenshots of key pages and features of the CMS:

### Login Page
![Login Page](./docs/assets/login-page.png)

### Dashboards by Role
- **SuperAdmin**
  
    ![SuperAdmin Dashboard](./docs/assets/dashboard-superadmin.png)
- **Contributor**
  
    ![Contributor Dashboard](./docs/assets/dashboard-contributor.png)
- **Viewer**
  
    ![Viewer Dashboard](./docs/assets/dashboard-viewer.png)

### Articles Library
![Articles Library](./docs/assets/articles-library.png)

### Users Page
![Users Page](./docs/assets/users-page.png)

### Roles & Permissions
![Roles & Permissions](./docs/assets/roles-permissions.png)

---

## Advanced Notes

- **Backend-Only Security:** RBAC and permissions logic enforced in Express middleware; frontend cannot elevate privileges.
- **Seeded Roles & Permissions:** First-time startup seeds standard roles and permissions with protections.
- **Frontend Guards:** Improve UX, but **all real authorization** is backend-only.
- **Easy Extension:** Add permissions or roles in seconds—built for scale.
- **Auditability:** Expansion planned for full audit logs.
- **Cloudinary Integration:** Secure, scalable image uploads.
- **Planned:** Multi-language, accessibility, more.

---

## Contributing

1. Fork the repo and create your branch:  
   `git checkout -b feature/your-feature`
2. Commit your changes:  
   `git commit -am 'Add some feature'`
3. Push to your fork:  
   `git push origin feature/your-feature`
4. Submit a pull request

See [CONTRIBUTING.md](./CONTRIBUTING.md) (coming soon) for guidelines.

---

## FAQ

**Q:** Does frontend route-guarding mean it's secure if I hide links?  
**A:** No! Security is enforced only by backend permissions.

**Q:** Can I add more roles (“Editor”, “Moderator”, etc)?  
**A:** Yes—add the role and assign permissions via seeding or DB. The UI adapts.

**Q:** How are roles and permissions managed?  
**A:** They are MongoDB collections, referenced on users and enforced via middleware.

**Q:** Is this CMS production-ready?  
**A:** Yes—but review/adjust all security, env, deployment settings for your needs.


---

## Maintainer

**Mamadou Bah**  
*fullstack developer*  
[![GitHub](https://img.shields.io/badge/GitHub-181717.svg?logo=github&logoColor=white)](https://github.com/Mamadou8bah)

---


## License

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

---

> Designed for teams who value auditable, robust, and modern content platforms—where “who can do what” is always crystal clear.