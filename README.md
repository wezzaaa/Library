# Storya - Library Management Application

## Project Description
Storya aims to provide a personalized and intuitive reading experience,
similar to modern streaming platforms, but for books.

Storya is a modern web-based library management application built with Angular. It provides users with a comprehensive platform to discover, search, and manage books from the Open Library database. The application features a clean, intuitive interface with functionalities including book search, author information, favorites management, reading lists, and user profiles.

### Key Features:
- Search and explore books from the Open Library database
- View detailed author profiles and their works
- Save and manage favorite books
- Create and maintain personal reading lists
- Personalized user experience with profile management
- Optimized for desktop and mobile devices
- Smart recommendations based on user behavior
- Search history tracking
- Dynamic filtering and sorting

## How to Use It

1. **Browse Books**: The home page displays featured books and popular titles
2. **Search**: Use the search functionality to find books by title, author, or subject
3. **View Details**: Click on any book to see detailed information including description, subjects, and author details
4. **Manage Favorites**: Add books to your favorites list for quick access
5. **Reading Lists**: Create and organize books into custom reading lists
6. **Author Profiles**: Explore author biographies and their complete works

## How to Install It

### Prerequisites
- Node.js (version 18 or higher)
- npm (version 10.9.4 or higher)

### Installation Steps

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd Library
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```
   The application will be available at `http://localhost:4200/`

### Available Scripts

- `npm start` - Starts the development server
- `npm run build` - Builds the application for production
- `npm run watch` - Builds the application in watch mode for development
- `npm test` - Runs unit tests

### API Integration

This application uses the **Open Library API** as its backend service:
- **Base URL**: `https://openlibrary.org`
- **Authentication**: No authentication required (public API)
- **Data Source**: Real-time data from Open Library's vast database

No mock server setup is required as the application directly integrates with the Open Library's public API endpoints for book and author data.

## Project Structure

```
src/
├── app/
│   ├── components/          # Reusable UI components
│   │   ├── book-card/      # Book display card
│   │   ├── header/         # Application header
│   │   └── footer/         # Application footer
│   ├── pages/              # Main application pages
│   │   ├── home/           # Home page
│   │   ├── search-page/    # Book search interface
│   │   ├── book-detail/    # Individual book details
│   │   ├── author-detail/  # Author information
│   │   ├── favorites/      # User favorites
│   │   ├── reading-list/   # Reading list management
│   │   ├── profile/        # User profile
│   │   ├── about/          # About page
│   │   └── not-found/      # 404 error page
│   └── services/           # Business logic services
│       ├── book.service.ts # Book and author data service
│       └── storage.service.ts # Local storage management
```

## Technologies Used

- **Angular** - Frontend framework
- **TypeScript** - Type-safe JavaScript
- **RxJS** - Reactive programming for asynchronous operations
- **Angular Router** - Client-side routing
- **Open Library API** - External data source
- **HTML5 & CSS3** - Markup and styling


**Note**: This application uses the Open Library's free public API. No additional setup or API keys are required for basic functionality.

### Project members
BEN NEJMA Tayssir
BETTAIEB Sahar