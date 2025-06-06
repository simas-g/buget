import { Inter, Roboto } from 'next/font/google'
import "./globals.css";
import Footer from '@/components/UI/Footer';

const inter = Inter({
  subsets: ['latin', 'latin-ext'], 
  display: 'swap',
})

const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
})
export const metadata = {
  title: "Buget.lt - tavo finansų valdymo įrankis",
  description: "Buget.lt - tavo finansų valdymo įrankis",
};

export default function RootLayout({ children }) {
  return (
    <html lang="lt">
      <head><link rel="icon" href="/favicon.svg"></link></head>
      <body className={`${inter.variable} ${roboto.variable} font-sans antialiased`}>

        {children}
        <Footer/>
      </body>
    </html>
  );
}
