# Job Tracker Dashboard

A full-stack application to track, organize, and analyze your job applications in real-time.

## Features

- **Application Tracking**: Add, update, and delete job applications
- **Status Filtering**: Filter applications by status (Applied, Interviewed, Offered, Rejected, Ghosted)
- **Analytics Dashboard**: Real-time charts showing application statistics
- **Company Search**: Quick search and filter by company name
- **Application Timeline**: Visual timeline of your job search journey
- **Interview Reminders**: Track upcoming interviews and follow-ups

## Tech Stack

**Frontend:**
- React 18 + TypeScript
- Tailwind CSS for styling
- Recharts for analytics
- Axios for API calls
- Deployed on Vercel

**Backend:**
- Python FastAPI
- SQLite database
- SQLAlchemy ORM
- CORS enabled for frontend integration
- Deployed on Railway/Render

## Project Structure

```
job-tracker-dashboard/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API service calls
│   │   └── App.tsx
│   ├── package.json
│   └── tailwind.config.js
├── backend/                  # FastAPI application
│   ├── app/
│   │   ├── main.py          # FastAPI app
│   │   ├── models.py        # Database models
│   │   ├── schemas.py       # Pydantic schemas
│   │   └── routes.py        # API routes
│   ├── requirements.txt
│   └── database.db          # SQLite database
└── README.md
```

## Getting Started

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

Server runs on `http://localhost:8000`

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

App runs on `http://localhost:3000`

## API Endpoints

### Applications
- `GET /api/applications` - Get all applications
- `POST /api/applications` - Create new application
- `PUT /api/applications/{id}` - Update application
- `DELETE /api/applications/{id}` - Delete application
- `GET /api/applications?status=Applied` - Filter by status

### Analytics
- `GET /api/analytics/summary` - Get summary statistics
- `GET /api/analytics/status-breakdown` - Status distribution
- `GET /api/analytics/timeline` - Application timeline

## Key Achievements

- Built a complete full-stack application from scratch
- Implemented real-time application tracking with analytics
- Created responsive UI with Tailwind CSS
- Designed RESTful API with FastAPI
- Integrated frontend and backend seamlessly
- Deployed both frontend and backend to production

## Live Demo

- **Frontend**: [job-tracker.vercel.app](https://job-tracker.vercel.app)
- **Backend API**: [job-tracker-api.railway.app](https://job-tracker-api.railway.app)

## Screenshots

[Dashboard Overview]
- Real-time application counter
- Status breakdown pie chart
- Applications timeline
- Quick action buttons

[Application List]
- Sortable table with all applications
- Status badges
- Company information
- Last updated timestamp
- Edit/delete options

## Future Enhancements

- Email notifications for application updates
- Integration with LinkedIn for auto-import
- Resume parser to track submitted versions
- Salary range tracking and negotiation tips
- Interview preparation resources

## Author

Surya Vanukuri - [GitHub](https://github.com/SuryaNickil) | [LinkedIn](https://linkedin.com/in/surya-vanukuri)

## License

MIT
