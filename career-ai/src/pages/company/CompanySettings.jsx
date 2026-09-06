import CompanyLayout from '../../components/layout/CompanyLayout';
import Card from '../../components/ui/Card';
import { Settings, Info } from 'lucide-react';

export default function CompanySettings() {
  return (
    <CompanyLayout title="Settings" subtitle="Manage your account preferences">
      <Card className="p-8 text-center border-dashed border-2 border-brand-ink-200 bg-brand-ink-50/50 max-w-2xl mx-auto mt-10">
        <Settings className="mx-auto h-12 w-12 text-brand-ink-300 mb-3" />
        <h4 className="text-brand-ink-900 font-bold text-lg mb-2">Settings Coming Soon</h4>
        <p className="text-sm text-brand-ink-500 mb-6 max-w-md mx-auto">
          We are currently working on adding account management, billing, and team collaboration features. 
        </p>
        <div className="bg-brand-blue-50 text-brand-blue-800 p-4 rounded-xl flex items-start gap-3 text-left">
          <Info className="h-5 w-5 shrink-0 mt-0.5" />
          <p className="text-sm">
            For now, your profile settings are managed by your administrator. If you need immediate assistance or want to update your company details, please contact support.
          </p>
        </div>
      </Card>
    </CompanyLayout>
  );
}
