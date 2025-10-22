# Blog Admin Dashboard

A modern admin dashboard for visualizing and managing blog comments. Built with Next.js 15, React 18, TypeScript, Tailwind CSS, and Supabase.

## Features

### 📊 Overview Dashboard
- **Statistics Cards**: View total comments, approved, pending, spam counts
- **Time-based Metrics**: Comments today, this week, and this month
- **Trend Chart**: Visual line chart showing comment activity over the last 30 days
- **Top Posts**: See which blog posts have the most comments
- **Recent Comments**: Quick view of the latest comments with status badges

### 💬 Comments Management
- **All Comments View**: Comprehensive list of all comments with detailed information
- **Search Functionality**: Search by author name, email, content, or post slug
- **Status Filtering**: Filter by approved, pending, or spam status
- **Sorting Options**: Sort by newest or oldest first
- **Detailed Information**: View author details, timestamps, IP addresses, and parent comment references

### 🎨 Design
- **Consistent Styling**: Matches the blog's design with the same brand colors (#3eaf7c)
- **Dark Mode Support**: Automatically adapts to system preferences
- **Responsive Layout**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI**: Clean, professional interface with smooth transitions

## Prerequisites

- Node.js 18+ or 20+
- pnpm 9.8.0 (or npm/yarn)
- Supabase account with a configured database
- The same Supabase project used by your blog

## Installation

1. **Navigate to the project directory:**
   \`\`\`bash
   cd /Users/lujuncheng/GithubProjects/admin
   \`\`\`

2. **Install dependencies:**
   \`\`\`bash
   pnpm install
   # or
   npm install
   # or
   yarn install
   \`\`\`

3. **Set up environment variables:**
   
   Copy the example environment file:
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`

   Edit \`.env.local\` and add your Supabase credentials:
   \`\`\`env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
   \`\`\`

   > **Note**: Use the same Supabase credentials from your blog project at `/Users/lujuncheng/X-PlaneProjects/blog/.env.local`

4. **Run the development server:**
   \`\`\`bash
   pnpm dev
   # or
   npm run dev
   # or
   yarn dev
   \`\`\`

5. **Open your browser:**
   
   Navigate to [http://localhost:3001](http://localhost:3001)
   
   > The dashboard runs on port 3001 to avoid conflicts with your blog (which likely runs on port 3000)

## Database Schema

The dashboard expects a \`comments\` table in Supabase with the following structure:

\`\`\`sql
CREATE TABLE comments (
  id BIGSERIAL PRIMARY KEY,
  post_slug TEXT NOT NULL,
  content TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_email TEXT NOT NULL,
  parent_id BIGINT REFERENCES comments(id),
  status TEXT NOT NULL DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'spam')),
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
\`\`\`

## Building for Production

\`\`\`bash
pnpm build
pnpm start
\`\`\`

## Project Structure

\`\`\`
admin/
├── app/
│   ├── api/
│   │   ├── comments/route.ts    # API for fetching comments
│   │   └── stats/route.ts       # API for fetching statistics
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home page
├── components/
│   ├── CommentsChart.tsx        # Line chart component
│   ├── CommentsList.tsx         # Full comments list with filters
│   ├── Dashboard.tsx            # Main dashboard component
│   ├── RecentComments.tsx       # Recent comments widget
│   ├── StatsCards.tsx           # Statistics cards
│   └── TopPosts.tsx             # Top posts widget
├── lib/
│   └── supabase.ts              # Supabase client configuration
├── types/
│   └── comment.ts               # TypeScript type definitions
├── .env.example                 # Environment variables template
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
\`\`\`

## Features in Detail

### Auto-Approval
Comments are automatically approved when submitted through the blog. The dashboard displays all comments regardless of status for monitoring purposes.

### Real-time Updates
Click the **Refresh** button in the header to fetch the latest comment data from Supabase.

### Search & Filter
- Search across author names, emails, content, and post slugs
- Filter by status: all, approved, pending, or spam
- Sort by newest or oldest first
- Live count shows filtered results vs. total

### Visualizations
- **Trend Chart**: Powered by Recharts, shows daily comment counts for the last 30 days
- **Status Distribution**: Color-coded cards for quick status overview
- **Top Posts**: Ranked list of posts with the most comments

## Security Notes

- The dashboard uses the Supabase Service Role Key for admin operations
- Never commit \`.env.local\` to version control
- Keep your Service Role Key secure - it has full database access
- Consider adding authentication if deploying publicly

## Technologies Used

- **Next.js 15**: React framework with App Router
- **React 18**: UI library
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Supabase**: Backend-as-a-Service for database
- **Recharts**: Charting library for data visualization
- **Zod**: Schema validation

## Troubleshooting

### No comments showing up
- Check that your \`.env.local\` has the correct Supabase credentials
- Verify the \`comments\` table exists in your Supabase database
- Check browser console for any errors

### Styles not loading
- Make sure Tailwind CSS is properly configured
- Run \`pnpm dev\` to ensure the development server is running
- Clear browser cache and reload

### Port already in use
- Change the port in \`package.json\` scripts (currently 3001)
- Or stop the process using port 3001

## License

This project is part of your blog system and follows the same license.

## Support

For issues or questions, refer to the main blog project documentation.

