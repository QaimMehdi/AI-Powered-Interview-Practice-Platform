# 🤖 PREPZA - AI-Powered Interview Practice Platform

A comprehensive interview preparation platform that uses AI to conduct realistic mock interviews with voice interaction, real-time feedback, and personalized coaching.

## ✨ Features

### 🎯 Core Interview Features
- **AI-Powered Mock Interviews**: Conduct realistic interviews with AI that adapts to your responses
- **Two Interview Types**: 
  - **Technical Interviews**: Focus on coding, algorithms, system design, and technical concepts
  - **HR Interviews**: Behavioral questions, situational scenarios, and soft skills assessment
- **Real-Time Feedback**: Get instant, contextual feedback after each answer
- **Scoring System**: 1-10 scoring with detailed strengths and areas for improvement
- **Interview Summary**: Comprehensive end-of-interview report with overall performance metrics

### 🎤 Voice Interaction
- **Speech-to-Text**: Speak your answers naturally - no typing required
- **Text-to-Speech**: AI speaks responses with natural voice synthesis
- **Call Mode**: Continuous voice conversation with AI interviewer
- **Real-Time Transcription**: See your speech converted to text as you speak
- **Typewriter Effect**: AI responses appear with realistic typing animation
- **Voice Controls**: Toggle between voice and text input modes

### 🎨 User Experience
- **Modern UI/UX**: Sleek, professional interface with smooth animations
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Dark Theme**: Easy on the eyes with professional color scheme
- **Real-Time Chat Interface**: Chat-style interview experience
- **Progress Tracking**: Visual indicators for interview progress
- **Session Management**: Save and resume interview sessions

### 🔐 Authentication & Security
- **Secure Authentication**: JWT-based authentication system
- **User Profiles**: Personalized user accounts with interview history
- **Session Security**: Protected interview sessions
- **Data Privacy**: Secure handling of interview responses and feedback

## 🏗️ Technology Stack

### Frontend
- **React.js**: Modern UI framework with hooks and context
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn/ui**: Beautiful, accessible UI components
- **React Router**: Client-side routing
- **Web Speech API**: Browser-based speech recognition and synthesis

### Backend
- **Spring Boot 3.1.5**: Robust Java backend framework
- **Spring Security**: Authentication and authorization
- **Spring Data JPA**: Database operations and ORM
- **MySQL**: Reliable database for data persistence
- **JWT**: Secure token-based authentication
- **Maven**: Dependency management and build tool

### AI Integration
- **Google Gemini API**: Advanced AI for question generation and feedback
- **Prompt Engineering**: Sophisticated prompts for contextual responses
- **Natural Language Processing**: Understanding and analyzing user responses
- **Adaptive Questioning**: AI that adapts questions based on user performance

## 🚀 Getting Started

### Prerequisites
- **Java 17** or higher
- **Node.js 16** or higher
- **MySQL 8.0** or higher
- **Maven 3.6** or higher
- **Google Gemini API Key** (for AI features)

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/QaimMehdi/Prepza.git
   cd Prepza
   ```

2. **Backend Setup**
   ```bash
   # Navigate to backend directory
   cd src/main/java/com/yourcompany/interviewplatform
   
   # Install Maven dependencies
   mvn clean install
   
   # Run the Spring Boot application
   mvn spring-boot:run
   ```

3. **Frontend Setup**
   ```bash
   # Navigate to frontend directory (root directory)
   cd ../../../../
   
   # Install Node.js dependencies
   npm install
   
   # Start the development server
   npm run dev
   ```

4. **Database Setup**
   - Create a MySQL database named `interview_platform`
   - The application will automatically create tables on first run

5. **Environment Variables**
   Create a `.env` file in the root directory with the following variables:
   ```
   # Database Configuration
   SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/interview_platform
   SPRING_DATASOURCE_USERNAME=your_username
   SPRING_DATASOURCE_PASSWORD=your_password
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-here
   
   # Google Gemini API
   GEMINI_API_KEY=your-gemini-api-key-here
   ```

## 🎮 How to Use

### 1. **Account Setup**
- Sign up for a new account or log in with existing credentials
- Complete your profile with basic information

### 2. **Starting an Interview**
- Choose between **Technical** or **HR** interview type
- Select your target role or position
- Click "Start Interview" to begin

### 3. **Interview Experience**
- **Text Mode**: Type your answers and press Enter to submit
- **Voice Mode**: Click the microphone button to enable speech-to-text
- **Call Mode**: Click the phone button for continuous voice conversation
- **Mixed Mode**: Switch between voice and text as needed

### 4. **AI Interaction**
- AI asks contextual questions based on your interview type
- Receive real-time feedback after each answer
- Get scoring (1-10) with specific strengths and improvements
- AI adapts questions based on your performance

### 5. **Interview Summary**
- View comprehensive performance report
- See overall score and detailed breakdown
- Review key strengths and areas for improvement
- Export results for future reference

## 🔧 Configuration

### AI Behavior Customization
The AI interviewer can be customized through prompt engineering in `AIService.java`:
- **Question Generation**: Modify prompts for different interview types
- **Feedback Style**: Adjust feedback tone and detail level
- **Scoring Criteria**: Customize scoring algorithms
- **Response Length**: Control AI response verbosity

### Voice Settings
Voice interaction can be configured in `ChatInterview.tsx`:
- **Speech Rate**: Adjust AI speaking speed
- **Recognition Language**: Change speech recognition language
- **Voice Quality**: Modify text-to-speech parameters
- **Call Duration**: Set maximum call session length

### UI Customization
The interface can be personalized through Tailwind CSS classes:
- **Color Scheme**: Modify primary colors and themes
- **Layout**: Adjust component spacing and sizing
- **Animations**: Customize transition effects
- **Responsive Breakpoints**: Modify mobile/desktop layouts

## 📊 Features in Detail

### AI Question Generation
- **Technical Questions**: Algorithms, data structures, system design, coding problems
- **HR Questions**: Behavioral scenarios, leadership, teamwork, problem-solving
- **Adaptive Difficulty**: Questions adjust based on user performance
- **Context Awareness**: AI remembers previous answers and builds on them

### Real-Time Feedback System
- **Immediate Analysis**: Feedback provided within seconds
- **Contextual Comments**: Specific to the answer given
- **Constructive Criticism**: Helpful suggestions for improvement
- **Positive Reinforcement**: Recognition of good answers

### Voice Recognition Features
- **Continuous Listening**: Microphone stays active during call mode
- **Noise Filtering**: Background noise reduction
- **Accent Support**: Works with various English accents
- **Real-Time Display**: See transcription as you speak

### Interview Analytics
- **Performance Tracking**: Monitor improvement over time
- **Score History**: View past interview scores
- **Weakness Analysis**: Identify recurring problem areas
- **Progress Visualization**: See improvement trends

## 🐛 Troubleshooting

### Common Issues

**Backend Won't Start**
- Check Java version (requires Java 17+)
- Verify MySQL is running and accessible
- Ensure all environment variables are set correctly
- Check Maven dependencies are installed

**Frontend Issues**
- Clear browser cache and cookies
- Check Node.js version compatibility
- Verify all npm packages are installed
- Check browser console for JavaScript errors

**Voice Features Not Working**
- Ensure microphone permissions are granted
- Use Chrome, Edge, or Safari for best compatibility
- Check internet connection for AI services
- Verify Web Speech API is supported in your browser

**AI Responses Not Working**
- Verify Gemini API key is valid and has sufficient quota
- Check internet connection
- Ensure API key has proper permissions
- Monitor API usage limits

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


## 📞 Support

If you encounter any issues or have questions:
- Create an issue in the GitHub repository
- Check the troubleshooting section above
- Review the code comments for implementation details

---

**Built with ❤️ for interview preparation and skill development**
