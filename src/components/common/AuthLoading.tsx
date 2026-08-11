import Spinner from '../ui/spinner';

export default function AuthLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-gray-900">
      <Spinner />
    </div>
  );
}
