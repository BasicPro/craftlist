# ![CraftList](app/logo.svg) CraftList - Real-time Todo App

A modern, real-time to-do list application built with Next.js and Supabase. Create, manage, and organize your tasks with instant updates across all devices.

## ✨ Features

- **Real-time Updates**: Changes sync instantly across all connected devices
- **User Authentication**: Secure sign-up and login with Supabase Auth
- **Todo Lists & Items**: Organize tasks into multiple lists with individual items
- **CRUD Operations**: Create, read, update, and delete both lists and items
- **Modern UI**: Clean, responsive design built with Tailwind CSS and shadcn/ui
- **Real-time Subscriptions**: Live updates using Supabase's real-time features
- **User-specific Data**: Each user sees only their own to-do lists and items
- **Optimistic Updates**: Instant UI feedback for better user experience

## 🚀 Live Demo

[View the live demo here](https://craftlist.vercel.app)

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 with App Router
- **Backend**: Supabase (PostgreSQL + Real-time + Auth)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Authentication**: Supabase Auth with cookie-based sessions
- **Real-time**: Supabase Realtime subscriptions

## 📋 Database Schema

### Todo Lists Table

```sql
todo_lists (
  id: uuid (primary key)
  user_id: uuid (foreign key to auth.users)
  name: text
  description: text
  created_at: timestamp
  updated_at: timestamp
)
```

### Todo Items Table

```sql
todo_items (
  id: uuid (primary key)
  list_id: uuid (foreign key to todo_lists)
  user_id: uuid (foreign key to auth.users)
  name: text
  description: text
  status: text (enum: 'pending', 'in_progress', 'completed')
  created_at: timestamp
  updated_at: timestamp
)
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm
- Supabase account

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/craftlist.git
cd craftlist
```

### 2. Set Up Supabase Project

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to your project's SQL Editor and run the following schema:

```sql
-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.todo_items (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  status USER-DEFINED NOT NULL DEFAULT 'pending'::status,
  name text NOT NULL,
  description text,
  list_id uuid NOT NULL DEFAULT gen_random_uuid(),
  CONSTRAINT todo_items_pkey PRIMARY KEY (id),
  CONSTRAINT todo_items_list_id_fkey FOREIGN KEY (list_id) REFERENCES public.todo_lists(id)
);


CREATE TABLE public.todo_lists (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  name text NOT NULL,
  CONSTRAINT todo_lists_pkey PRIMARY KEY (id)
);

-- Enable Row Level Security
ALTER TABLE todo_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE todo_items ENABLE ROW LEVEL SECURITY;

-- Create policies for todo_lists
CREATE POLICY "Users can view their own to-do lists" ON todo_lists
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own to-do lists" ON todo_lists
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own to-do lists" ON todo_lists
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own to-do lists" ON todo_lists
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Create policies for todo_items
CREATE POLICY "Users can view their own to-do items" ON todo_items
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own to-do items" ON todo_items
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own to-do items" ON todo_items
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own to-do items" ON todo_items
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Enable real-time for both tables
ALTER PUBLICATION supabase_realtime ADD TABLE todo_lists;
ALTER PUBLICATION supabase_realtime ADD TABLE todo_items;
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can find these values in your Supabase project settings under API.

### 4. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 5. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## 📱 How to Use

### Getting Started

1. **Sign Up/Login**: Create an account or sign in with your existing credentials
2. **Create Your First List**: Click "Create New List" to start organizing your tasks
3. **Add Todo Items**: Within each list, add individual to-do items with descriptions
4. **Track Progress**: Update item status (pending, in progress, completed)
5. **Real-time Sync**: All changes appear instantly across your devices

### Features Overview

#### Todo Lists

- Create multiple lists for different projects or categories
- Edit list names and descriptions
- Delete lists (removes all associated items)
- View all your lists on the main dashboard

#### Todo Items

- Add items to any list with name and description
- Update item status to track progress
- Edit item details anytime
- Delete individual items
- Items are automatically filtered by user

#### Real-time Features

- Changes sync instantly across all connected devices
- No need to refresh the page
- Collaborative features (if multiple users share lists)

## 🏗️ Project Structure

```
craftlist/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   ├── protected/         # Protected routes
│   ├── to-do/              # Todo list pages
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── todos/            # Todo-specific components
│   ├── ui/               # shadcn/ui components
│   └── auth/             # Authentication components
├── lib/                  # Utility functions
│   └── supabase/         # Supabase client configuration
└── middleware.ts         # Next.js middleware for auth
```

## 🔧 Customization

### Styling

The app uses Tailwind CSS with shadcn/ui components. You can customize the theme by modifying:

- `tailwind.config.ts` - Tailwind configuration
- `app/globals.css` - Global styles
- `components.json` - shadcn/ui configuration

### Adding New Features

- **New Todo Fields**: Add columns to the database schema and update TypeScript types
- **Categories/Tags**: Extend the todo_items table with additional fields
- **Due Dates**: Add timestamp fields for deadline tracking
- **Priority Levels**: Add priority enum to todo_items

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourusername%2Fcraftlist)

### Environment Variables for Production

Make sure to set these in your deployment platform:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Backend powered by [Supabase](https://supabase.com/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)

---

Made with ❤️ for productive task management
