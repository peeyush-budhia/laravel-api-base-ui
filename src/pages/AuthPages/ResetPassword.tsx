import PageMeta from '../../components/common/PageMeta';
import ResetPasswordForm from '../../components/auth/ResetPasswordForm';
import AuthLayout from './AuthPageLayout';

export default function ResetPassword() {
  return (
    <>
      <PageMeta
        title="Reset Password"
        description="Reset your account password"
      />

      <AuthLayout>
        <ResetPasswordForm />
      </AuthLayout>
    </>
  );
}
