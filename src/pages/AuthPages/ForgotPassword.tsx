import PageMeta from '../../components/common/PageMeta';
import AuthLayout from './AuthPageLayout';

export default function ForgotPassword() {
  return (
    <>
      <PageMeta
        title="Forgot Password"
        description="Reset your account password"
      />

      <AuthLayout>
        <div className="flex flex-col flex-1 items-center justify-center">
          <div className="w-full max-w-md">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Forgot Password
            </h1>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email address to reset your password.
            </p>
          </div>
        </div>
      </AuthLayout>
    </>
  );
}
