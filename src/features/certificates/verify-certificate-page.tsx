import VerifyCertificateForm from './components/verify-certificate-form';

export default function VerifyCertificatePage() {
  return (
    <div className="py-20 px-4  min-h-[calc(100vh-64px)] flex flex-col items-center justify-center relative">
      <div className="w-full">
        <VerifyCertificateForm />
      </div>
    </div>
  );
}
