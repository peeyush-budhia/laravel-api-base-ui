import PageMeta from '../../components/common/PageMeta';
import ResetPasswordForm from '../../components/auth/ResetPasswordForm';
import AuthLayout from './AuthPageLayout';

export default function ActivateAccount() {
  return (
    <>
      <PageMeta
        title="Activate Account"
        description="Create your password and activate your account"
      />

      <AuthLayout>
        <ResetPasswordForm mode="activation" />
      </AuthLayout>
    </>
  );
}
