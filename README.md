# The Great Forum

A comprehensive social media platform with advanced features and user engagement capabilities.

## Key Features

### User Authentication & Profiles
- Complete registration system with:
  - Individual/organisation selection
  - Gender selection (male/female) for individuals
  - Profile customization with:
    - Name
    - Bio
    - Phone number
    - Profile picture
    - Profile background
    - Email address
    - Password
- Verification badge system (£5.00) with:
  - Custom badge selection
  - Temporary badge loss on name change
  - No cost for re-verification after name change

### Document Management
- Advanced document versioning
- Real-time change tracking
- Accessibility checker
- Automatic accessibility fixes
- Document templates
- Rich text formatting
- Table of contents generation
- Markdown support

### AI-Powered Features
- AI content suggestions
- Document analysis
- Content enhancement
- Pattern recognition
- Quantum consciousness features

### Collaboration Features
- Real-time document editing
- Chat integration
- User presence indicators
- Version control
- Comment system

### Analytics & Monitoring
- Document analytics
- User activity tracking
- Performance monitoring
- Error logging
- Usage statistics

## Tech Stack

- Frontend: React, TypeScript, Vite, Tailwind CSS
- Backend: Node.js, Express, TypeScript
- Database: PostgreSQL
- Authentication: JWT
- State Management: React Query
- VoIP: WebRTC
- Internationalization: i18next

## Project Structure

```
TheGreatForum/
├── frontend/          # React frontend application
├── backend/           # Node.js backend server
├── shared/            # Shared types and utilities
├── server/            # Express server configuration
├── __tests__/         # Test files
└── Project/           # Project documentation and assets
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   - Create a `.env` file in the root directory
   - Add your PostgreSQL connection string
   - Add your JWT secret
   - Configure VoIP settings
   - Set up verification badge payment system
4. Start the development server:
   ```bash
   npm run dev
   ```

## Development Guidelines

### Frontend
- Use TypeScript for all components
- Follow React best practices
- Implement proper error handling
- Use React Query for API calls
- Implement responsive design
- Use Tailwind CSS for styling

### Backend
- Use TypeScript for all routes and middleware
- Implement proper error handling
- Use PostgreSQL for data storage
- Implement proper security measures
- Use JWT for authentication

### Testing
- Write unit tests for all components
- Write integration tests for API endpoints
- Test VoIP functionality
- Test internationalization
- Test content editing and history

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Documentation

### API Documentation
- Authentication endpoints
- User management endpoints
- Content management endpoints
- VoIP endpoints
- Community endpoints

### Component Documentation
- UI components
- VoIP components
- Content editing components
- Community components

### Testing Documentation
- Unit tests
- Integration tests
- End-to-end tests

## Support

For support, please:
1. Check the documentation
2. Search existing issues
3. Create a new issue if needed

## Roadmap

- Mobile app development
- Additional language support
- Enhanced content moderation
- Improved performance optimization
- Additional community features
