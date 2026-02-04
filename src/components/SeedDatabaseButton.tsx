import { useState } from 'react';
import { Button } from './ui/button';
import { Database, CheckCircle2, AlertCircle, Loader2, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

export function SeedDatabaseButton() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const openSupabaseDashboard = () => {
    window.open('https://supabase.com/dashboard/project/zmvprnrggquzrgxrdetf/editor', '_blank');
  };

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5 text-primary" />
          Database Setup Required
        </CardTitle>
        <CardDescription>
          Follow these steps to set up your database with proper tables and relationships
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3 text-sm">
          <div className="bg-muted/50 p-4 rounded-lg space-y-3">
            <p className="font-medium">Setup Steps:</p>
            <ol className="list-decimal list-inside space-y-2">
              <li>Open your Supabase SQL Editor</li>
              <li>Copy content from <code className="bg-muted px-1 py-0.5 rounded">/supabase/migrations/001_create_tables.sql</code></li>
              <li>Paste and run in SQL Editor</li>
              <li>Copy content from <code className="bg-muted px-1 py-0.5 rounded">/supabase/migrations/002_seed_data.sql</code></li>
              <li>Paste and run in SQL Editor</li>
            </ol>
          </div>

          <Button onClick={openSupabaseDashboard} className="w-full" variant="default">
            <ExternalLink className="mr-2 h-4 w-4" />
            Open Supabase SQL Editor
          </Button>

          <div className="text-xs text-muted-foreground border-l-2 border-primary pl-3">
            <p className="font-medium mb-1">📖 Need detailed instructions?</p>
            <p>Check <code>/DATABASE_SETUP_GUIDE.md</code> for step-by-step instructions with screenshots and troubleshooting tips.</p>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm">
          <p className="text-amber-800">
            <strong>⚠️ Important:</strong> The database tables must be created manually in Supabase's SQL Editor. 
            This ensures proper table structure, indexes, and security policies.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}