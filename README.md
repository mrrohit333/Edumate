# EduMate

A modern e-learning platform featuring an interactive 3D instructor, document management, and comprehensive learning progress tracking.

## Features

### Authentication
- Secure user authentication with NextAuth.js
- Protected routes and session management
- User registration and login functionality

### Dashboard
- Clean and responsive layout with sidebar navigation
- Mobile-friendly design with collapsible menu
- Quick access to all main features

### Profile Management
- Comprehensive user profile with editable fields:
- Personal information (name, email, gender)
- Profile picture upload
- Real-time form validation
- Secure image upload functionality

### Document Management
- PDF document upload and processing
- Document summarization with AI
- Audio generation from text
- Document organization and management

### Learning Progress
- Visual progress tracking with charts:
  - Overall completion rates
  - Weekly progress visualization
  - Subject-wise progress tracking
- Interactive data visualization using Recharts
- Detailed statistics and metrics

### 3D Instructor
- Interactive 3D instructor model
- Voice interaction capabilities
- Real-time responses and feedback
- Customizable learning experience

### Lessons
- Structured lesson organization
- Different lesson categories
- Progress tracking per lesson
- Interactive learning materials

## Tech Stack

- **Frontend:**
  - Next.js 13 with App Router
  - React with TypeScript
  - Tailwind CSS for styling
  - shadcn/ui for UI components
  - Recharts for data visualization

- **Backend:**
  - MongoDB for database
  - Mongoose for data modeling
  - NextAuth.js for authentication
  - API Routes for server functionality

- **Storage:**
  - Supabase for file storage
  - Efficient image and document management

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/edumate-3d-instructor.git
   cd edumate-3d-instructor
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file with the following:
   ```
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key
   MONGODB_URI=your-mongodb-uri
  
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
edumate-3d-instructor/
├── app/
│   ├── api/            # API routes
│   ├── dashboard/      # Dashboard pages
│   ├── auth/          # Authentication pages
│   └── ...
├── components/        # Reusable components
├── lib/              # Utility functions and configs
├── public/           # Static assets
└── styles/          # Global styles
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@edumate.com or join our Slack channel.

## Acknowledgments

- Thanks to all contributors
- Shadcn UI for the beautiful components
- Three.js community for 3D rendering support 
