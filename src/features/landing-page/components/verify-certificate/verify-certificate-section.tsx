import { getTranslations } from 'next-intl/server';
import { Award, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default async function VerifyCertificateSection() {
  const t = await getTranslations('LandingPage.verifyCertificateSection');

  return (
    <section id="verify-certificate" className="py-20 relative ">
      <div className="mx-auto max-w-[1450px] px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-[24px] border border-black/5 shadow-xl shadow-blueNormal/5 overflow-hidden flex flex-col md:flex-row items-center">
          
          {/* Text Content */}
          <div className="w-full md:w-1/2 p-8 lg:p-12 flex flex-col gap-6 text-center md:text-start">
            <div className="w-16 h-16 rounded-2xl bg-orangeNormal/10 flex items-center justify-center mx-auto md:mx-0">
              <Award className="size-8 text-orangeNormal" />
            </div>
            
            <h2 className="font-cairo-bold-3xl lg:font-cairo-bold-4xl text-greyDark leading-tight">
              {t('title', { defaultValue: 'Verify Your Certificate' })}
            </h2>
            
            <p className="font-cairo-medium-lg text-greyNormal max-w-lg mx-auto md:mx-0">
              {t('description', { defaultValue: 'Validate the authenticity of any Zad Academy certificate instantly by entering the unique certificate code.' })}
            </p>

            <ul className="flex flex-col gap-3 font-cairo-medium-base text-greyDark mx-auto md:mx-0 mt-2">
              <li className="flex items-center gap-3">
                <CheckCircle className="size-5 text-blueNormal shrink-0" />
                {t('feature1', { defaultValue: 'Instant online verification' })}
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="size-5 text-blueNormal shrink-0" />
                {t('feature2', { defaultValue: 'Check student and course details' })}
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="size-5 text-blueNormal shrink-0" />
                {t('feature3', { defaultValue: '100% secure and authentic' })}
              </li>
            </ul>
            
            <div className="mt-4">
              <Link 
                href="?verify=true"
                scroll={false}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r bg-blueNormal text-white font-cairo-bold-lg rounded-xl shadow-sm shadow-blueNormal/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 w-full md:w-auto"
              >
                <Award className="size-6" />
                {t('button', { defaultValue: 'Verify Now' })}
              </Link>
            </div>
          </div>

          {/* Image/Decoration Content */}
          <div className="w-full md:w-1/2 bg-blueLight/30 h-full min-h-[400px] flex items-center justify-center relative p-8">
            <div className="absolute inset-0 bg-grid-black/[0.02] [mask-image:linear-gradient(to_bottom,white,transparent)]" />
            
            <div className="relative z-10 bg-white p-6 rounded-2xl shadow-2xl border border-black/5 rotate-3 hover:rotate-0 transition-transform duration-500 max-w-md w-full">
              <div className="border-2 border-dashed border-orangeNormal/30 rounded-xl p-8 text-center flex flex-col items-center gap-4 bg-orangeNormal/5">
                <Award className="size-16 text-orangeNormal" />
                <h3 className="font-cairo-bold-2xl text-greyDark">أكاديمية زاد</h3>
                <p className="font-cairo-medium-sm text-greyNormal">Certificate of Completion</p>
                <div className="w-24 h-1 bg-blueNormal rounded-full mt-2" />
                <div className="w-full flex justify-between mt-6 text-start">
                  <div>
                    <div className="font-cairo-medium-xs text-greyNormal">Code</div>
                    <div className="font-cairo-bold-sm text-greyDark">CERT-12345</div>
                  </div>
                  <div className="text-end">
                    <div className="font-cairo-medium-xs text-greyNormal">Date</div>
                    <div className="font-cairo-bold-sm text-greyDark">2026-1-5</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
