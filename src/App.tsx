import { HashRouter } from 'react-router-dom';
import { PhoneFrame } from './components/PhoneFrame';
import { Toast } from './components/Toast';
import { AppRoutes } from './routes';
import { StoreProvider } from './state/store';

export default function App() {
  return (
    <HashRouter>
      <StoreProvider>
        <div className="flex min-h-dvh flex-col items-center bg-desk sm:px-4 sm:py-4">
          <PhoneFrame>
            <div className="absolute inset-0 min-h-0">
              <AppRoutes />
            </div>
            <Toast />
          </PhoneFrame>
        </div>
      </StoreProvider>
    </HashRouter>
  );
}
