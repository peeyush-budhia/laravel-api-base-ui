import PageMeta from '../../components/common/PageMeta';
import AuthLayout from './AuthPageLayout';

export default function ResetPassword() {
  return (
    <>
      <PageMeta
        title="Reset Password"
        description="Create a new account password"
      />

      <AuthLayout>
        <div className="flex flex-col flex-1 items-center justify-center">
          <div className="w-full max-w-md">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Reset Password
            </h1>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Create a new password for your account.
            </p>
          </div>
        </div>
      </AuthLayout>
    </>
  );
}
