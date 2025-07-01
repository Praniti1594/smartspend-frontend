// pages/_app.js
import dynamic from 'next/dynamic';
import './home.css'; // or your current CSS file

const ClientOnlyToaster = dynamic(
  () => import('react-hot-toast').then(mod => mod.Toaster),
  { ssr: false }
);

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <ClientOnlyToaster position="top-right" reverseOrder={false} />
    </>
  );
}
