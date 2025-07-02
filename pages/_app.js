// pages/_app.js
import dynamic from 'next/dynamic';
import './home.css';
import './auth.css';
import './index.css';
import './profile.css';
import './signup.css';
import './view-data.css';
import './visualisations.css';

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
