import type { Metadata } from 'next';
import '@/styles/globals.css';
import { CartProvider } from '@/lib/CartContext';
import ShopNavbar from '@/Components/ShopNavbar';

export const metadata: Metadata = {
  title: 'Fitness Gear - Premium Workout & Recovery Equipment',
  description: 'Enhance your workout and recovery with our range of massage and fitness equipment for peak performance',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <div className="min-h-screen">
            <ShopNavbar />
            <main>{children}</main>
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
