import { User, Briefcase } from 'lucide-react';
import { InstructorCardProps } from '../lib/types/expert';
import { FaLinkedin,FaFacebookF  } from "react-icons/fa";
import Image from 'next/image';

export function InstructorCard({
  name,
  description,
  experience,
}: InstructorCardProps) {
  return (
    <div className="bg-blueLight rounded-2xl p-6 flex flex-col items-center text-center shadow-sm border border-black/5 transition-all duration-300 hover:shadow-md  h-full cursor-grab">
      {/* ─── Avatar Placeholder ─── */}
      <div className="w-32 h-32 rounded-full bg-black/10 flex items-center justify-center mb-6 border-4 border-white shadow-sm overflow-hidden">
        {/* Placeholder if no actual image is passed yet */}
        <User className="size-12 text-black/20" />
      </div>

      {/* ─── Info ─── */}
      <h3 className="font-cairo-bold-2xl text-black leading-tight mb-2">
        {name}
      </h3>
      
      {/* ─── Extra info (Role & Experience) ─── */}
      { experience && (
        <div className="flex flex-col flex-wrap items-center justify-center gap-3 mb-4 text-blueNormal">
          {experience && (
            <div className="flex items-center gap-1 font-cairo-medium-sm bg-blueNormal px-3 py-1 mt-2 rounded-full">
              <Briefcase className="size-4 text-white" />
              <span className='text-white'>{experience}</span>
            </div>
          )}
        </div>
      )}

      <p className="font-cairo-medium-sm text-black/70 leading-relaxed max-w-sm mt-auto pb-4">
        {description}
      </p>

      {/* ─── Social / Extra Buttons ─── */}
      <div className="flex items-center gap-4 mt-2">
        <a href="#" aria-label="LinkedIn" className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center text-black/50 hover:bg-blueNormal hover:text-white transition-colors">
          <FaLinkedin size={24} />
        </a>
        <a href="#" aria-label="GitHub" className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center text-black/50 hover:bg-blueNormal hover:text-white transition-colors">
          <FaFacebookF />
        </a>
      </div>
    </div>
  );
}
