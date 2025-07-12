import { Metadata } from 'next';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { SampleForm } from '@/features/samples/components/sample-form';

export const metadata: Metadata = {
  title: 'Thêm mẫu vải mới - AppSynex',
  description: 'Tạo mẫu vải mới trong hệ thống'
};

export default function NewSamplePage() {
  return (
    <ProtectedRoute
      requiredPermissions={[{ module: 'SAMPLE', action: 'CREATE' }]}
    >
      <SampleForm />
    </ProtectedRoute>
  );
}
