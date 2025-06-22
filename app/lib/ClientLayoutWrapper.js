'use client';
import { Provider as ReduxProvider } from 'react-redux';
import store from "@/components/Dashboard/userStore"
export default function ClientLayoutWrapper({ children }) {
  return (
    <ReduxProvider store={store}>
      {children}
    </ReduxProvider>
  );
}
