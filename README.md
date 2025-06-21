# LRGM-MVP (Legal Relationship & Growth Manager)

A modern, single-page React application for managing business relationships, campaigns, and activities. Built with React 18, TypeScript, and shadcn/ui components.

## Features

- **Contacts Management**: Track clients, partners, and prospects with detailed information
- **Campaign Pipeline**: Kanban-style campaign management with status tracking
- **Activity Timeline**: Chronological view of all interactions and activities
- **Analytics Dashboard**: Visual insights with KPIs and activity trends
- **CSV Import/Export**: Seamless data import/export functionality
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Works on desktop and mobile devices

## Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

## Installation

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd BizDev
   pnpm install
   ```

2. **Start the development server:**
   ```bash
   pnpm dev
   ```

3. **Open your browser:**
   Navigate to `http://localhost:5173`

## Development Commands

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Run linter
pnpm lint
```

## CSV Import/Export

### Export Data
- Click the **Download** button (bottom-right floating button)
- Downloads a ZIP file containing three CSV files:
  - `contacts.csv` - All contact information
  - `campaigns.csv` - Campaign data with audience IDs
  - `activities.csv` - Activity records

### Import Data
- Click the **Upload** button (bottom-right floating button)
- Select CSV files to import
- Files should be named with keywords: "contact", "campaign", or "activity"

#### CSV Schemas

**Contacts CSV Format:**
```csv
id,category,firstName,lastName,org,email,phone,notes
uuid,CLIENT,John,Doe,Acme Corp,john@acme.com,555-0123,Notes here
```

**Campaigns CSV Format:**
```csv
id,title,channel,datePlanned,status,audienceIds,notes
uuid,Q4 Newsletter,NEWSLETTER,2024-01-15,PLANNED,uuid1;uuid2,Campaign notes
```

**Activities CSV Format:**
```csv
id,contactId,date,type,summary,details
uuid,contact-uuid,2024-01-15T10:00:00Z,EMAIL,Follow-up call,Detailed notes
```

### Field Requirements

#### Contacts
- **Required**: `firstName`, `lastName`, `category`
- **Optional**: `org`, `email`, `phone`, `notes`
- **Category Values**: `CLIENT`, `PARTNER`, `PROSPECT`

#### Campaigns
- **Required**: `title`, `channel`, `datePlanned`, `status`
- **Optional**: `audienceIds`, `notes`
- **Channel Values**: `BLOG`, `NEWSLETTER`, `WEBINAR`, `DINNER`
- **Status Values**: `PLANNED`, `SENT`, `COMPLETED`
- **Date Format**: ISO 8601 (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ssZ)

#### Activities
- **Required**: `contactId`, `date`, `type`, `summary`
- **Optional**: `details`
- **Type Values**: `EMAIL`, `CALL`, `MEETING`, `EVENT`
- **Date Format**: ISO 8601 (YYYY-MM-DDTHH:mm:ssZ)

## Application Structure

```
src/
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── ContactTable.tsx    # Contact management
│   ├── CampaignKanban.tsx  # Campaign pipeline
│   ├── Timeline.tsx        # Activity timeline
│   ├── AnalyticsDashboard.tsx # Analytics & KPIs
│   └── CsvManager.tsx      # Import/export functionality
├── pages/
│   ├── ContactsPage.tsx    # Contacts view
│   ├── CampaignsPage.tsx   # Campaigns view
│   ├── TimelinePage.tsx    # Timeline view
│   └── AnalyticsPage.tsx   # Analytics view
├── store/
│   └── useLrgmStore.ts     # Zustand state management
├── lib/
│   ├── types.ts            # TypeScript definitions
│   ├── csv.ts              # CSV utilities
│   ├── id.ts               # UUID generation
│   └── utils.ts            # Common utilities
├── App.tsx                 # Main application
└── main.tsx               # Entry point
```

## Data Storage

- **Client-side only**: All data is stored in browser localStorage
- **No backend required**: Perfect for local/offline use
- **Automatic persistence**: Changes are saved automatically with 400ms debounce

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui components
- **State Management**: Zustand with persistence
- **Routing**: React Router v6
- **Data Processing**: PapaParse (CSV), JSZip (file compression)
- **Charts**: Chart.js with react-chartjs-2
- **Icons**: Lucide React

## Browser Compatibility

- Chrome/Edge 88+
- Firefox 87+
- Safari 14+

## Future Enhancements (Commented Hooks)

The codebase includes TODO comments for future features:

```typescript
// TODO: integrate OpenAI for "draft follow-up email" (Phase 2)
// TODO: file > settings > enable basic auth once backend added
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions, please create a GitHub issue with:
- Steps to reproduce
- Expected vs actual behavior
- Browser and version
- Any error messages

---

Built with ❤️ for efficient relationship management 