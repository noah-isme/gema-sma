# API Endpoints Documentation
## GEMA - SMA Wahidiyah Platform

> **Dokumentasi lengkap untuk semua API endpoints yang tersedia di platform GEMA**

---

## 📋 Daftar Isi
- [Authentication & Authorization](#authentication--authorization)
- [Public Endpoints](#public-endpoints)
- [Student Endpoints](#student-endpoints)
- [Admin Endpoints](#admin-endpoints)
- [Chat & Communication](#chat--communication)
- [Discussion Forum](#discussion-forum)
- [Coding Lab](#coding-lab)
- [Web Lab](#web-lab)
- [Tutorial & Learning](#tutorial--learning)
- [Quiz & Sessions](#quiz--sessions)
- [Activities & Events](#activities--events)
- [Notifications](#notifications)
- [Utility & Seeding](#utility--seeding)

---

## 🔐 Authentication & Authorization

### NextAuth
**Endpoint:** `/api/auth/[...nextauth]`
- Handles NextAuth.js authentication (dynamic routes)
- Supports multiple providers and callbacks

### Register Student
**POST** `/api/auth/register`
```json
{
  "studentId": "string",
  "fullName": "string",
  "email": "string",
  "password": "string",
  "class": "string",
  "phone": "string",
  "address": "string",
  "parentName": "string",
  "parentPhone": "string",
  "userType": "student"
}
```
**Response:** Student object (without password)

### Student Login
**POST** `/api/auth/student-login`
- Alternative login endpoint for students
- Returns session token

### Auth Debug
**GET** `/api/auth-debug`
- Debug authentication status
- Development only

### Test Login
**POST** `/api/test-login`
- Test login functionality
- Development/testing purpose

---

## 🌐 Public Endpoints

### Public Stats
**GET** `/api/public-stats`
```json
{
  "totalStudents": 20,
  "totalTutorials": 15,
  "totalCodingLabs": 12,
  "totalActivities": 8,
  "totalAnnouncements": 5,
  "totalGalleryItems": 10,
  "totalAssignments": 6,
  "completedAssignments": 2,
  "upcomingEventsToday": 1,
  "upcomingEventsThisWeek": 3
}
```

### Public Data
**GET** `/api/public`
- General public information
- No authentication required

### Contact Form
**POST** `/api/contact`
```json
{
  "name": "string",
  "email": "string",
  "phone": "string (optional)",
  "subject": "string (optional)",
  "message": "string"
}
```

**GET** `/api/contact?status=unread`
- Get all contact messages (admin only)
- Query params: `status` (unread/read)

**PATCH** `/api/contact?id={contactId}`
```json
{
  "status": "read",
  "adminReply": "string (optional)"
}
```

**DELETE** `/api/contact?id={contactId}`
- Delete contact message (admin only)

### Registrations
**GET** `/api/registrations`
- Get all registrations

**POST** `/api/registrations`
```json
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "school": "string",
  "class": "string",
  "interest": "string",
  "experience": "string",
  "message": "string (optional)"
}
```

### Active Activities
**GET** `/api/activities/active`
- Get currently active activities/events
- Public access

---

## 👨‍🎓 Student Endpoints

### Student Dashboard
**GET** `/api/student/dashboard`
- Get student dashboard data
- Requires student authentication

### Student Profile
**GET** `/api/student/profile`
- Get student profile information

**PUT** `/api/student/profile` (assumed)
- Update student profile

### Student Preferences
**GET** `/api/student/preferences`
- Get student UI/UX preferences

**PUT** `/api/student/preferences`
- Update student preferences

### Change Password
**POST** `/api/student/change-password`
```json
{
  "currentPassword": "string",
  "newPassword": "string"
}
```

### Student Coding Lab

**GET** `/api/student/coding-lab/progress`
- Get student's coding lab progress

**GET** `/api/student/coding-lab/submissions/recent`
- Get recent submissions

### Student Web Lab

**GET** `/api/student/web-lab`
- Get all web lab assignments for student

**GET** `/api/student/web-lab/{id}`
- Get specific web lab assignment details

**POST** `/api/student/web-lab/submissions`
- Submit web lab assignment

---

## 👨‍💼 Admin Endpoints

### Admin Dashboard
**GET** `/api/admin/dashboard`
- Get admin dashboard statistics

### Admin Profile
**GET** `/api/admin/profile`
- Get admin profile

### Admin Preferences
**GET** `/api/admin/preferences`
- Get admin preferences

**PUT** `/api/admin/preferences`
- Update admin preferences

### Change Password
**POST** `/api/admin/change-password`
```json
{
  "currentPassword": "string",
  "newPassword": "string"
}
```

### Admin Settings
**GET** `/api/admin/settings`
- Get system settings

**POST** `/api/admin/settings`
- Update system settings

### User Management
**GET** `/api/admin/users`
- Get all users

### Student Management
**GET** `/api/admin/students`
- Get all students with filtering

### Activities Management
**GET** `/api/admin/activities`
- Get all activities

**POST** `/api/admin/activities` (assumed)
- Create new activity

**GET** `/api/admin/activities/active`
- Get active activities (admin view)

### Announcements Management
**GET** `/api/admin/announcements`
- Get all announcements

**POST** `/api/admin/announcements` (assumed)
- Create announcement

### Contacts Management
**GET** `/api/admin/contacts`
- Get all contact messages

**POST** `/api/admin/contacts`
- Create contact (admin-initiated)

**GET** `/api/admin/contacts/{id}`
- Get specific contact

**PUT** `/api/admin/contacts/{id}`
- Update contact status

**DELETE** `/api/admin/contacts/{id}`
- Delete contact

### Registrations Management
**GET** `/api/admin/registrations`
- Get all registrations

**PATCH** `/api/admin/registrations`
- Update registration status

### Gallery Management
**GET** `/api/admin/gallery`
- Get all gallery items

**POST** `/api/admin/gallery` (assumed)
- Upload gallery item

### Admin Web Lab Management

**GET** `/api/admin/web-lab`
- Get all web lab assignments

**POST** `/api/admin/web-lab` (assumed)
- Create web lab assignment

**GET** `/api/admin/web-lab/{id}`
- Get specific assignment

**PUT** `/api/admin/web-lab/{id}`
- Update assignment

**DELETE** `/api/admin/web-lab/{id}`
- Delete assignment

**GET** `/api/admin/web-lab/{id}/submission/{submissionId}`
- Get specific submission

**POST** `/api/admin/web-lab/evaluations`
- Evaluate submission

---

## 💬 Chat & Communication

### Send Message
**POST** `/api/chat/send`
```json
{
  "message": "string",
  "sessionId": "string (optional)"
}
```

### Admin Reply
**POST** `/api/chat/admin-reply`
```json
{
  "sessionId": "string",
  "message": "string"
}
```

### Chat Sessions
**GET** `/api/chat/sessions`
- Get all chat sessions (admin)
- Query params for filtering

### Server-Sent Events (SSE)
**GET** `/api/chat/sse?sessionId={sessionId}`
- Real-time chat updates using SSE

---

## 💭 Discussion Forum

### Threads

**GET** `/api/discussion/threads`
- Get all discussion threads

**POST** `/api/discussion/threads`
```json
{
  "title": "string",
  "content": "string",
  "category": "string (optional)"
}
```

**GET** `/api/discussion/threads/{id}`
- Get specific thread with replies

**PUT** `/api/discussion/threads/{id}` (assumed)
- Update thread

**DELETE** `/api/discussion/threads/{id}` (assumed)
- Delete thread

### Replies

**GET** `/api/discussion/replies?threadId={threadId}`
- Get replies for a thread

**POST** `/api/discussion/replies`
```json
{
  "threadId": "string",
  "content": "string",
  "parentId": "string (optional)"
}
```

---

## 💻 Coding Lab

### Coding Lab Main
**GET** `/api/coding-lab`
- Get coding lab overview

### Labs
**GET** `/api/coding-lab/labs`
- Get all coding labs

**GET** `/api/coding-lab/{labId}`
- Get specific lab details

**GET** `/api/coding-lab/{labId}/exercises`
- Get exercises for a lab

### Tasks
**GET** `/api/coding-lab/tasks`
- Get all coding tasks

**GET** `/api/coding-lab/tasks/{id}`
- Get specific task

### Submissions

**GET** `/api/coding-lab/submissions`
- Get student submissions

**POST** `/api/coding-lab/submissions`
- Create new submission

**GET** `/api/coding-lab/submissions/{id}`
- Get specific submission

**PUT** `/api/coding-lab/submissions/{id}`
- Update submission

**POST** `/api/coding-lab/submissions/{id}/submit`
- Final submit

**POST** `/api/coding-lab/submissions/{id}/upload`
- Upload code file

**GET** `/api/coding-lab/submissions/{id}/versions`
- Get submission versions

**POST** `/api/coding-lab/submissions/{id}/evaluate`
- Evaluate submission (admin)

**GET** `/api/coding-lab/submissions/admin`
- Get all submissions (admin view)

### Test Cases
**GET** `/api/coding-lab/exercises/{exerciseId}/test-cases`
- Get test cases for exercise

**POST** `/api/coding-lab/exercises/{exerciseId}/test-cases` (assumed)
- Create test case

---

## 🐍 Coding Lab Python

### Python Tasks
**GET** `/api/coding-lab-python/tasks`
- Get all Python tasks

**GET** `/api/coding-lab-python/tasks/{slug}`
- Get specific Python task

### Python Submissions
**GET** `/api/coding-lab-python/submissions`
- Get Python submissions

**POST** `/api/coding-lab-python/submit`
```json
{
  "taskId": "string",
  "code": "string"
}
```

### Debug Session
**GET** `/api/coding-lab-python/debug-session`
- Get debug session info

---

## 🌐 Web Lab

See [Admin Web Lab Management](#admin-web-lab-management) and [Student Web Lab](#student-web-lab)

---

## 📚 Tutorial & Learning

### Articles

**GET** `/api/tutorial/articles`
- Get all tutorial articles

**POST** `/api/tutorial/articles`
```json
{
  "title": "string",
  "content": "string",
  "category": "string",
  "tags": ["string"]
}
```

**GET** `/api/tutorial/articles/{id}`
- Get specific article

**PUT** `/api/tutorial/articles/{id}`
- Update article

**DELETE** `/api/tutorial/articles/{id}`
- Delete article

### Assignments

**GET** `/api/tutorial/assignments`
- Get all tutorial assignments

**POST** `/api/tutorial/assignments`
- Create assignment

**GET** `/api/tutorial/assignments/{id}`
- Get specific assignment

**PUT** `/api/tutorial/assignments/{id}`
- Update assignment

**DELETE** `/api/tutorial/assignments/{id}`
- Delete assignment

### Projects

**GET** `/api/tutorial/projects`
- Get all projects

**POST** `/api/tutorial/projects`
- Create project

**GET** `/api/tutorial/projects/{id}`
- Get specific project

**PUT** `/api/tutorial/projects/{id}`
- Update project

**DELETE** `/api/tutorial/projects/{id}`
- Delete project

### Submissions

**GET** `/api/tutorial/submissions`
- Get tutorial submissions

**POST** `/api/tutorial/submissions`
- Create submission

**GET** `/api/tutorial/submissions/{id}`
- Get specific submission

**PUT** `/api/tutorial/submissions/{id}`
- Update submission

### Feedback

**POST** `/api/tutorial/feedback`
```json
{
  "submissionId": "string",
  "rating": "number",
  "comment": "string"
}
```

---

## 📝 Quiz & Sessions

### Quizzes

**GET** `/api/quizzes`
- Get all quizzes

**POST** `/api/quizzes` (assumed)
- Create quiz

**GET** `/api/quizzes/{id}`
- Get specific quiz

### Sessions

**GET** `/api/sessions`
- Get all quiz sessions

**POST** `/api/sessions`
- Create quiz session

**GET** `/api/sessions/{code}`
- Get session by code

**POST** `/api/sessions/{code}/join`
- Join session

**POST** `/api/sessions/{code}/start`
- Start session

**POST** `/api/sessions/{code}/next`
- Next question

**POST** `/api/sessions/{code}/submit`
- Submit answer

**POST** `/api/sessions/{code}/finish`
- Finish session

---

## 🎯 Activities & Events

See [Active Activities](#active-activities) and [Admin Activities Management](#activities-management)

---

## 🔔 Notifications

### Server-Sent Events
**GET** `/api/notifications/sse`
- Real-time notifications stream
- SSE connection for push notifications

---

## 🛠️ Utility & Seeding

### File Upload
**POST** `/api/upload`
- Upload files (images, documents, etc.)
- Returns file URL

### Roadmap
**GET** `/api/roadmap/stages`
- Get learning roadmap stages

### Prompts
**GET** `/api/prompts/{schemaId}`
- Get AI prompt by schema ID

### Debug Session
**GET** `/api/debug-session`
- Get debug session information

### Seeding Endpoints

**POST** `/api/seed`
- Seed database with initial data

**POST** `/api/seed/students`
- Seed students

**POST** `/api/seed/assignments`
- Seed assignments

**POST** `/api/seed/classroom`
- Seed classroom data

**POST** `/api/seed/roadmap`
- Seed roadmap data

---

## 🔑 Authentication Headers

Most protected endpoints require authentication:

```
Authorization: Bearer {token}
```

Or using cookies from NextAuth session.

---

## 📊 Common Response Formats

### Success Response
```json
{
  "success": true,
  "data": {},
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "message": "User-friendly message"
}
```

---

## 🔗 Query Parameters

Common query parameters across endpoints:
- `page` - Pagination page number
- `limit` - Items per page
- `sort` - Sort field
- `order` - Sort order (asc/desc)
- `status` - Filter by status
- `search` - Search term
- `filter` - Additional filters

---

## 📝 Notes

1. **Authentication:** Most admin and student endpoints require proper authentication
2. **Authorization:** Role-based access control (RBAC) is enforced
3. **Rate Limiting:** Some endpoints may have rate limiting
4. **CORS:** Configured for allowed origins
5. **File Uploads:** Use multipart/form-data for file uploads
6. **SSE:** Server-Sent Events for real-time features
7. **Pagination:** Default limit is usually 10-20 items

---

## 🚀 Development

### Base URL
- **Local:** `http://localhost:3000/api`
- **Production:** `https://your-domain.com/api`

### Testing
```bash
# Example using curl
curl -X GET http://localhost:3000/api/public-stats

# With authentication
curl -X GET http://localhost:3000/api/student/dashboard \
  -H "Authorization: Bearer {token}"
```

---

**Last Updated:** 2025-01-12  
**Version:** 1.0.0  
**Project:** GEMA - SMA Wahidiyah Platform
