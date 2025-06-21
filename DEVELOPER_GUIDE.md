# 👨‍💻 BizDev Developer Guide

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Setup
```bash
git clone https://github.com/CookieStudioCanada/BizDev.git
cd BizDev
npm install
npm run dev
```

### Live URLs
- **Production**: [https://cookiestudiocanada.github.io/BizDev/](https://cookiestudiocanada.github.io/BizDev/)
- **Local Dev**: http://localhost:5173

## Project Architecture

### Tech Stack
```
Frontend: React 18 + TypeScript + Vite
Styling: Tailwind CSS + shadcn/ui
State: Zustand + localStorage
Routing: React Router DOM
Data: CSV import/export with PapaParse + JSZip
Icons: Lucide React
```

### Folder Structure
```
src/
├── components/
│   ├── ui/                 # shadcn/ui base components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── table.tsx
│   │   └── badge.tsx
│   ├── ContactTable.tsx    # Contact management
│   ├── CampaignKanban.tsx  # Campaign pipeline
│   ├── Timeline.tsx        # Activity timeline
│   ├── AnalyticsDashboard.tsx # KPI dashboard
│   └── CsvManager.tsx      # Import/export
├── pages/                  # Route components
│   ├── ContactsPage.tsx
│   ├── CampaignsPage.tsx
│   ├── TimelinePage.tsx
│   └── AnalyticsPage.tsx
├── store/
│   └── useLrgmStore.ts     # Zustand store
├── lib/
│   ├── types.ts            # TypeScript definitions
│   ├── utils.ts            # Utility functions
│   ├── csv.ts              # CSV operations
│   └── id.ts               # ID generation
├── App.tsx                 # Main app + routing
└── main.tsx               # React entry point
```

## Data Models

### Core Types
```typescript
// Contact Management
interface Contact {
  id: string;
  category: 'CLIENT' | 'PARTNER' | 'PROSPECT';
  firstName: string;
  lastName: string;
  org?: string;
  email?: string;
  phone?: string;
  notes?: string;
}

// Campaign Management  
interface Campaign {
  id: string;
  title: string;
  channel: 'BLOG' | 'NEWSLETTER' | 'WEBINAR' | 'DINNER';
  datePlanned: string;
  status: 'LIVE' | 'CLOSED';
  audienceIds: string[];
  notes?: string;
}

// Activity Tracking
interface Activity {
  id: string;
  contactId: string;
  date: string;
  type: 'EMAIL' | 'CALL' | 'MEETING' | 'EVENT';
  summary: string;
  details?: string;
}
```

### State Management
```typescript
// Zustand Store Structure
interface LrgmStore {
  contacts: Contact[];
  campaigns: Campaign[];
  activities: Activity[];
  
  // Contact operations
  addContact: (contact: Omit<Contact, 'id'>) => void;
  updateContact: (id: string, updates: Partial<Contact>) => void;
  deleteContact: (id: string) => void;
  
  // Campaign operations
  addCampaign: (campaign: Omit<Campaign, 'id'>) => void;
  updateCampaign: (id: string, updates: Partial<Campaign>) => void;
  deleteCampaign: (id: string) => void;
  
  // Activity operations
  addActivity: (activity: Omit<Activity, 'id'>) => void;
  updateActivity: (id: string, updates: Partial<Activity>) => void;
  deleteActivity: (id: string) => void;
  
  // Data operations
  importData: (data: Partial<LrgmData>) => void;
  exportData: () => LrgmData;
  clearAllData: () => void;
}
```

## Key Features

### 1. Contact Management (`ContactTable.tsx`)
```typescript
// Add new contact
const addContact = () => {
  const newContact = {
    category: 'PROSPECT', // Default
    firstName: formData.firstName,
    lastName: formData.lastName,
    org: formData.org,
    email: formData.email,
    phone: formData.phone,
    notes: formData.notes,
  };
  addContact(newContact);
};

// Edit existing contact
const handleEdit = (contact: Contact) => {
  setEditingContact(contact);
  setIsDialogOpen(true);
};
```

### 2. Campaign Pipeline (`CampaignKanban.tsx`)
```typescript
// Campaign status management
const handleStatusChange = (newStatus: Campaign['status']) => {
  updateCampaign(campaign.id, { status: newStatus });
};

// Audience selection
const toggleContact = (contactId: string) => {
  setFormData(prev => ({
    ...prev,
    audienceIds: prev.audienceIds.includes(contactId)
      ? prev.audienceIds.filter(id => id !== contactId)
      : [...prev.audienceIds, contactId]
  }));
};
```

### 3. Activity Timeline (`Timeline.tsx`)
```typescript
// Group activities by date
const groupedActivities = sortedActivities.reduce((groups, activity) => {
  const date = new Date(activity.date).toDateString();
  if (!groups[date]) {
    groups[date] = [];
  }
  groups[date].push(activity);
  return groups;
}, {} as Record<string, Activity[]>);

// Date formatting helpers
const isToday = (dateString: string) => {
  return new Date(dateString).toDateString() === new Date().toDateString();
};
```

### 4. Analytics Dashboard (`AnalyticsDashboard.tsx`)
```typescript
// KPI calculations
const contactsByCategory = contacts.reduce((acc, contact) => {
  acc[contact.category] = (acc[contact.category] || 0) + 1;
  return acc;
}, {} as Record<string, number>);

const activitiesThisMonth = activities.filter(activity => {
  const activityDate = new Date(activity.date);
  return activityDate.getMonth() === currentMonth && 
         activityDate.getFullYear() === currentYear;
}).length;
```

### 5. Data Import/Export (`CsvManager.tsx`)
```typescript
// Export to ZIP with multiple CSVs
const handleExport = async () => {
  const data = exportData();
  const blob = await exportToCSV(data);
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `bizdev-data-${new Date().toISOString().split('T')[0]}.zip`;
  a.click();
};

// Import from CSV files
const handleImport = async (files: FileList) => {
  const data = await importFromFiles(files);
  importData(data);
};
```

## Development Workflow

### Available Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Code Standards

#### TypeScript
- Strict mode enabled
- All components typed
- Props interfaces defined
- No `any` types (except legacy code)

#### Component Structure
```typescript
// Standard component template
interface ComponentProps {
  // Props definition
}

export const ComponentName = ({ prop1, prop2 }: ComponentProps) => {
  // State hooks
  const [state, setState] = useState();
  
  // Store hooks
  const { data, actions } = useLrgmStore();
  
  // Event handlers
  const handleEvent = () => {
    // Logic here
  };
  
  // Render
  return (
    <div className="container">
      {/* JSX here */}
    </div>
  );
};
```

#### Styling Guidelines
```typescript
// Use Tailwind classes
className="flex items-center justify-between p-4 bg-background"

// Responsive design
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"

// Dark mode support
className="bg-background text-foreground"

// Component variants
className={cn(
  "base-classes",
  variant === 'primary' && "primary-classes",
  variant === 'secondary' && "secondary-classes"
)}
```

### State Management Patterns

#### Adding New Data Type
1. Define type in `lib/types.ts`
2. Add to store interface
3. Implement CRUD operations
4. Add to CSV import/export
5. Create UI components

#### Store Usage
```typescript
// Reading data
const { contacts, campaigns } = useLrgmStore();

// Updating data
const { addContact, updateContact } = useLrgmStore();

// Complex operations
const { importData, exportData } = useLrgmStore();
```

## Deployment

### Automatic Deployment
Every push to `main` triggers GitHub Actions:
1. Install dependencies
2. Run TypeScript compilation
3. Build with Vite
4. Deploy to GitHub Pages

### Manual Deployment
```bash
# Build locally
npm run build

# Test build
npm run preview

# Deploy (automatic on push to main)
git add .
git commit -m "feat: your changes"
git push origin main
```

### Environment Configuration
```typescript
// vite.config.ts
export default defineConfig({
  base: '/BizDev/', // GitHub Pages path
  // ... other config
});

// App.tsx
<Router basename="/BizDev"> // Match base path
```

## Common Development Tasks

### Adding a New Page
1. Create component in `src/pages/`
2. Add route in `App.tsx`
3. Add navigation link
4. Update types if needed

### Adding a New Feature
1. Define data model in `types.ts`
2. Add store operations
3. Create UI components
4. Add to CSV import/export
5. Update analytics if relevant

### Debugging

#### Common Issues
```bash
# TypeScript errors
npm run build  # Check for type errors

# Routing issues
# Check basename in Router matches vite.config.ts base

# State not persisting
# Check localStorage in browser dev tools

# CSV import failing
# Check file format matches expected schema
```

#### Development Tools
```bash
# React Developer Tools
# Zustand DevTools (in development)
# Tailwind CSS IntelliSense
# TypeScript Language Server
```

## Testing Strategy

### Current Testing
- TypeScript compilation
- Build verification
- Manual testing

### Recommended Additions
```bash
# Unit testing
npm install --save-dev vitest @testing-library/react

# E2E testing  
npm install --save-dev playwright

# Component testing
npm install --save-dev @storybook/react
```

## Performance Optimization

### Current Optimizations
- Vite for fast builds
- Tree-shaking for smaller bundles
- Lazy loading potential
- Efficient re-renders with Zustand

### Bundle Analysis
```bash
# Analyze bundle size
npm run build
# Check dist/ folder sizes

# Bundle analyzer (add if needed)
npm install --save-dev rollup-plugin-visualizer
```

## Security Considerations

### Data Handling
- All data stored locally (localStorage)
- No server-side data transmission
- CSV files processed client-side
- No authentication required

### Best Practices
- Input validation on forms
- XSS prevention (React default)
- Safe CSV parsing
- No sensitive data in code

## Troubleshooting

### Build Issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check Node.js version
node --version  # Should be 18+

# TypeScript errors
npx tsc --noEmit  # Check without building
```

### Runtime Issues
```bash
# Check browser console
# Verify localStorage data
# Check network tab for failed requests
# Verify routing configuration
```

### Deployment Issues
```bash
# Check GitHub Actions logs
# Verify GitHub Pages settings
# Check repository permissions
# Verify workflow file syntax
```

## Contributing

### Pull Request Process
1. Fork repository
2. Create feature branch
3. Make changes with tests
4. Update documentation
5. Submit pull request

### Code Review Checklist
- [ ] TypeScript compiles without errors
- [ ] Components are properly typed
- [ ] Responsive design tested
- [ ] Dark mode works correctly
- [ ] CSV import/export tested
- [ ] No console errors
- [ ] Performance impact considered

---

## Support

### Resources
- **React Docs**: https://react.dev
- **Vite Docs**: https://vitejs.dev
- **Tailwind Docs**: https://tailwindcss.com
- **shadcn/ui**: https://ui.shadcn.com
- **Zustand**: https://github.com/pmndrs/zustand

### Getting Help
1. Check this guide first
2. Search existing GitHub issues
3. Create new issue with:
   - Clear description
   - Steps to reproduce
   - Expected vs actual behavior
   - Browser/OS info

---

**Happy coding! 🚀** 