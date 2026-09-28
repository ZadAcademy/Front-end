import { getTranslations } from 'next-intl/server';
import ImportCertificatesForm from './components/import-certificates-form';

export default async function ImportCertificatesPage() {
  const t = await getTranslations('Dashboard.certificates');

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
      <div className="flex flex-col gap-1">
        <h1 className="font-cairo-bold-2xl text-greyDark">
          {t('pageTitle', { defaultValue: 'Import Certificates' })}
        </h1>
        <p className="font-cairo-medium-sm text-greyNormal">
          {t('pageSubtitle', { defaultValue: 'Upload a file to bulk import student certificates into the system.' })}
        </p>
      </div>

      <div className="w-full">
        <ImportCertificatesForm />
      </div>
    </div>
  );
}
