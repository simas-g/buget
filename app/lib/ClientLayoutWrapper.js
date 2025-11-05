'use client';
import { Provider as ReduxProvider } from 'react-redux';
import store from "@/components/Dashboard/userStore"
import { ThemeProvider } from "@/app/lib/ThemeContext";

export default function ClientLayoutWrapper({ children }) {
  return (
    <ThemeProvider>
      <ReduxProvider store={store}>
        {children}
      </ReduxProvider>
    </ThemeProvider>
  );
}
