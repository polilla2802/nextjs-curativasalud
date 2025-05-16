import "./globals.css";

export const metadata = {
  title: "Curativa Salud Cannabis",
  description: "Tarjetas Miembros",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
