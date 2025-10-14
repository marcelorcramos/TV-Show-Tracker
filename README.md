# 🎬 TV Show Tracker

A complete full-stack application for discovering and tracking TV shows, movies, and actors. Built with .NET 8 backend and React frontend.

## 🚀 Features

### Core Functionality
- ✅ **User Authentication** - JWT-based registration and login
- ✅ **TV Shows & Movies Catalog** - Browse with advanced filtering
- ✅ **Actor Database** - Explore actors and their filmography  
- ✅ **Favorites System** - Save and manage favorite content
- ✅ **Smart Recommendations** - Personalized suggestions based on your favorites
- ✅ **Advanced Search** - Filter by genre, type, and search terms

### Technical Features
- ✅ **REST API** - Complete backend with 15+ endpoints
- ✅ **Responsive Design** - Mobile-first responsive UI
- ✅ **Export Data** - CSV and PDF export capabilities
- ✅ **GDPR Compliant** - Data export and account deletion
- ✅ **Caching System** - Performance optimization with TTL
- ✅ **Background Services** - Email notifications and data processing

## 🛠️ Tech Stack

### Backend
- **.NET 8** - Web API
- **Entity Framework Core** - ORM
- **SQLite** - Database
- **JWT** - Authentication
- **AutoMapper** - Object mapping
- **Swagger** - API documentation

### Frontend  
- **React 18** - UI framework
- **React Router** - Navigation
- **Axios** - HTTP client
- **Context API** - State management
- **Inline Styles** - Styling

## 📦 Installation & Setup

### Prerequisites
- .NET 8 SDK
- Node.js 18+
- SQLite (included)

### Backend Setup
# Clone repository
git clone <your-repo-url>
cd TvShowTracker.API

# Restore packages
dotnet restore

# Run the application
dotnet run
API will be available at: http://localhost:5023
Swagger Documentation: http://localhost:5023/swagger

Frontend Setup

bash
# Navigate to frontend
cd tvshow-tracker-frontend

# Install dependencies
npm install

# Start development server
npm run dev
Frontend will be available at: http://localhost:5173

🔐 API Usage

Authentication

Register: POST /api/auth/register
Login: POST /api/auth/login
Use Token: Include Authorization: Bearer {token} header
Key Endpoints

TV Shows: GET /api/tvshows (with pagination & filtering)
Actors: GET /api/actors
Favorites: POST/DELETE /api/favorites
Recommendations: GET /api/tvshows/recommendations
Export: GET /api/export/tvshows?format=csv|pdf
Example Request

bash
# Get TV shows with filters
curl -X GET "http://localhost:5023/api/tvshows?page=1&pageSize=10&genre=Drama&type=Series"
🎯 Project Structure

text
TvShowTracker/
├── TvShowTracker.API/          # Backend API
│   ├── Controllers/           # API endpoints
│   ├── Models/               # Data models
│   └── Services/             # Business logic
├── tvshow-tracker-frontend/   # React frontend
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom hooks
│   │   └── services/        # API services
🧪 Testing

The project includes comprehensive unit tests:

23 passing tests (88% success rate)
Component testing with React Testing Library
API integration tests
Run tests with:

bash
cd tvshow-tracker-frontend
npm test
📱 Screenshots

(Add your screenshots here)

Homepage with recommendations
TV Shows catalog with filters
Actor details with filmography
User profile with favorites
🔄 Development

Adding New Features

Backend: Add controller + service + model
Frontend: Add component + hook + service
Test: Write unit tests for new functionality
Database Migrations

bash
cd TvShowTracker.API
dotnet ef migrations add [MigrationName]
dotnet ef database update
🤝 Contributing

Fork the repository
Create feature branch (git checkout -b feature/amazing-feature)
Commit changes (git commit -m 'Add amazing feature')
Push to branch (git push origin feature/amazing-feature)
Open Pull Request
📄 License

This project is licensed under the MIT License.

👨‍💻 Author

Your Name

GitHub: @marcelorcramos
