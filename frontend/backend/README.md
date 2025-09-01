# Resume Parser Backend

## Overview
A Node.js backend service that parses PDF and Word resume documents, extracting structured data for portfolio generation.

## Features
- **File Support**: PDF and DOCX documents (up to 10MB)
- **Data Extraction**: Personal info, experience, education, skills, projects, certifications
- **RESTful API**: Simple endpoints for file upload and parsing
- **Error Handling**: Comprehensive error responses and validation

## Installation
```bash
npm install
```

## Usage
```bash
# Start the server
npm start

# Development mode
npm run dev
```

## API Endpoints

### Health Check
```
GET /api/health
```
Returns server status.

### Parse Resume
```
POST /api/parse-resume
Content-Type: multipart/form-data
Body: resume (file)
```

**Response:**
```json
{
  "success": true,
  "data": {
    "fileName": "resume.pdf",
    "fileSize": 245760,
    "parsedData": {
      "personalInfo": {
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+1 (555) 123-4567",
        "location": "San Francisco, CA",
        "linkedin": "linkedin.com/in/johndoe",
        "github": "github.com/johndoe"
      },
      "summary": "Experienced software developer...",
      "experience": [...],
      "education": [...],
      "skills": {
        "technical": ["JavaScript", "React", "Node.js"],
        "soft": ["Leadership", "Problem Solving"]
      },
      "projects": [...],
      "certifications": [...]
    }
  }
}
```

### Map to Template
```
POST /api/map-to-template
Content-Type: application/json
Body: { "parsedData": {...}, "templateId": 1 }
```

Maps parsed resume data to portfolio template format.

## Parser Features

### Text Extraction
- **PDF**: Uses `pdf-parse` library
- **DOCX**: Uses `mammoth` library

### Data Detection
- **Personal Info**: Regex patterns for email, phone, LinkedIn, GitHub
- **Sections**: Intelligent section header detection
- **Experience**: Job titles, companies, dates, descriptions
- **Education**: Degrees, institutions, graduation years
- **Skills**: Technical vs soft skills classification
- **Projects**: Project names, descriptions, links

### Pattern Matching
- Email: Standard email validation
- Phone: Multiple phone number formats
- Dates: Month/Year and numeric formats
- URLs: LinkedIn, GitHub, and general websites
- Location: City, State format recognition

## Error Handling
- File type validation
- File size limits (10MB)
- Parsing error recovery
- Detailed error messages

## Dependencies
- `express`: Web framework
- `multer`: File upload handling
- `cors`: Cross-origin requests
- `pdf-parse`: PDF text extraction
- `mammoth`: Word document parsing

## Testing
```bash
# Test health endpoint
curl http://localhost:5001/api/health

# Test file upload (replace with actual file)
curl -X POST -F "resume=@sample-resume.pdf" http://localhost:5001/api/parse-resume
```

## Integration
The frontend React component automatically connects to this backend for resume parsing functionality.