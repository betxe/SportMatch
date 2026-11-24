import { HashRouter } from 'react-router-dom';
import { EvalPanel } from './components/EvalPanel';
import { PhoneFrame } from './components/PhoneFrame';
import { Toast } from './components/Toast';
import { EvalProvider } from './lib/eval-context';
import { isEvalMode } from './lib/eval-logger';
import { AppRoutes } from './routes';
import { StoreProvider } from './state/store';

export default function App() {
  const evalMode = isEvalMode();
  return (
    <HashRouter>
      <EvalProvider active={evalMode}>
        <StoreProvider>
          <div className="flex min-h-dvh flex-col items-center bg-desk sm:px-4 sm:py-4">
            <PhoneFrame evalMode={evalMode}>
              <div className="absolute inset-0 min-h-0">
                <AppRoutes />
              </div>
              <Toast />
            </PhoneFrame>
            {evalMode ? <EvalPanel /> : null}
          </div>
        </StoreProvider>
      </EvalProvider>
    </HashRouter>
  );
}
