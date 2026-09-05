# PortfolioCMS

A full-stack portfolio CMS built with **.NET 10** and **Angular 22**. The public site showcases projects, skills, education, and academic publications, while a JWT-protected admin panel allows full content management (CRUD) without touching the database directly.

---

## Features

- **Public portfolio site** — Projects, Skills, Education, and Academic Papers sections, fully data-driven from the backend
- **JWT authentication** — secure admin login with role claims, token-based API access
- **Admin panel** — create, edit, and delete content through a UI, no manual database work needed
- **Route guarding** — Angular `CanActivate` guard blocks unauthorized access to admin routes
- **Automatic token injection** — HTTP interceptor attaches the JWT to every authenticated request
- **Zoneless change detection** — Angular 22's newer, faster rendering model, no `zone.js` overhead
- **Responsive design** — Tailwind CSS, mobile-first layout
- **CV download** — one-click resume download served as a static file

## Tech Stack

**Backend**
- .NET 10 / ASP.NET Core Web API
- Entity Framework Core (Code First, migrations)
- SQL Server (Dockerized for local development)
- JWT Bearer Authentication
- Mapperly (compile-time object mapping)
- Layered architecture (Core / Data / Service / API)

**Frontend**
- Angular 22 (standalone components, zoneless)
- Tailwind CSS
- RxJS

## Architecture

```
PortfolioCMS.API      → Controllers, JWT config, CORS, exception handling
PortfolioCMS.Core     → Entities, DTOs, repository/service interfaces
PortfolioCMS.Data     → DbContext, EF Core migrations, repository implementations
PortfolioCMS.Service  → Business logic, Mapperly mappers
PortfolioCMS.UI       → Angular 22 frontend (public site + admin panel)
```

The backend follows a generic repository/service pattern (`IGenericRepository<T>`, `IService<T>`), so each new entity (Project, Skill, Education, Academic Paper) plugs into the same CRUD pipeline with minimal boilerplate.

## Getting Started

### Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [Node.js](https://nodejs.org/) (v18+) and npm
- SQL Server (local instance or Docker container)

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/oemzzz/PortfolioCMS.git
cd PortfolioCMS

# Configure your database connection
# Set the DefaultConnection string via User Secrets:
cd PortfolioCMS.API
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Server=localhost,1433;Database=PortfolioCMSDb;User Id=sa;Password=YourPassword;TrustServerCertificate=True;"

# Apply migrations
cd ..
dotnet ef database update --project PortfolioCMS.Data --startup-project PortfolioCMS.API

# Run the API
cd PortfolioCMS.API
dotnet run
```

The API will be available at `https://localhost:5258` (check `launchSettings.json` for the exact port).

### Frontend Setup

```bash
cd PortfolioCMS.UI
npm install
ng serve
```

The site will be available at `http://localhost:4200`.

### Creating the First Admin User

Before logging in, create the initial admin account via the `/api/Auth/setup` endpoint (Development environment only):

```bash
POST /api/Auth/setup
{
  "username": "your-username",
  "password": "your-password"
}
```

## Project Structure

```
├── PortfolioCMS.API/          # Web API layer
├── PortfolioCMS.Core/         # Entities, DTOs, interfaces
├── PortfolioCMS.Data/         # EF Core, migrations, repositories
├── PortfolioCMS.Service/      # Business logic, mappers
├── PortfolioCMS.UI/           # Angular frontend
└── PortfolioCMS.slnx          # Solution file
```

## Security Notes

- Passwords are hashed before storage, never sent or stored in plain text
- JWT tokens include a 2-hour expiration and role-based claims
- CORS origins are configured via `appsettings.json`, not hardcoded
- The `/setup` endpoint is restricted to the Development environment and only runs once (blocked if an admin already exists)

## Roadmap

- Automated tests (backend + frontend)
- CI/CD pipeline (GitHub Actions)
- Azure deployment (App Service + Static Web Apps + Azure SQL)

## Author

**Atakan Özçelebi**
Computer Engineer 

- GitHub: [@oemzzz](https://github.com/oemzzz)
- LinkedIn: [linkedin.com/in/atakan-ozcelebi](https://linkedin.com/in/atakan-ozcelebi)

## License

This project is open source and available for reference. Feel free to explore the code.
