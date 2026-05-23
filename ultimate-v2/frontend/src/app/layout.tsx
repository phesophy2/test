import './globals.css';
import { Providers } from './providers';

export const metadata = {
  title: 'KhmerGhost Ultimate',
  description: 'Global Enterprise Automation Platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
