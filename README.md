# NearYou - Restaurant Discovery Platform

**Live Demo:** [https://food-near-you.vercel.app/](https://food-near-you.vercel.app/)

## Overview

NearYou is a location-based restaurant discovery application that solves a specific UX limitation in Google Maps: the inability to search for restaurants from a future destination rather than your current location. When planning ahead, users need to know what restaurants are near their destination, not where they are right now.

This project demonstrates end-to-end data architecture, from API integration and database design to data visualization and user-facing analytics.

## The Problem

**Google Maps limitation:** When you search "restaurants near me," Google shows results based on your current GPS location. But what if you're planning to meet someone across town tomorrow? You need restaurants near *that* address, not where you're sitting now.

**NearYou's solution:** Treat any user-specified address as the "current location" for search purposes, enabling destination-based restaurant discovery.

## Data Architecture & Key Features

### Database Design
- **PostgreSQL database** hosted on Neon with efficient schema design for restaurant data, user preferences, and location information
- **Prisma ORM** for type-safe database operations and automated migrations
- **Optimized indexing** on location-based queries for fast search performance
- **Data normalization** for user favorites and authentication integration

### Data Integration & Pipeline
- **Multi-source API integration**: Google Places API and Geolocation API
- **Data synchronization**: Automated sync between external API responses and local database
- **Data validation**: Comprehensive error handling and data quality checks
- **Caching strategy**: Efficient data storage to minimize redundant API calls

### Data Processing
- **Location-based calculations**: Distance computations between user-specified addresses and restaurant locations
- **Real-time data updates**: Optimistic UI updates with server-side state management
- **Data aggregation**: Restaurant information consolidated from multiple data sources
- **Query optimization**: Efficient database queries for filtering and sorting results

### Data Visualization & Analytics
- **Interactive map visualization**: Display restaurant locations relative to user-specified destination
- **Distance metrics**: Calculate and display distances from destination to each restaurant
- **User preference tracking**: Store and analyze user favorites for personalized recommendations
- **Filter and sort capabilities**: Enable users to explore data by various dimensions (distance, rating, price)

## Tech Stack

**Backend & Database:**
- PostgreSQL (Neon)
- Prisma ORM
- Next.js Server Actions
- REST API Integration

**Frontend & Visualization:**
- Next.js 14
- TypeScript
- React
- Tailwind CSS

**Authentication & Security:**
- Clerk Authentication
- Custom database schema integration

**Deployment:**
- Vercel (Production)
- Environment configuration management

## What I Learned

This project taught me the full data lifecycle:

1. **Data Modeling**: Designing efficient database schemas that balance normalization with real-world API constraints
2. **Data Integration**: Connecting multiple external data sources and handling inconsistencies
3. **Data Quality**: Implementing validation, error handling, and retry logic with exponential backoff
4. **Data Visualization**: Translating complex location data into intuitive user interfaces
5. **Performance Optimization**: Indexing strategies and query optimization for location-based searches

## Running Locally

```bash
# Clone the repository
git clone https://github.com/erick-chung/near-you.git

# Install dependencies
npm install

# Set up environment variables
# Create a .env.local file with:
# - DATABASE_URL (Neon PostgreSQL)
# - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
# - CLERK_SECRET_KEY
# - Google Places API key
# - Google Geolocation API key

# Run Prisma migrations
npx prisma migrate dev

# Start the development server
npm run dev
```

## Future Enhancements

- **Advanced analytics dashboard**: Aggregate user search patterns and popular destinations
- **Data export functionality**: Enable users to export search results for analysis
- **Historical data tracking**: Store and visualize restaurant search trends over time
- **Machine learning integration**: Recommend restaurants based on user preference patterns

## Contact

Built by Erick Chung  
[GitHub](https://github.com/erick-chung) | [LinkedIn](https://linkedin.com/in/your-profile)

---

**Note:** This project emphasizes data architecture, API integration, and database design - core competencies for data analyst and data engineering roles.
