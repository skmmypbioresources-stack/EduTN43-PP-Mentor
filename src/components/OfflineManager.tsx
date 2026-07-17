import { ReactNode } from 'react';
import { WifiOff } from 'lucide-react';

type Props = {
  online: boolean;
  children: ReactNode;
};

export default function OfflineManager({ online, children }: Props) {
  if (!online) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6">

        <WifiOff className="w-20 h-20 text-amber-500 mb-6" />

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          You're Offline
        </h1>

        <p className="text-gray-600 text-center max-w-md">
          PP Mentor is running in Offline Mode.
          Reading previously visited content will still work.
          AI, Google Login and cloud syncing will resume automatically once your internet connection returns.
        </p>

      </div>
    );
  }

  return <>{children}</>;
}