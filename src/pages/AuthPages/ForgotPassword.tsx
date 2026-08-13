import PageMeta from '../../components/common/PageMeta';
import ForgotPasswordForm from '../../components/auth/ForgotPasswordForm';
import AuthLayout from './AuthPageLayout';

export default function ForgotPassword() {
  return (
    <>
      <PageMeta
        title="Forgot Password"
        description="Reset your account password"
      />

      <AuthLayout>
        <ForgotPasswordForm />
      </AuthLayout>
    </>
  );
}
